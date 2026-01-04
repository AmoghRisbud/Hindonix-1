# Clerk Authentication Setup Guide

This guide explains how to configure Clerk authentication for your Hindonix project.

## What is Clerk?

Clerk is a modern authentication and user management platform that provides:
- Pre-built UI components for Sign In, Sign Up, and User Profile
- Multiple authentication methods (Email/Password, OAuth providers like Google/GitHub, Magic Links)
- Secure session management
- User profile management
- Easy React integration with hooks

## Prerequisites

- Node.js and npm installed
- A Clerk account (free tier available)

## Step 1: Create a Clerk Account

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/sign-up)
2. Sign up for a free account
3. Create a new application
4. Give it a name (e.g., "Hindonix")

## Step 2: Configure Authentication Methods

In your Clerk Dashboard:

1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable the authentication methods you want:
   - **Email address** (recommended - enable password)
   - **OAuth providers** (optional - click "Add OAuth provider"):
     - Google (most popular)
     - GitHub
     - Microsoft
     - Others as needed

3. Configure settings:
   - Enable "Email verification" for security
   - Set password requirements if using password authentication

## Step 3: Get Your Publishable Key

1. In the Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Open `.env.local` in your project root
4. Replace the placeholder with your actual key:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

⚠️ **Important**: Never commit your `.env.local` file to version control!

## Step 4: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Features Implemented

### 1. Protected Routes
- The `/admin` route is now protected
- Unauthenticated users are redirected to `/login`
- After successful login, users are redirected to `/admin`

### 2. Authentication Pages
- **`/login`**: Sign in page with Clerk's pre-built UI
- **`/signup`**: Sign up page for new users
- Both pages support:
  - Email/Password authentication
  - OAuth providers (if enabled)
  - Magic links
  - Automatic redirects after authentication

### 3. Navbar Integration
- **Unauthenticated users** see:
  - "Sign In" button
  - "Get a Quote" button
- **Authenticated users** see:
  - "Admin" link (to access admin panel)
  - User profile button (avatar with dropdown)
  - "Get a Quote" button
  - Sign out option (in user menu)

### 4. User Profile Management
- Click on the user avatar in the navbar
- Users can:
  - Update their profile information
  - Change their password
  - Manage connected accounts
  - Upload a profile picture
  - Sign out

## How It Works

### ClerkProvider
The entire app is wrapped in `<ClerkProvider>` in `main.tsx`, which:
- Manages authentication state
- Handles session tokens
- Provides authentication context to all components

### ProtectedRoute Component
Located at `src/components/ProtectedRoute.tsx`:
- Checks if user is authenticated using `useAuth()` hook
- Shows loading spinner while checking auth state
- Redirects to `/login` if not authenticated
- Renders protected content if authenticated

### Clerk Hooks
The application uses Clerk's React hooks:
- `useAuth()`: Check authentication state and get auth methods
- `useUser()`: Access current user information
- `UserButton`: Pre-built component for user profile dropdown

## Testing Authentication

### Sign Up Flow
1. Navigate to `http://localhost:8080/signup`
2. Enter your email and password (or use OAuth)
3. Verify your email if required
4. You'll be redirected to `/admin`

### Sign In Flow
1. Navigate to `http://localhost:8080/login`
2. Enter your credentials
3. You'll be redirected to `/admin`

### Protected Route Test
1. Sign out if currently signed in
2. Try to visit `http://localhost:8080/admin`
3. You should be redirected to `/login`
4. Sign in and you'll be redirected back to `/admin`

## Customization

### Appearance
You can customize Clerk components by modifying the `appearance` prop:

```tsx
<SignIn
  appearance={{
    elements: {
      rootBox: "mx-auto",
      card: "shadow-lg",
      formButtonPrimary: "bg-primary hover:bg-primary/90",
    },
  }}
/>
```

### Redirect URLs
Modify redirect URLs in the auth pages:
- `afterSignInUrl`: Where to redirect after successful sign in
- `afterSignUpUrl`: Where to redirect after successful sign up
- `signInUrl`: URL of your sign in page
- `signUpUrl`: URL of your sign up page

### User Metadata
Store custom data on user objects:

```tsx
// In your component
const { user } = useUser();

// Add public metadata (visible to everyone)
await user?.update({
  publicMetadata: { role: "admin" }
});

// Add private metadata (only visible to user)
await user?.update({
  privateMetadata: { subscription: "premium" }
});
```

## Role-Based Access Control (Optional)

To restrict admin access to specific users, modify `ProtectedRoute.tsx`:

```tsx
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  const isAdmin = user?.publicMetadata?.role === "admin";
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

Then assign the "admin" role to specific users in the Clerk Dashboard:
1. Go to **Users**
2. Select a user
3. Click **Metadata**
4. Add to **Public metadata**: `{ "role": "admin" }`

## Security Best Practices

### Current Setup (Frontend Only)
✅ UI is protected - unauthorized users can't access admin pages
⚠️ Redis credentials are still exposed in browser code

### Recommended for Production

1. **Move Redis operations to backend**:
   - Create Vercel/Netlify serverless functions
   - Use Clerk's `getAuth()` on the backend to verify requests
   - Keep Redis credentials server-side only

2. **Use Clerk middleware**:
   ```typescript
   // In serverless function
   import { getAuth } from '@clerk/nextjs/server';
   
   export default async function handler(req, res) {
     const { userId } = getAuth(req);
     if (!userId) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     // Perform Redis operations here
   }
   ```

3. **Enable additional security features**:
   - Multi-factor authentication (MFA)
   - Email verification (already enabled)
   - Session management settings
   - Webhook integrations for user events

## Troubleshooting

### "Missing Clerk Publishable Key" Error
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set in `.env.local`
- Ensure the variable name starts with `VITE_` (required for Vite)
- Restart the dev server after adding the key

### Redirect Loop
- Check that `signInUrl` and `signUpUrl` match your routes
- Verify `afterSignInUrl` and `afterSignUpUrl` are valid paths

### Authentication Not Working
- Check browser console for errors
- Verify your Clerk application is active
- Check that authentication methods are enabled in Clerk Dashboard
- Clear browser cookies and try again

### User Profile Not Showing
- Verify `UserButton` component is imported correctly
- Check that user is actually signed in using `useAuth()`
- Inspect browser network tab for API calls to Clerk

## Clerk Dashboard Features

### User Management
- View all registered users
- Search and filter users
- Ban or delete users
- View user sessions and activity

### Analytics
- Track sign-ups and sign-ins
- Monitor authentication methods used
- View active sessions

### Webhooks
Set up webhooks to receive events:
- `user.created`: When a new user signs up
- `user.updated`: When user profile is updated
- `session.created`: When user signs in
- `session.ended`: When user signs out

Useful for syncing user data to your database.

## Next Steps

- ✅ Basic authentication is working
- ⚠️ Consider adding role-based access control
- ⚠️ Move Redis operations to serverless functions for production
- 📝 Set up user activity logging
- 🔔 Configure email templates in Clerk Dashboard
- 🎨 Customize Clerk component themes to match your brand

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk Dashboard](https://dashboard.clerk.com/)
- [Clerk Components Reference](https://clerk.com/docs/components/overview)

## Support

If you encounter issues:
1. Check the [Clerk Documentation](https://clerk.com/docs)
2. Visit [Clerk Support](https://clerk.com/support)
3. Check browser console for error messages
4. Verify all environment variables are set correctly
