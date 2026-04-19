import { SignIn } from '@clerk/nextjs';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { authClerkAppearance } from '@/components/auth/clerkAppearance';

export const metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  const fallbackRedirectUrl =
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? '/dashboard';
  const signUpFallbackRedirectUrl =
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ?? '/onboarding?entry=signup';

  return (
    <AuthPageShell
      mode="sign-in"
      title="Pick up where you left off."
      intro="Your dashboard, saved hub pages, and any access you already have all sit behind one sign-in."
      helper="Use the same email as before so everything reconnects properly when you come back."
      cardLabel="Account access"
      finePrint="Secure account access is provided by Clerk."
    >
      <SignIn
        appearance={authClerkAppearance}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        fallbackRedirectUrl={fallbackRedirectUrl}
        signUpFallbackRedirectUrl={signUpFallbackRedirectUrl}
      />
    </AuthPageShell>
  );
}
