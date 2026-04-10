import { SignUp } from '@clerk/nextjs';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { authClerkAppearance } from '@/components/auth/clerkAppearance';

export const metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  const fallbackRedirectUrl =
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ?? '/dashboard';
  const signInFallbackRedirectUrl =
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? '/dashboard';

  return (
    <AuthPageShell
      mode="sign-up"
      title="Create a free account."
      intro="Set up one calm login for saved pages, dashboard access, and anything you unlock later."
      helper="Start free in the hub, keep your place, and add paid tools only if you want them."
      cardLabel="Free account"
      finePrint="Account creation and sign-in are handled securely by Clerk."
    >
      <SignUp
        appearance={authClerkAppearance}
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl={fallbackRedirectUrl}
        signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      />
    </AuthPageShell>
  );
}
