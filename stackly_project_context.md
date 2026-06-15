# Stackly — Website Builder Application: Complete Project Context

> **Purpose**: This document is a single-source-of-truth context payload. Feed it (or relevant sections) to any AI model to get accurate, project-aware responses for frontend, backend, cloud, or planning prompts.

---

## 1. Product Overview

**Stackly** is a no-code, drag-and-drop website builder (think simplified Wix/Squarespace) that lets users:

1. Sign up / log in (email, mobile, Google OAuth)
2. Choose a project type (E-commerce, Portfolio, Blog, Business)
3. Pick a template style (Modern, Minimal, Bold) and sections
4. Build pages visually with a drag-and-drop canvas
5. Preview in Desktop / Tablet / Mobile viewports
6. Export to static HTML or publish to a hosted subdomain
7. (Future) Add e-commerce, blog CMS, analytics, AI content generation

**Brand**: "Stackly" — tagline: "Drag and Drop Website Builder"  
**Domain**: thestackly.com (planned), currently deployed via GitHub Pages  
**Logo**: `/public/stackly-logo.webp`, favicon: `/public/stackly-title-icon.webp`

---

## 2. Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 | `output: "export"` (static site generation) |
| Language | TypeScript | ^5 | Strict mode |
| UI Library | React | 19.2.3 | Server + Client components |
| Styling | Tailwind CSS v4 + globals.css (83KB) | ^4 | PostCSS pipeline |
| State | Zustand | ^5.0.13 | Two stores: `builderStore`, `assetStore` |
| Drag & Drop | @dnd-kit/core + sortable | ^6.3.1 / ^10.0.0 | Pointer sensor, vertical list strategy |
| Animation | Framer Motion | ^12.40.0 | Page transitions, component animations |
| Icons | Lucide React + React Icons | ^1.14.0 / ^5.5.0 | Lucide for builder, React Icons for marketing pages |
| Auth (planned) | next-auth | ^4.24.13 | Installed but NOT wired up yet |
| Payment | Razorpay (client SDK) | via CDN script | Standalone API server on port 3001 |
| IDs | uuid | ^14.0.0 | v4 for component + asset IDs |
| PDF | html2pdf.js | ^0.14.0 | Invoice generation in planning page |
| Deploy | GitHub Pages (gh-pages) | ^6.3.0 | `next build && gh-pages -d out` |
| Image Processing | sharp (dev) | ^0.34.5 | WebP conversion scripts |

### Build Configuration

```js
// next.config.mjs — key settings
{
  output: "export",           // Static HTML export (NO server-side)
  trailingSlash: true,        // /login/ not /login
  basePath: "",               // Configurable for GitHub Pages subpath
  images: { unoptimized: true }, // No Next.js image optimization (static)
}
```

### NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `node scripts/dev-with-razorpay.mjs` | Runs Next.js dev + Razorpay API server |
| `dev:next` | `node scripts/dev-safe.mjs` | Next.js dev only (no payment server) |
| `razorpay-api` | `node scripts/razorpay-api-server.mjs` | Standalone payment API on :3001 |
| `build` | `next build` | Production build (static export to `/out`) |
| `deploy` | `next build && gh-pages -d out` | Build + deploy to GitHub Pages |

---

## 3. Directory Structure

