import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const Login = () => {
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
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-card-hover",
            },
          }}
          signUpUrl="/signup"
          forceRedirectUrl="/admin"
          fallbackRedirectUrl="/admin"
        />
      </div>
    </main>
  );
};

export default Login;
