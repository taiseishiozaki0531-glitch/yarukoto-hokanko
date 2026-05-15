import { AppHeader } from "@/components/AppHeader";
import { requireUser } from "@/lib/supabase/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  return (
    <>
      <AppHeader userEmail={user.email} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </>
  );
}
