import { SignUp, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ENV } from "@/lib/env";

const ClerkSignUp = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/admin");
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-card-hover",
            },
          }}
          signInUrl="/login"
          forceRedirectUrl="/admin"
          fallbackRedirectUrl="/admin"
        />
      </div>
    </main>
  );
};

const SignUpPage = () => {
  if (!ENV.CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-muted-foreground text-center">
          Authentication is not configured.<br />
          Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to your <code>.env.local</code> file.
        </p>
      </main>
    );
  }
  return <ClerkSignUp />;
};

export default SignUpPage;
