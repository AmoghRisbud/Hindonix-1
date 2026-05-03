import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center gradient-hero pt-20">
      <SignIn forceRedirectUrl="/admin" />
    </main>
  );
}
