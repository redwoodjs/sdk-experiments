import { AuthProvider } from "@/app/context/AuthContext";
import type { LayoutProps } from "rwsdk/router";

export async function MainLayout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <div className="bg-red-400">
        <main>{children}</main>
      </div>
    </AuthProvider>
  );
}
