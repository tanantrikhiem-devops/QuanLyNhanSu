import { AuthBrandPanel } from "@/features/auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-auth-bg text-auth-heading flex min-h-screen flex-col lg:flex-row">
      <AuthBrandPanel />
      <section className="flex min-w-0 flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        {children}
      </section>
    </main>
  );
}