```
d:\stackly\Workplace\Website-Builder-Application\
│
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (Lora + Geist Mono fonts, NavBar, loading overlay)
│   ├── page.tsx                  # Root redirect/home
│   ├── globals.css               # 83KB master stylesheet
│   ├── login.css                 # Auth pages styling
│   │
│   ├── login/page.tsx            # 27KB — Login page (email/mobile + password)
│   ├── signup/page.tsx           # 36KB — Registration (name, email, mobile, password)
│   ├── forgot-password/page.tsx  # Password recovery initiation
│   ├── verify-email/page.tsx     # 4-digit OTP verification (email)
│   ├── verify-mobile/page.tsx    # 4-digit OTP verification (mobile)
│   ├── create-new-password/page.tsx # Password reset form (post-OTP)
│   ├── verified/                 # Success confirmation page
│   │
│   ├── landing/page.tsx          # 62KB — Marketing landing page
│   ├── aboutus/page.tsx          # 17KB — About us page
│   ├── contact/page.tsx          # 12KB — Contact page
│   │
│   ├── builder/page.tsx          # Builder entry (loads BuilderLayout)
│   ├── blockpages/               # Block showcase/demo pages
│   │   ├── BlockPagesClient.tsx
│   │   ├── buttonblock/
│   │   ├── imageblock/
│   │   ├── textblock/
│   │   └── preview/
│   │
│   ├── planning/page.tsx         # 46KB — Pricing plans + invoice generation
│   ├── portfolio/page.tsx        # 64KB — Portfolio template showcase
│   ├── blog/                     # Blog section
│   │   ├── page.tsx              # 29KB — Blog listing
│   │   ├── blog.css              # 39KB — Blog styles
│   │   └── layout.tsx
│   ├── e-commerce/page.tsx       # 96KB — E-commerce showcase/demo
│   │
│   ├── backend-error/            # Backend connection error page
│   └── page-not-found/           # Custom 404
│
├── components/
│   ├── navBar.tsx                # 41KB — Global navigation bar
│   ├── Footer.tsx                # 17KB — Global footer
│   ├── CreateProjectFlow.tsx     # 13KB — 4-step project creation wizard
│   ├── NavBarShell.tsx           # Client wrapper for NavBar
│   ├── AuthGoogleButton.tsx      # Google OAuth button
│   ├── RouteLoadingOverlay.tsx   # Route transition overlay
│   ├── StacklyLoader.tsx         # Loading spinner
│   ├── ResetFlowBackButton.tsx   # Back button for reset flow
│   │
│   ├── builder/                  # Builder UI components
│   │   ├── BuilderLayout.tsx     # 12KB — Main builder layout (DnD context)
│   │   ├── Canvas.tsx            # 13KB — Drop zone + toolbar
│   │   ├── CanvasItem.tsx        # Individual item wrapper
│   │   ├── ComponentPalette.tsx  # 9KB — Left sidebar block picker
│   │   ├── PropertyEditor.tsx    # 12KB — Right sidebar property panel
│   │   ├── PreviewModal.tsx      # 4KB — Full-screen preview with device toggle
│   │   ├── SortableItem.tsx      # Sortable wrapper for DnD
│   │   ├── InlineText.tsx        # Inline text editing
│   │   ├── LayersPanel.tsx       # Layer/component tree view
│   │   ├── ExportButton.tsx      # HTML export button
│   │   ├── PanelFields.tsx       # Shared panel field components
│   │   └── panel/
│   │       ├── StyleTab.tsx      # Style editing tab
│   │       └── controls/         # Style control components
│   │
│   ├── draggable/                # 17 canvas-rendered component types
│   │   ├── HeadingComponent.tsx
│   │   ├── TextComponent.tsx
│   │   ├── ButtonComponent.tsx
│   │   ├── ImageComponent.tsx
│   │   ├── VideoComponent.tsx
│   │   ├── IconComponent.tsx
│   │   ├── InputComponent.tsx
│   │   ├── DividerComponent.tsx
│   │   ├── ColumnsComponent.tsx
│   │   ├── ContainerComponent.tsx
│   │   ├── GalleryComponent.tsx
│   │   ├── HeroComponent.tsx
│   │   ├── NavigationComponent.tsx
│   │   ├── FeaturesComponent.tsx
│   │   ├── FeatureItemComponent.tsx
│   │   ├── ContactComponent.tsx
│   │   └── componentStyles.ts
│   │
│   ├── blocks/                   # Migrated block specs (new architecture)
│   │   ├── hero/          → spec.ts + HeroPanel.tsx
│   │   ├── navigation/    → spec.ts + NavigationPanel.tsx
│   │   ├── feature-item/  → spec.ts + (panel in draggable)
│   │   ├── features/      → spec.ts + (panel in draggable)
│   │   ├── contact/       → spec.ts + (panel in draggable)
│   │   ├── video/         → spec.ts + (panel in draggable)
│   │   └── image/         → ImagePanel.tsx
│   │
│   ├── blog/
│   │   ├── BlogHeader.tsx        # 14KB — Blog header component
│   │   └── BlogHeroTrendArrow.tsx
│   │
│   └── assets/                   # Asset management UI
│       ├── AssetManager.tsx      # 12KB — Asset library modal
│       ├── AssetCard.tsx         # Individual asset card
│       ├── DropZone.tsx          # File drop zone
│       └── ImagePicker.tsx       # 10KB — Image selection picker
│
├── store/
│   ├── builderStore.ts           # 18KB — Builder state (Zustand)
│   └── assetStore.ts             # 6KB — Asset management state (Zustand)
│
├── types/
│   ├── builder.ts                # 9KB — All builder TypeScript interfaces
│   └── assets.ts                 # 1KB — Asset type definitions
│
├── hooks/
│   └── useBuilder.ts             # Builder store hook wrapper
│
├── lib/
│   ├── api.ts                    # 4KB — Backend API client (auth endpoints)
│   ├── blockRegistry.ts          # 8KB — Block spec registry system
│   ├── componentRegistry.ts      # 2KB — Component renderer registry
│   ├── exportHtml.ts             # 6KB — JSON→HTML export engine
│   ├── googleAuth.ts             # 1KB — Google OAuth URL builder
│   ├── razorpayClient.ts         # 6KB — Razorpay checkout integration
│   ├── assetDb.ts                # 3KB — IndexedDB wrapper for assets
│   ├── assetUtils.ts             # 3KB — Image compression/thumbnail utils
│   ├── emailValidation.ts        # 7KB — Email validation rules
│   ├── paths.ts                  # 1KB — Base path + route helpers
│   ├── htmlUtils.ts              # HTML escape utility
│   ├── motion.ts                 # Framer Motion presets
│   ├── otpInputHandlers.ts       # OTP input field handlers
│   ├── planningInvoiceHtml.ts    # 26KB — Invoice HTML template
│   ├── signupPhoneCountries.ts   # 8KB — Country code data
│   ├── simpleMobileContact.ts    # Mobile contact form helpers
│   ├── authMobileTouch.ts        # Mobile auth touch handlers
│   ├── authPlaceholderFit.ts     # Auth placeholder fitting
│   ├── resetFlowValidation.ts    # Password reset validation
│   ├── blogCategories.ts         # Blog category data
│   └── html2pdf.d.ts             # Type declaration for html2pdf
│
├── scripts/
│   ├── dev-safe.mjs              # Safe dev server launcher
│   ├── dev-with-razorpay.mjs     # Dev + Razorpay API launcher
│   ├── razorpay-api-server.mjs   # Standalone Razorpay API (port 3001)
│   ├── convert-png-to-webp.cjs   # Image conversion script
│   └── compress-webp-to-100kb.cjs # Image compression script
│
├── test/controllers/
│   └── authController.js         # 17KB — Backend auth controller (Node.js/Express reference)
│
└── public/                       # 109 static assets (images, icons, SVGs)
    ├── stackly-logo.webp
    ├── stackly-title-icon.webp
    ├── landing-optimized/        # Optimized landing page images
    ├── blog/                     # Blog images
    └── market/                   # Marketplace images
```

