import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center gradient-hero pt-20">
      <SignUp />
    </main>
  );
}
