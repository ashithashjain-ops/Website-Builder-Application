import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#3f66c9",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