---

## 4. Core Architecture Patterns

### 4.1 Block Spec System (Key Pattern)

The builder uses a **registry-based architecture** where each component type is defined by a `BlockSpec<P>`:

```typescript
interface BlockSpec<P> {
  type: ComponentType;          // "hero" | "navigation" | ...
  label: string;                // Display name
  group: "layout" | "content" | "media" | "form" | "navigation";
  icon: React.ComponentType;    // Lucide icon
  defaults: P;                  // Default props
  read: (component: BuilderComponent) => P;  // Reader (handles legacy + typed)
  Renderer: React.ComponentType<RendererProps>;  // Canvas renderer
  Panel: React.ComponentType<PanelProps<P>>;     // Property editor panel
  exportHtml: (data: P, styleAttr: string) => string;  // HTML export
  accepts?: ComponentType[] | "any" | "none";    // Container slots
  ai?: { description: string; exampleOutput: P }; // AI generation hints
}
```

**Currently migrated to BlockSpec**: `hero`, `navigation`, `feature-item`, `contact`, `features`, `video`  
**Still using legacy `content` string**: `heading`, `text`, `button`, `image`, `icon`, `columns`, `input`, `divider`, `gallery`, `container`

### 4.2 State Management (Zustand)

**Builder Store** (`store/builderStore.ts`):
- `components: BuilderComponent[]` — flat tree of page components
- `selectedComponentId` — currently selected component
- `history/future` — undo/redo stacks (max 50)
- `viewport` — current editing viewport (desktop/tablet/mobile)
- Actions: `addComponent`, `updateComponent`, `deleteComponent`, `duplicateComponent`, `reorderComponents`, `loadStarterWebsite`, `loadWebsiteFromRequirements`, `exportHtml`, `undo`, `redo`, `saveToLocalStorage`, `loadFromLocalStorage`

**Asset Store** (`store/assetStore.ts`):
- `assets: Asset[]` — metadata loaded from IndexedDB
- `objectUrls: Record<string, string>` — cached blob URLs
- Actions: `loadAssets`, `uploadFiles`, `deleteAsset`, `getUrl`, `getDataUrl`, `cleanup`

### 4.3 Component Data Model

```typescript
// The core data structure saved as JSON
interface BuilderComponent {
  id: string;                    // UUID v4
  type: ComponentType;           // 16 types (see below)
  content: string;               // Legacy: pipe-delimited or plain text
  props?: Record<string, unknown>; // New: typed structured props
  styles: ComponentStyles;       // Inline styles
  children: BuilderComponent[];  // Nested components (containers)
  order: number;                 // Sort order
}

// 16 component types
type ComponentType =
  | "navigation" | "hero" | "heading" | "text" | "button"
  | "icon" | "feature-item" | "columns" | "image" | "input"
  | "divider" | "features" | "gallery" | "contact"
  | "container" | "video";

interface ComponentStyles {
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  fontSize?: string;
  width?: string;
  height?: string;
  textAlign?: "left" | "center" | "right";
  layoutCols?: string;
}
```

### 4.4 Typed Props Interfaces (Migrated Blocks)

```typescript
// NavigationProps
interface NavigationProps {
  schemaVersion?: number;
  brand: string;                    // Brand name text
  logoUrl?: string;                 // Future: logo image
  links: NavLink[];                 // Array of {label, href?, children?}
  cta: { label: string; href?: string; variant?: "primary"|"outline"|"ghost" };
  variant?: "default" | "centered" | "minimal";
  sticky?: boolean;
  mobileMenu?: { enabled?: boolean; breakpoint?: "sm"|"md"|"lg" };
}

// HeroProps
interface HeroProps {
  schemaVersion?: number;
  title: string;
  description: string;
  cta: { label: string; href?: string };
  layout?: "split" | "centered" | "stacked";
  align?: "left" | "center";
  media?: { type: "image"|"placeholder"; src?: string; alt?: string };
}

// ContactProps
interface ContactProps {
  schemaVersion?: number;
  title: string;
  description: string;
  inputPlaceholder: string;
  cta: { label: string; href?: string };
  form?: { action?: string; method?: "POST"|"GET"; successMessage?: string; fields?: FormField[] };
}

// FeaturesProps
interface FeaturesProps {
  schemaVersion?: number;
  heading?: string;
  items: FeatureRecord[];    // Array of {title, description, icon?, badge?}
  layout?: "grid" | "list" | "masonry";
  columns?: 2 | 3 | 4;
}

// VideoProps
interface VideoProps {
  url: string;               // YouTube/Vimeo URL
  title?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1";
}

// FeatureItemProps
interface FeatureItemProps {
  icon: string;              // Lucide icon name
  layout: "horizontal" | "card";
  title: string;
  description: string;
  cta: string;
}
```

### 4.5 Responsive Design Model

```typescript
type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
};

// Future: per-breakpoint style overrides
type ResponsiveStyles = {
  sm?: Partial<ComponentStyles>;  // 640px
  md?: Partial<ComponentStyles>;  // 768px
  lg?: Partial<ComponentStyles>;  // 1024px
};
```

