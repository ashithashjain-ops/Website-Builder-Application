const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
 
type RegisterPayload = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};
 
export async function register(data: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
 
  const result = await response.json().catch(() => ({}));
 
  if (!response.ok) {
    throw new Error(result.message || "Registration failed. Please try again.");
  }
 
  return result;
}