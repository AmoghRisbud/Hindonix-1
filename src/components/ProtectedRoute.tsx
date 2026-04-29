import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { ENV } from "@/lib/env";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ClerkProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!ENV.CLERK_PUBLISHABLE_KEY) {
    // No Clerk configured — redirect to login
    return <Navigate to="/login" replace />;
  }
  return <ClerkProtectedRoute>{children}</ClerkProtectedRoute>;
};

export default ProtectedRoute;