### 4.6 Asset Management System

```typescript
interface Asset {
  id: string;           // UUID
  name: string;         // Original filename
  mimeType: string;     // image/png, image/webp, etc.
  size: number;         // Bytes (after compression)
  width?: number;
  height?: number;
  thumbnail: string;    // 160×160 WebP data-URL
  uploadedAt: number;   // Timestamp
  tags: string[];
}

// Storage: IndexedDB (two stores: "assets" metadata + "blobs" raw data)
// Migration path: Replace dbPutAsset/dbGetBlob with S3 API calls
// URL resolution: useAssetStore.getUrl(id) → object URL (cached)
```

---

## 5. Module-by-Module Status Audit

### MODULE 1: Authentication & User Management

| Task | Status | Details |
|---|---|---|
| Login UI | ✅ Done | `app/login/page.tsx` (27KB) — email/mobile + password, validation |
| Signup UI | ✅ Done | `app/signup/page.tsx` (36KB) — name, email, mobile, password, confirm |
| Forgot password UI | ✅ Done | `app/forgot-password/page.tsx` — email/mobile input |
| Email OTP verification UI | ✅ Done | `app/verify-email/page.tsx` — 4-digit OTP, timer, resend |
| Mobile OTP verification UI | ✅ Done | `app/verify-mobile/page.tsx` — 4-digit OTP, timer, resend |
| Password reset UI | ✅ Done | `app/create-new-password/page.tsx` — new password form |
| Google OAuth button | ✅ Done | `components/AuthGoogleButton.tsx` + `lib/googleAuth.ts` |
| API client (frontend) | ✅ Done | `lib/api.ts` — register, login, forgotPassword, verifyEmailOtp, verifyMobileOtp, resetPassword |
| Backend auth controller | ✅ Done | `test/controllers/authController.js` — Node.js/Express reference implementation (register, login, forgotPassword, verifyOtpByEmail, verifyOtpByMobile, resetPassword) |
| Email validation rules | ✅ Done | `lib/emailValidation.ts` — domain whitelist, format checks |
| OTP input handlers | ✅ Done | `lib/otpInputHandlers.ts` — auto-focus, paste handling |
| Backend error page | ✅ Done | `app/backend-error/` — shows when API is unreachable |
| Profile settings UI | ❌ Not started | No profile page exists |
| JWT/session storage (frontend) | ⚠️ Partial | Token received from API but no persistent session management |
| Plan tagging (Free/Premium) | ⚠️ Partial | Planning page shows plans but no user-level plan state |
| Payment gateway | ✅ Done | Razorpay integration: client SDK + standalone API server |
| Subscription lifecycle | ❌ Not started | No upgrade/downgrade/cancel flow |
| Feature access control | ❌ Not started | No gate based on plan |

**Backend Team Needs (Module 1)**:
- Deploy the auth controller to a proper Express/Fastify server with MongoDB
- Implement proper JWT refresh tokens + session management
- Set up email service (SendGrid/SES) for real OTP delivery
- Set up SMS service (Twilio/MSG91) for mobile OTP
- Implement Google OAuth callback endpoint (`GET /api/auth/google?code=...`)
- Create user profile CRUD endpoints (`GET/PUT /api/users/me`)
- Implement subscription state in user model (plan, expiresAt, stripeId)

---

### MODULE 2: Workspace & Dashboard

| Task | Status | Details |
|---|---|---|
| Dashboard UI | ❌ Not started | No dashboard page exists — user lands on `/landing` after login |
| Create Project flow | ✅ Done | `CreateProjectFlow.tsx` — 4-step wizard (name → category → style → sections) |
| Project listing | ❌ Not started | No "My Projects" view |
| Delete project | ❌ Not started | No project persistence |
| Duplicate project | ❌ Not started | No project persistence |
| Project settings | ❌ Not started | No settings page |
| Project state persistence | ⚠️ Partial | `localStorage` save/load only — no cloud persistence |

**Backend Team Needs (Module 2)**:
- Create Project CRUD API: `POST/GET/PUT/DELETE /api/projects`
- Project model: `{ id, userId, name, category, style, components: JSON, thumbnail, createdAt, updatedAt }`
- Auto-save endpoint: `PUT /api/projects/:id/autosave` (debounced from frontend)
- List user projects: `GET /api/projects?userId=...`
- Duplicate: `POST /api/projects/:id/duplicate`

---

### MODULE 3: Template Library

| Task | Status | Details |
|---|---|---|
| Template data structure | ⚠️ Partial | `categoryCopy` in builderStore defines per-category defaults (hero text, features) |
| Base templates | ⚠️ Partial | 4 categories defined (E-commerce, Portfolio, Blog, Business) with copy but no full template JSON |
| Template listing UI | ❌ Not started | No browse/filter template page |
| Template preview | ⚠️ Partial | Portfolio page (`app/portfolio/`) and E-commerce page (`app/e-commerce/`) serve as showcases |
| "Use Template" flow | ✅ Done | `loadWebsiteFromRequirements()` builds components from category selection |
| Clone template into project | ❌ Not started | No server-side template cloning |

**Backend Team Needs (Module 3)**:
- Template model: `{ id, name, category, style, thumbnail, components: JSON, isPremium, popularity }`
- CRUD: `GET /api/templates`, `GET /api/templates/:id`
- Admin: `POST/PUT/DELETE /api/admin/templates`
- Clone: `POST /api/templates/:id/clone` → creates new project from template

