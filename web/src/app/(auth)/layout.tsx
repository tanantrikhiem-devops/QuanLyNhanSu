import { AuthBrandPanel } from "@/features/auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page text-auth-heading">
      <AuthBrandPanel />
      <section className="auth-form-panel">
        {children}
      </section>
    </main>
  );
}
