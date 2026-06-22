const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

type ApiErrorBody = {
  message?: string;
  errors?: string[];
  attemptsLeft?: number;
};

export type LoginBody = {
  email?: string;
  mobile?: string;
  password: string;
};

export type RegisterBody = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordBody = {
  input: string;
  isChange?: boolean;
  primaryUser?: string;
};

export type VerifyEmailOtpBody = {
  email: string;
  otp?: string;
  action?: "resend";
};

export type VerifyMobileOtpBody = {
  mobile: string;
  otp?: string;
  action?: "resend";
};

export type ResetPasswordBody = {
  newPassword: string;
  confirmPassword: string;
  token: string;
};

class ApiRequestError extends Error {
  status: number;
  attemptsLeft?: number;

  constructor(message: string, status: number, attemptsLeft?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.attemptsLeft = attemptsLeft;
  }
}

export type ApiUser = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  avatar?: string;
  role?: string;
  plan?: string;
  subscriptionStatus?: string;
};

export type WorkspaceDto = {
  _id: string;
  projectName: string;
  category: string;
  style: string;
  sections: string[];
  thumbnail?: string;
  components?: unknown[];
  designTokens?: unknown;
  createdAt: string;
  updatedAt: string;
};

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("stackly-auth-token");
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("stackly-auth-token", token);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("stackly-refresh-token");
}

export function setAuthTokens(token: string, refreshToken?: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("stackly-auth-token", token);
  if (refreshToken) {
    window.localStorage.setItem("stackly-refresh-token", refreshToken);
  }
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("stackly-auth-token");
  window.localStorage.removeItem("stackly-refresh-token");
}

async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const data = (await response.json().catch(() => ({}))) as ApiErrorBody;

  if (!response.ok) {
    const message =
      data.message || data.errors?.join(", ") || "Request failed";
    throw new ApiRequestError(message, response.status, data.attemptsLeft);
  }

  return data as T;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const data = await apiRequest<{ token?: string; refreshToken?: string }>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (!data.token) return null;
  setAuthTokens(data.token, data.refreshToken);
  return data.token;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const next = `${window.location.pathname}${window.location.search}`;
  window.location.href = `/login?next=${encodeURIComponent(next)}`;
}

async function authenticatedApiRequest<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  const token = getAuthToken();
  try {
    return await apiRequest<T>(path, {
      ...init,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401 && !retried) {
      const nextToken = await refreshAccessToken().catch(() => null);
      if (nextToken) {
        return authenticatedApiRequest<T>(path, init, true);
      }
      clearAuthToken();
      redirectToLogin();
    }
    throw error;
  }
}

export function isApiConnectionError(error: unknown) {
  return (
    error instanceof TypeError ||
    (error instanceof Error &&
      (error.message === "Failed to fetch" ||
        error.message.includes("NetworkError") ||
        error.message.includes("load failed")))
  );
}