---

### MODULE 4: Drag-and-Drop Builder ⭐ (Most Complete)

| Task | Status | Details |
|---|---|---|
| Editor canvas UI | ✅ Done | `Canvas.tsx` — droppable zone, toolbar, viewport switcher |
| Drag-and-drop system | ✅ Done | @dnd-kit with palette→canvas + canvas reordering |
| Text component | ✅ Done | `HeadingComponent` + `TextComponent` with inline editing |
| Image component | ✅ Done | `ImageComponent` + `ImagePanel` with presets + asset picker |
| Video component | ✅ Done | `VideoComponent` with YouTube/Vimeo embed support |
| Button component | ✅ Done | `ButtonComponent` with style controls |
| Icon component | ✅ Done | `IconComponent` — 20+ Lucide icons picker |
| Component positioning | ✅ Done | Drag reordering + insert-after positioning |
| Layout system | ✅ Done | `ColumnsComponent` (2/3/4 cols) + `ContainerComponent` |
| Styling controls | ✅ Done | `StyleTab` — color, bg, padding, margin, border-radius, font-size, text-align |
| Component settings panel | ✅ Done | `PropertyEditor` with Content/Style/Advanced/Layers tabs |
| Save as JSON | ✅ Done | `saveToLocalStorage()` — serializes components array |
| Load JSON | ✅ Done | `loadFromLocalStorage()` — deserializes components |
| Undo/redo | ✅ Done | 50-step history with Ctrl+Z / Ctrl+Shift+Z |
| Navigation block | ✅ Done | Typed props, hamburger menu, responsive |
| Hero block | ✅ Done | Typed props, split/centered layouts |
| Features block | ✅ Done | Typed props, grid of feature cards |
| Feature Item block | ✅ Done | Typed props, horizontal/card layout |
| Contact block | ✅ Done | Typed props, email input + CTA |
| Gallery block | ✅ Done | Multi-image with captions |
| Divider | ✅ Done | Horizontal rule |
| Input component | ✅ Done | Form input placeholder |
| Container | ✅ Done | Generic wrapper for nested components |
| Keyboard shortcuts | ✅ Done | Ctrl+Z/Y, Ctrl+S, Ctrl+D, Delete, Escape |
| Inline text editing | ✅ Done | `InlineText.tsx` — click-to-edit on canvas |
| Layers panel | ✅ Done | `LayersPanel.tsx` — component tree view |
| Asset manager | ✅ Done | `AssetManager.tsx` — upload, browse, delete images from IndexedDB |
| Starter website | ✅ Done | One-click "Create Starter Website" loads 5 default blocks |
| Requirements-based generation | ✅ Done | Category-aware content generation from project wizard |

---

### MODULE 5: Preview & Responsive Design

| Task | Status | Details |
|---|---|---|
| Preview renderer | ✅ Done | `PreviewModal.tsx` — renders exported HTML in sandboxed iframe |
| Desktop preview | ✅ Done | Full-width frame |
| Mobile preview | ✅ Done | 375px frame |
| Tablet preview | ✅ Done | 768px frame |
| Responsive breakpoints | ⚠️ Partial | Viewport widths defined (1280/768/390) but no per-breakpoint style overrides saved yet |
| Live preview sync | ✅ Done | Preview re-generates HTML from current components on open |
| Browser chrome mockup | ✅ Done | Fake browser bar with traffic light dots |

---

### MODULE 6: Domain & Hosting

| Task | Status | Details |
|---|---|---|
| All tasks | ❌ Not started | No domain or hosting infrastructure |

**Cloud Team Needs (Module 6)**:
- Set up AWS Route 53 for DNS management
- Configure wildcard subdomain: `*.stackly.studio` → CloudFront/S3
- Implement custom domain flow: user inputs domain → generate CNAME record → verify DNS → provision SSL via ACM
- Nginx/CloudFront routing from subdomain to S3 bucket path

---

### MODULE 7: Publishing System

| Task | Status | Details |
|---|---|---|
| JSON → static HTML | ✅ Done | `lib/exportHtml.ts` — full HTML document generation |
| CSS generation | ✅ Done | Inline styles + embedded `<style>` block with responsive rules |
| Export/download | ✅ Done | `downloadHtml()` — creates blob and triggers download |
| Navigation responsive | ✅ Done | Hamburger menu with JS toggle in exported HTML |
| Publish button | ❌ Not started | No server-side publish |
| Deploy to S3 | ❌ Not started | No cloud deployment pipeline |
| Deployment status | ❌ Not started | No status tracking |
| Version history | ❌ Not started | No version storage |
| Rollback | ❌ Not started | No rollback mechanism |

**Cloud Team Needs (Module 7)**:
- S3 bucket per user or per project: `s3://stackly-sites/{userId}/{projectId}/`
- Lambda function: receive JSON → run exportHtml → upload to S3
- CloudFront invalidation after publish
- API: `POST /api/projects/:id/publish`, `GET /api/projects/:id/deployments`
- Store deployment versions in DynamoDB: `{ projectId, version, s3Key, publishedAt, status }`

---

### MODULE 8: E-commerce

| Task | Status | Details |
|---|---|---|
| E-commerce showcase page | ✅ Done | `app/e-commerce/page.tsx` (96KB) — product layouts, store templates |
| Product schema | ❌ Not started | No database model |
| Product CRUD APIs | ❌ Not started | |
| Cart system | ❌ Not started | |
| Checkout flow | ❌ Not started | |
| Payment integration | ⚠️ Partial | Razorpay client exists but tied to plan subscription, not product checkout |
| Order management | ❌ Not started | |

