import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen gradient-bg-light flex items-center justify-center p-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'glass-card shadow-lg',
            headerTitle: 'font-display text-2xl text-[var(--plum-text)]',
            headerSubtitle: 'text-[var(--plum-text)]/70',
            socialButtonsBlockButton: 'btn-secondary',
            formButtonPrimary: 'btn-gradient',
            footerActionLink: 'text-[var(--lavender-primary)] hover:text-[var(--lavender-primary)]/80',
          },
        }}
      />
    </div>
  );
}