/** POST /api/auth/register */
export async function register(body: RegisterBody): Promise<unknown> {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** POST /api/auth/login */
export async function login(body: LoginBody): Promise<{ token?: string; refreshToken?: string; message?: string; userType?: string; user?: ApiUser }> {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getProfile(): Promise<{ user: ApiUser }> {
  return authenticatedApiRequest("/user/profile");
}

export async function updateProfile(body: { name?: string; avatar?: string }): Promise<{ message?: string; user: ApiUser }> {
  return authenticatedApiRequest("/user/profile", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function createWorkspace(body: {
  projectName: string;
  category?: string;
  style?: string;
  sections?: string[];
  components?: unknown[];
  designTokens?: unknown;
}): Promise<{ workspace: WorkspaceDto }> {
  return authenticatedApiRequest("/workspace/create", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getWorkspaces(): Promise<{ projects: WorkspaceDto[] }> {
  return authenticatedApiRequest("/workspace/list");
}

export async function getWorkspace(id: string): Promise<{ workspace: WorkspaceDto }> {
  return authenticatedApiRequest(`/workspace/${id}`);
}

export async function updateWorkspace(id: string, body: Partial<WorkspaceDto> & { projectName?: string }): Promise<{ workspace: WorkspaceDto }> {
  return authenticatedApiRequest(`/workspace/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteWorkspace(id: string): Promise<{ message?: string }> {
  return authenticatedApiRequest(`/workspace/${id}`, { method: "DELETE" });
}

export async function duplicateWorkspace(id: string): Promise<{ workspace: WorkspaceDto }> {
  return authenticatedApiRequest(`/workspace/${id}/duplicate`, { method: "POST" });
}

export async function updateWorkspaceSettings(id: string, body: Record<string, unknown>): Promise<{ workspace: WorkspaceDto }> {
  return authenticatedApiRequest(`/workspace/${id}/settings`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export interface WorkspaceStatePayload {
  workspaceId?: string;
  pageData?: Record<string, unknown>;
  builderData?: {
    components?: unknown[];
    [key: string]: unknown;
  };
  updatedAt?: string;
}

export async function loadWorkspaceState(id: string): Promise<{ state: WorkspaceStatePayload }> {
  return authenticatedApiRequest(`/workspace/${id}/state`);
}

export async function saveWorkspaceState(id: string, body: { pageData?: unknown; builderData?: unknown }): Promise<{ state: WorkspaceStatePayload }> {
  return authenticatedApiRequest(`/workspace/${id}/state`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function createStripeCheckout(body: { priceId?: string } = {}): Promise<{ checkoutUrl: string; sessionId: string }> {
  return authenticatedApiRequest("/payment/create-checkout", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function cancelSubscription(body: { subscriptionId?: string } = {}): Promise<{ message?: string; user?: ApiUser }> {
  return authenticatedApiRequest("/payment/cancel", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** POST /api/auth/forgot-password */
export async function forgotPassword(body: ForgotPasswordBody): Promise<{ message?: string; otp?: string; moveToVerify?: boolean }> {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** POST /api/auth/verify-email */
export async function verifyEmailOtp(body: VerifyEmailOtpBody): Promise<{ token?: string; message?: string; otp?: string }> {
  return apiRequest("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** POST /api/auth/verify-mobile */
export async function verifyMobileOtp(body: VerifyMobileOtpBody): Promise<{ token?: string; message?: string; otp?: string }> {
  return apiRequest("/auth/verify-mobile", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** POST /api/auth/reset-password */
export async function resetPassword(body: ResetPasswordBody): Promise<{ message?: string }> {
  const { token, ...payload } = body;

  return apiRequest("/auth/reset-password", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

/** POST /api/auth/send-email-otp */
export async function sendEmailOtp(email: string): Promise<{ message?: string; otp?: string }> {
  return apiRequest("/auth/send-email-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/** POST /api/auth/send-mobile-otp */
export async function sendMobileOtp(mobile: string): Promise<{ message?: string; otp?: string }> {
  return apiRequest("/auth/send-mobile-otp", {
    method: "POST",
    body: JSON.stringify({ mobile }),
  });
}

/** GET /api/payment/subscription */
export async function getSubscription(): Promise<{
  subscription: unknown;
  plan: string;
  subscriptionStatus: string;
}> {
  return authenticatedApiRequest("/payment/subscription");
}

// ─── Templates ──────────────────────────────────────────────

export type TemplateDto = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  thumbnail?: string;
  previewUrl?: string;
  sections?: string[];
  style?: string;
  tags?: string[];
  featured?: boolean;
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
};

/** GET /api/template/list */
export async function getTemplates(query?: {
  category?: string;
  search?: string;
}): Promise<{ templates: TemplateDto[] }> {
  const params = new URLSearchParams();
  if (query?.category) params.set("category", query.category);
  if (query?.search) params.set("search", query.search);
  const qs = params.toString();
  return apiRequest(`/template/list${qs ? `?${qs}` : ""}`, {});
}

/** GET /api/template/:idOrSlug */
export async function getTemplate(
  idOrSlug: string
): Promise<{ template: TemplateDto }> {
  return apiRequest(`/template/${idOrSlug}`, {});
}

/** POST /api/template/:id/use — clone template into user workspace */
export async function useTemplate(
  id: string
): Promise<{ message: string; workspace: WorkspaceDto }> {
  return authenticatedApiRequest(`/template/${id}/use`, { method: "POST" });
}

// ─── Analytics ──────────────────────────────────────────────

/** GET /api/analytics/:workspaceId */
export async function getProjectAnalytics(
  workspaceId: string,
  days?: number
): Promise<{
  totalViews: number;
  uniqueVisitors: number;
  days: number;
  dailyViews: { date: string; views: number }[];
  topPages: { path: string; views: number }[];
}> {
  const qs = days ? `?days=${days}` : "";
  return authenticatedApiRequest(`/analytics/${workspaceId}${qs}`);
}

// ─── Blog ──────────────────────────────────────────────────

export type BlogPostDto = {
  _id: string;
  workspaceId: string;
  title: string;
  slug: string;
  content?: unknown;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  status: string;
  seo?: { title?: string; description?: string; keywords?: string };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export async function createBlogPost(
  body: { workspaceId: string; title: string; content?: unknown; status?: string; [key: string]: unknown }
): Promise<{ post: BlogPostDto }> {
  return authenticatedApiRequest("/blog/post", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getBlogPosts(workspaceId: string): Promise<{ posts: BlogPostDto[] }> {
  return authenticatedApiRequest(`/blog/posts/${workspaceId}`);
}

export async function getBlogPost(id: string): Promise<{ post: BlogPostDto }> {
  return authenticatedApiRequest(`/blog/post/${id}`);
}

export async function updateBlogPost(
  id: string,
  body: Partial<BlogPostDto>
): Promise<{ post: BlogPostDto }> {
  return authenticatedApiRequest(`/blog/post/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteBlogPost(id: string): Promise<{ message?: string }> {
  return authenticatedApiRequest(`/blog/post/${id}`, { method: "DELETE" });
}

// ─── Domain ──────────────────────────────────────────────────

export async function generateSubdomain(workspaceId: string): Promise<{ domain: unknown }> {
  return authenticatedApiRequest(`/domain/${workspaceId}/subdomain`, { method: "POST" });
}

export async function setCustomDomain(workspaceId: string, customDomain: string): Promise<{ domain: unknown }> {
  return authenticatedApiRequest(`/domain/${workspaceId}/custom`, {
    method: "PUT",
    body: JSON.stringify({ customDomain }),
  });
}

export async function verifyDns(workspaceId: string): Promise<{ verified: boolean; message: string }> {
  return authenticatedApiRequest(`/domain/${workspaceId}/verify-dns`, { method: "POST" });
}

export async function getDomain(workspaceId: string): Promise<{ domain: unknown }> {
  return authenticatedApiRequest(`/domain/${workspaceId}`);
}

// ─── Publish ──────────────────────────────────────────────────

export async function publishSite(workspaceId: string): Promise<{ deployment: unknown }> {
  return authenticatedApiRequest(`/publish/${workspaceId}`, { method: "POST" });
}

export async function getDeployments(workspaceId: string): Promise<{ deployments: unknown[] }> {
  return authenticatedApiRequest(`/publish/${workspaceId}/deployments`);
}

export async function getActiveDeployment(workspaceId: string): Promise<{ deployment: unknown }> {
  return authenticatedApiRequest(`/publish/${workspaceId}/active`);
}

export async function rollbackDeployment(workspaceId: string, deploymentId: string): Promise<{ deployment: unknown }> {
  return authenticatedApiRequest(`/publish/${workspaceId}/rollback/${deploymentId}`, { method: "POST" });
}

// ─── Template Wishlist ──────────────────────────────────────

/** GET /api/template/wishlist */
export async function getTemplateWishlist(): Promise<{ templates: TemplateDto[] }> {
  return authenticatedApiRequest("/template/wishlist");
}

/** POST /api/template/wishlist/:templateId */
export async function addTemplateToWishlist(templateId: string): Promise<{ added: boolean }> {
  return authenticatedApiRequest(`/template/wishlist/${templateId}`, { method: "POST" });
}

/** DELETE /api/template/wishlist/:templateId */
export async function removeTemplateFromWishlist(templateId: string): Promise<{ removed: boolean }> {
  return authenticatedApiRequest(`/template/wishlist/${templateId}`, { method: "DELETE" });
}

// ─── Template Cart ──────────────────────────────────────────

/** GET /api/template/cart */
export async function getTemplateCart(): Promise<{ templates: TemplateDto[] }> {
  return authenticatedApiRequest("/template/cart");
}

/** POST /api/template/cart/:templateId */
export async function addTemplateToCart(templateId: string): Promise<{ added: boolean }> {
  return authenticatedApiRequest(`/template/cart/${templateId}`, { method: "POST" });
}

/** DELETE /api/template/cart/:templateId */
export async function removeTemplateFromCart(templateId: string): Promise<{ removed: boolean }> {
  return authenticatedApiRequest(`/template/cart/${templateId}`, { method: "DELETE" });
}

// ─── E-commerce Products ────────────────────────────────────

export type ProductDto = {
  _id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  currency: string;
  images: string[];
  category: string;
  inventory: number;
  status: string;
  sku?: string;
  variants?: unknown[];
  options?: unknown[];
  createdAt: string;
  updatedAt: string;
};

/** POST /api/ecommerce/product */
export async function createProduct(body: {
  workspaceId: string;
  name: string;
  price: number;
  [key: string]: unknown;
}): Promise<{ product: ProductDto }> {
  return authenticatedApiRequest("/ecommerce/product", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** GET /api/ecommerce/products/:workspaceId */
export async function getProducts(workspaceId: string, query?: {
  status?: string;
  category?: string;
}): Promise<{ products: ProductDto[]; pagination: unknown }> {
  const params = new URLSearchParams();
  if (query?.status) params.set("status", query.status);
  if (query?.category) params.set("category", query.category);
  const qs = params.toString();
  return authenticatedApiRequest(`/ecommerce/products/${workspaceId}${qs ? `?${qs}` : ""}`);
}

/** Public GET /api/ecommerce/store/:workspaceId/products */
export async function getStoreProducts(workspaceId: string, query?: {
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ workspaceId: string; products: ProductDto[]; pagination: unknown }> {
  const params = new URLSearchParams();
  if (query?.category) params.set("category", query.category);
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return apiRequest(`/ecommerce/store/${workspaceId}/products${qs ? `?${qs}` : ""}`, {});
}

/** GET /api/ecommerce/product/:id */
export async function getProduct(id: string): Promise<{ product: ProductDto }> {
  return authenticatedApiRequest(`/ecommerce/product/${id}`);
}

/** PUT /api/ecommerce/product/:id */
export async function updateProduct(id: string, body: Partial<ProductDto>): Promise<{ product: ProductDto }> {
  return authenticatedApiRequest(`/ecommerce/product/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/** DELETE /api/ecommerce/product/:id */
export async function deleteProduct(id: string): Promise<{ message?: string }> {
  return authenticatedApiRequest(`/ecommerce/product/${id}`, { method: "DELETE" });
}

// ─── E-commerce Cart ────────────────────────────────────────

export type CartItemDto = {
  _id: string;
  product: ProductDto;
  quantity: number;
  addedAt: string;
  lineTotal: number;
};

/** GET /api/cart/:workspaceId */
export async function getCart(workspaceId: string): Promise<{ items: CartItemDto[]; total: number; currency: string }> {
  return authenticatedApiRequest(`/cart/${workspaceId}`);
}

/** POST /api/cart/:workspaceId/items */
export async function addCartItem(workspaceId: string, body: {
  productId: string;
  quantity?: number;
}): Promise<{ message: string; cart: unknown }> {
  return authenticatedApiRequest(`/cart/${workspaceId}/items`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** PUT /api/cart/:workspaceId/items/:itemId */
export async function updateCartItem(workspaceId: string, itemId: string, body: {
  quantity: number;
}): Promise<{ message: string; cart: unknown }> {
  return authenticatedApiRequest(`/cart/${workspaceId}/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/** DELETE /api/cart/:workspaceId/items/:itemId */
export async function removeCartItem(workspaceId: string, itemId: string): Promise<{ message: string; cart: unknown }> {
  return authenticatedApiRequest(`/cart/${workspaceId}/items/${itemId}`, { method: "DELETE" });
}

/** DELETE /api/cart/:workspaceId (clear cart) */
export async function clearCart(workspaceId: string): Promise<{ message: string }> {
  return authenticatedApiRequest(`/cart/${workspaceId}`, { method: "DELETE" });
}

// ─── E-commerce Wishlist ────────────────────────────────────

/** GET /api/wishlist/:workspaceId */
export async function getWishlistItems(workspaceId: string): Promise<{ products: ProductDto[] }> {
  return authenticatedApiRequest(`/wishlist/${workspaceId}`);
}

/** POST /api/wishlist/:workspaceId/:productId */
export async function addToWishlist(workspaceId: string, productId: string): Promise<{ added: boolean }> {
  return authenticatedApiRequest(`/wishlist/${workspaceId}/${productId}`, { method: "POST" });
}

/** DELETE /api/wishlist/:workspaceId/:productId */
export async function removeFromWishlist(workspaceId: string, productId: string): Promise<{ removed: boolean }> {
  return authenticatedApiRequest(`/wishlist/${workspaceId}/${productId}`, { method: "DELETE" });
}

// ─── Checkout & Orders ──────────────────────────────────────

export type OrderItemDto = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderDto = {
  _id: string;
  workspaceId: string;
  userId?: string;
  items: OrderItemDto[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  paymentProvider: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentStatus: string;
  status: string;
  customerEmail: string;
  customerName: string;
  billingDetails?: unknown;
  shippingAddress?: unknown;
  orderNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CheckoutPaymentInfo = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

/** POST /api/checkout/create-order */
export async function createCheckoutOrder(body: {
  workspaceId: string;
  items?: { productId: string; quantity: number }[];
  billingDetails?: unknown;
  shippingAddress?: unknown;
  customerEmail?: string;
  customerName?: string;
  orderNotes?: string;
  tax?: number;
  shippingCost?: number;
}): Promise<{ order: OrderDto; payment: CheckoutPaymentInfo }> {
  return authenticatedApiRequest("/checkout/create-order", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** POST /api/checkout/verify-payment */
export async function verifyCheckoutPayment(body: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  orderId?: string;
}): Promise<{ verified: boolean; message: string; order?: OrderDto }> {
  return authenticatedApiRequest("/checkout/verify-payment", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** GET /api/checkout/orders */
export async function getOrders(query?: {
  workspaceId?: string;
  status?: string;
  paymentStatus?: string;
}): Promise<{ orders: OrderDto[]; pagination: unknown }> {
  const params = new URLSearchParams();
  if (query?.workspaceId) params.set("workspaceId", query.workspaceId);
  if (query?.status) params.set("status", query.status);
  if (query?.paymentStatus) params.set("paymentStatus", query.paymentStatus);
  const qs = params.toString();
  return authenticatedApiRequest(`/checkout/orders${qs ? `?${qs}` : ""}`);
}

/** GET /api/checkout/orders/:id */
export async function getOrder(id: string): Promise<{ order: OrderDto }> {
  return authenticatedApiRequest(`/checkout/orders/${id}`);
}