---

### MODULE 9: Blog & SEO

| Task | Status | Details |
|---|---|---|
| Blog page UI | ✅ Done | `app/blog/page.tsx` (29KB) + `blog.css` (39KB) |
| Blog header | ✅ Done | `components/blog/BlogHeader.tsx` (14KB) |
| Blog categories | ✅ Done | `lib/blogCategories.ts` — category data |
| Blog post schema | ❌ Not started | No database model |
| Blog editor UI | ❌ Not started | No rich text editor |
| Post CRUD | ❌ Not started | |
| Slug-based URLs | ❌ Not started | |
| SEO metadata fields | ❌ Not started | |
| Sitemap.xml | ❌ Not started | |
| Open Graph tags | ⚠️ Partial | Root layout has basic meta, but no per-page OG |

---

### MODULE 10: Analytics Dashboard

| Task | Status | Details |
|---|---|---|
| All tasks | ❌ Not started | No analytics infrastructure |

**Cloud Team Needs (Module 10)**:
- Tracking pixel/script injected into published sites
- API Gateway → Lambda → DynamoDB for event ingestion
- Aggregation queries for dashboard

---

### MODULE 11: AI Content Assistant

| Task | Status | Details |
|---|---|---|
| AI hints in block specs | ⚠️ Partial | `BlockSpec.ai` field defined with `description` + `exampleOutput` but not wired to any API |
| AI text generation | ❌ Not started | No API integration |
| AI image generation | ❌ Not started | |
| Layout suggestions | ❌ Not started | |

---

## 6. Existing API Contracts (Frontend → Backend)

### Base URL
```
NEXT_PUBLIC_API_BASE_URL = "http://localhost:5000/api"
```

### Auth Endpoints (Already Built in Frontend)

| Method | Path | Request Body | Response | Status |
|---|---|---|---|---|
| POST | `/auth/register` | `{ name, email, mobile, password, confirmPassword }` | `{ message }` | Frontend ✅ Backend ✅ (reference) |
| POST | `/auth/login` | `{ email?, mobile?, password }` | `{ message, token, userType }` | Frontend ✅ Backend ✅ (reference) |
| POST | `/auth/forgot-password` | `{ input, isChange?, primaryUser? }` | `{ message, otp?, moveToVerify? }` | Frontend ✅ Backend ✅ (reference) |
| POST | `/auth/verify-email` | `{ email, otp?, action?: "resend" }` | `{ token?, message, otp? }` | Frontend ✅ Backend ✅ (reference) |
| POST | `/auth/verify-mobile` | `{ mobile, otp?, action?: "resend" }` | `{ token?, message, otp? }` | Frontend ✅ Backend ✅ (reference) |
| POST | `/auth/reset-password` | `{ newPassword, confirmPassword }` + `Authorization: Bearer <token>` | `{ message }` | Frontend ✅ Backend ✅ (reference) |
| GET | `/auth/google?code=...&state=login\|signup` | (OAuth redirect) | Redirect to `/landing?token=...` | Frontend ✅ Backend ❌ |

### Payment Endpoints (Standalone Server on :3001)

| Method | Path | Request Body | Response |
|---|---|---|---|
| POST | `/api/razorpay/create-order` | `{ amountPaise, planName, billingPeriod }` | `{ orderId, amount, currency, keyId }` |
| POST | `/api/razorpay/verify` | `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }` | `{ verified: boolean }` |

### APIs Needed (Not Built Yet)

```
# User Profile
GET    /api/users/me                    → { id, name, email, mobile, plan, avatar }
PUT    /api/users/me                    → { name, avatar, ... }

# Projects
POST   /api/projects                    → { id, name, ... }
GET    /api/projects                    → [ { id, name, thumbnail, updatedAt } ]
GET    /api/projects/:id                → { id, name, components, ... }
PUT    /api/projects/:id                → { components, ... }
DELETE /api/projects/:id                → { success }
POST   /api/projects/:id/duplicate      → { id (new) }
PUT    /api/projects/:id/autosave       → { success }

# Templates
GET    /api/templates                   → [ { id, name, category, thumbnail, isPremium } ]
GET    /api/templates/:id               → { id, components, ... }
POST   /api/templates/:id/clone         → { projectId (new) }

# Publishing
POST   /api/projects/:id/publish        → { deploymentId, status, url }
GET    /api/projects/:id/deployments    → [ { id, version, publishedAt, status, url } ]
POST   /api/projects/:id/rollback/:ver  → { success }

# Domains
POST   /api/projects/:id/domain         → { domain, verificationRecord }
GET    /api/projects/:id/domain/verify  → { verified, sslStatus }

# Blog (Future)
POST   /api/projects/:id/posts          → { id, slug, ... }
GET    /api/projects/:id/posts          → [ posts ]
PUT    /api/projects/:id/posts/:postId  → { ... }
DELETE /api/projects/:id/posts/:postId  → { success }

# E-commerce (Future)
POST   /api/projects/:id/products       → { id, ... }
GET    /api/projects/:id/products       → [ products ]
POST   /api/projects/:id/orders         → { orderId, ... }
GET    /api/projects/:id/orders         → [ orders ]

# Analytics (Future)
POST   /api/analytics/events            → { success }  (tracking pixel)
GET    /api/projects/:id/analytics      → { views, visitors, dailyStats }

# AI (Future)
POST   /api/ai/generate-text            → { text }
POST   /api/ai/generate-image           → { imageUrl }
POST   /api/ai/suggest-layout           → { components: JSON }
```

---

## 7. Database Models Needed (Backend Team Reference)

### User Model (MongoDB)

```javascript
{
  _id: ObjectId,
  name: String,           // required
  email: String,          // unique, lowercase
  mobile: String,         // unique, 10 digits
  password: String,       // bcrypt hashed
  passwordHistory: [String], // last 3 hashes (prevent reuse)
  alternates: [String],   // alternate emails/mobiles (max 2 each)
  otp: String,            // current OTP (nullable)
  otpExpiry: Number,      // timestamp
  otpAttempts: Number,    // 0-3
  plan: {
    type: String,         // "free" | "starter" | "pro" | "enterprise"
    expiresAt: Date,
    razorpaySubscriptionId: String,
    features: [String],   // enabled feature flags
  },
  avatar: String,         // URL
  googleId: String,       // OAuth
  createdAt: Date,
  updatedAt: Date,
}
```

### Project Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // ref: User
  name: String,
  category: String,       // "E-commerce" | "Portfolio" | "Blog" | "Business"
  style: String,          // "Modern" | "Minimal" | "Bold"
  components: JSON,       // BuilderComponent[] serialized
  thumbnail: String,      // Auto-generated preview image URL
  domain: {
    subdomain: String,    // e.g., "mysite" → mysite.stackly.studio
    customDomain: String, // e.g., "www.example.com"
    verified: Boolean,
    sslStatus: String,
  },
  publishedAt: Date,
  publishedUrl: String,
  createdAt: Date,
  updatedAt: Date,
}
```

### Deployment Model

```javascript
{
  _id: ObjectId,
  projectId: ObjectId,    // ref: Project
  version: Number,
  s3Key: String,          // path in S3 bucket
  htmlSnapshot: String,   // exported HTML
  status: String,         // "building" | "deployed" | "failed" | "rolled_back"
  publishedAt: Date,
  publishedBy: ObjectId,  // ref: User
}
```

### Template Model

```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  style: String,
  description: String,
  thumbnail: String,
  components: JSON,       // BuilderComponent[] — the template layout
  isPremium: Boolean,
  popularity: Number,     // usage count
  createdBy: ObjectId,    // admin user
  createdAt: Date,
}
```

---

## 8. Environment Variables

### Currently Used (Frontend)

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base | `http://localhost:5000/api` |
| `NEXT_PUBLIC_BASE_PATH` | GitHub Pages subpath | `""` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | hardcoded fallback |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key | (required for payments) |
| `NEXT_PUBLIC_RAZORPAY_DEMO` | Force demo mode | `"true"` |
| `NEXT_PUBLIC_RAZORPAY_API_BASE` | Razorpay API URL | `http://localhost:3001` |

### Needed for Backend

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `SENDGRID_API_KEY` | Email OTP delivery |
| `TWILIO_SID` / `TWILIO_AUTH_TOKEN` | SMS OTP delivery |
| `GOOGLE_CLIENT_SECRET` | Google OAuth server-side |
| `RAZORPAY_KEY_SECRET` | Razorpay server-side secret |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | S3 + CloudFront |
| `S3_BUCKET_NAME` | Site hosting bucket |
| `CLOUDFRONT_DISTRIBUTION_ID` | CDN invalidation |
| `OPENAI_API_KEY` | AI content generation (future) |

---

## 9. Roadmap & Team Coordination Plan

### Phase 1: Foundation (Weeks 1-3) — Backend + Cloud Setup

```
BACKEND TEAM                          CLOUD TEAM                         FRONTEND TEAM
─────────────                         ──────────                         ─────────────
1. Deploy auth controller             1. Set up AWS account              1. Build Dashboard UI
   to Express server with                + IAM roles                        (project listing,
   MongoDB Atlas                                                            create/delete)
                                      2. Set up S3 bucket
2. Implement JWT refresh                 (stackly-sites)                 2. Build Profile
   token rotation                                                           Settings page
                                      3. Configure CloudFront
3. Create User Profile                   distribution                   3. Wire up JWT session
   GET/PUT /api/users/me                                                    persistence (store
                                      4. Set up Route 53                    token, refresh flow)
4. Create Project CRUD                   hosted zone
   endpoints                                                            4. Add "My Projects"
                                      5. Configure wildcard                 grid with thumbnails
5. Set up SendGrid for                   subdomain routing
   email OTP delivery                    *.stackly.studio               5. Migrate localStorage
                                                                            save → API autosave
6. Set up Twilio/MSG91
   for mobile OTP
```

### Phase 2: Publishing Pipeline (Weeks 4-6)

```
BACKEND TEAM                          CLOUD TEAM                         FRONTEND TEAM
─────────────                         ──────────                         ─────────────
1. Build publish endpoint             1. Create Lambda function          1. Add "Publish" button
   POST /api/projects/:id/publish        for HTML generation               with loading state
                                         + S3 upload
2. Deployment version                                                    2. Show deployment
   tracking in MongoDB               2. Set up API Gateway                  status (success/fail)
                                         for publish trigger
3. Rollback endpoint                                                     3. Build deployment
                                      3. CloudFront cache                   history panel
4. Subdomain allocation                  invalidation on
   (generate unique subdomain)           publish                         4. Add "Visit Site"
                                                                            link after publish
                                      4. SSL auto-provisioning
                                         via AWS ACM                     5. Build custom domain
                                                                            input + verification UI
```

### Phase 3: Templates & Content (Weeks 7-9)

```
BACKEND TEAM                          CLOUD TEAM                         FRONTEND TEAM
─────────────                         ──────────                         ─────────────
1. Template CRUD API                  1. S3 storage for                  1. Build template
                                         template thumbnails               browse/filter page
2. Template clone →
   project creation                   2. CDN for template                2. Template preview
                                         assets                             modal
3. Blog post CRUD API
   with slug generation                                                  3. Blog editor UI
                                                                            (rich text)
4. SEO metadata storage
                                                                         4. SEO fields in
5. Sitemap.xml generation                                                   builder settings
```

### Phase 4: E-commerce & Analytics (Weeks 10-14)

```
BACKEND TEAM                          CLOUD TEAM                         FRONTEND TEAM
─────────────                         ──────────                         ─────────────
1. Product CRUD API                   1. Analytics event                 1. Product management
                                         ingestion pipeline                 UI in builder
2. Cart + Checkout API                   (API GW → Lambda →
                                          DynamoDB)                      2. Cart + checkout
3. Order management API                                                     components
                                      2. Analytics aggregation
4. Analytics query API                   (scheduled Lambda)              3. Analytics dashboard
                                                                            UI with charts
5. Stripe/Razorpay for
   product payments                   3. Real-time tracking              4. Google Analytics
   (separate from subscription)          script deployment                  integration
```

### Phase 5: AI & Polish (Weeks 15-18)

```
BACKEND TEAM                          CLOUD TEAM                         FRONTEND TEAM
─────────────                         ──────────                         ─────────────
1. AI proxy API                       1. AI API rate limiting            1. "Generate Text"
   POST /api/ai/generate-text            + caching                          button in editor
   POST /api/ai/generate-image
                                      2. Image generation                2. AI image placeholder
2. Layout suggestion                     storage (S3)                       generator
   engine using BlockSpec.ai
   descriptions                       3. Cost monitoring +               3. Layout suggestion
                                         usage quotas                       UI ("Suggest sections
3. Content moderation                                                       for E-commerce")
   for AI output
                                                                         4. Migrate remaining
                                                                            blocks to BlockSpec
                                                                            pattern (heading,
                                                                            text, button, etc.)
```

---

## 10. Key Technical Decisions & Constraints

| Decision | Rationale |
|---|---|
| **Static export (`output: "export"`)** | Deployed to GitHub Pages; no server-side rendering. All API calls are client-side fetch. |
| **Zustand over Redux** | Simpler API, less boilerplate. Two stores (builder + assets) keep concerns separated. |
| **IndexedDB for assets** | No backend yet. Clean migration path: replace `dbPutAsset`/`dbGetBlob` with S3 API calls. |
| **BlockSpec registry pattern** | Extensible: add a new block = 1 spec file + register. No other files change. |
| **Inline styles in JSON** | Components store `ComponentStyles` object, converted to inline CSS on export. Responsive overrides planned via `ResponsiveStyles`. |
| **@dnd-kit over react-dnd** | Better touch support, accessible, tree-shakeable. |
| **Razorpay over Stripe** | Primary market is India. Stripe can be added as alternate gateway. |
| **Framer Motion** | Used for page transitions, panel animations, micro-interactions. |
| **`content` → `props` migration** | Legacy blocks use pipe-delimited `content` string. New blocks use typed `props`. Both coexist via `spec.read()` fallback chain. |

---

## 11. File Size Reference (Largest Files)

| File | Size | Notes |
|---|---|---|
| `app/e-commerce/page.tsx` | 96KB | Largest page — full e-commerce showcase |
| `app/globals.css` | 83KB | Master stylesheet |
| `app/portfolio/page.tsx` | 64KB | Portfolio template page |
| `app/landing/page.tsx` | 62KB | Marketing landing page |
| `app/planning/page.tsx` | 46KB | Pricing plans + invoicing |
| `components/navBar.tsx` | 41KB | Global navigation |
| `app/blog/blog.css` | 39KB | Blog-specific styles |
| `app/signup/page.tsx` | 36KB | Registration page |
| `app/blog/page.tsx` | 29KB | Blog listing |
| `app/login/page.tsx` | 27KB | Login page |
| `lib/planningInvoiceHtml.ts` | 26KB | Invoice HTML template |

---

## 12. Quick Reference: How to Use This Document

### For Frontend Prompts
Use sections: 3 (Directory Structure), 4 (Architecture), 5 (Module Status — focus on ✅/⚠️ items)

### For Backend Prompts  
Use sections: 6 (API Contracts), 7 (Database Models), 8 (Environment Variables), 9 (Roadmap — Backend column)

### For Cloud/DevOps Prompts
Use sections: 6 (API Contracts — publishing/domain endpoints), 7 (Database Models — Deployment), 8 (Environment Variables — AWS), 9 (Roadmap — Cloud column)

### For Planning/PM Prompts
Use sections: 5 (Module Status Audit), 9 (Roadmap), 10 (Technical Decisions)

### For AI Integration Prompts
Use sections: 4.1 (BlockSpec — especially the `ai` field), 6 (AI API endpoints), 9 Phase 5

### For Full Context (Any Model)
Feed the entire document. It's structured to be scannable — models will extract relevant sections.

---

*Generated: 2026-06-07 | Project: Stackly Website Builder | Repo: Ashith-stackly/Website-Builder-Application*
