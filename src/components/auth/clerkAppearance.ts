export const authClerkAppearance = {
  variables: {
    colorPrimary: '#1A1815',
    colorText: '#1A1815',
    colorTextSecondary: '#5A5750',
    colorBackground: 'transparent',
    colorInputBackground: '#F5F3F0',
    colorInputText: '#1A1815',
    borderRadius: '0px',
    colorShadow: 'transparent',
  } as Record<string, string>,
  elements: {
    rootBox: 'w-full min-w-0',
    cardBox: 'w-full min-w-0',
    main: 'w-full min-w-0',
    card: 'w-full border-0 bg-transparent p-0 shadow-none',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    socialButtonsRoot: 'w-full',
    socialButtons: 'grid gap-3',
    socialButtonsBlockButton:
      'btn-secondary !flex !min-h-[52px] !w-full !items-center !justify-center !gap-3 !border-[rgba(0,0,0,0.08)] !bg-white !px-4 !py-3 !text-[var(--espresso)] !whitespace-normal hover:!bg-[var(--linen-light)]',
    socialButtonsBlockButtonText: '!w-full text-sm leading-5 font-normal text-[var(--espresso)]',
    socialButtonsProviderIcon: 'shrink-0',
    dividerRow: 'my-5',
    dividerLine: 'bg-black/8',
    dividerText: 'px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--charcoal)]',
    form: 'space-y-4',
    formContainer: 'w-full space-y-4',
    formField: 'space-y-2',
    formFieldRow: 'grid gap-4',
    formFieldLabelRow: 'items-center justify-between gap-3',
    formFieldLabel:
      'mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--charcoal)]',
    formFieldInput:
      'min-h-[52px] border border-black/10 bg-[var(--linen-light)] px-4 text-base leading-6 text-[var(--espresso)] shadow-none placeholder:text-[var(--charcoal-light)] focus:border-[rgba(200,196,190,1)] focus:bg-white focus:ring-4 focus:ring-[rgba(239,203,182,0.42)]',
    formFieldInputGroup: 'relative min-w-0',
    formFieldInputShowPasswordButton:
      'text-[var(--espresso)] transition-colors hover:text-[var(--charcoal)] focus-visible:outline-none',
    formFieldErrorText: 'mt-2 text-sm leading-6 text-[#8A2222]',
    formFieldWarningText: 'mt-2 text-sm leading-6 text-[var(--amber-800)]',
    formFieldInfoText: 'mt-2 text-sm leading-6 text-[var(--charcoal)]',
    formFieldHintText: 'mt-2 text-sm leading-6 text-[var(--charcoal)]',
    formFieldAction:
      'text-sm font-medium text-[var(--espresso)] underline underline-offset-4 hover:text-[var(--charcoal)]',
    formFieldCheckboxInput:
      'h-5 w-5 rounded border border-black/15 text-[var(--espresso)] focus:ring-2 focus:ring-[rgba(239,203,182,0.42)]',
    formFieldCheckboxLabel: 'text-sm leading-6 text-[var(--charcoal)]',
    formButtonPrimary:
      'btn-primary !mt-4 !min-h-[52px] !w-full !justify-center !px-6 !text-sm !tracking-[0.01em]',
    badge: '!hidden',
    footer: 'pt-2',
    footerAction: 'mt-6 border-t border-black/8 pt-4',
    footerActionText: 'text-sm leading-6 text-[var(--charcoal)]',
    footerActionLink:
      'text-sm font-medium text-[var(--espresso)] underline underline-offset-4 hover:text-[var(--charcoal)]',
    footerPages: 'mt-4 flex flex-wrap gap-x-3 gap-y-2',
    footerPagesLink:
      'text-sm text-[var(--charcoal)] underline underline-offset-4 hover:text-[var(--espresso)]',
    formResendCodeLink:
      'text-sm font-medium text-[var(--espresso)] underline underline-offset-4 hover:text-[var(--charcoal)]',
    identityPreviewText: 'text-sm leading-6 text-[var(--charcoal)]',
    identityPreviewEditButton:
      'text-sm font-medium text-[var(--espresso)] underline underline-offset-4 hover:text-[var(--charcoal)]',
    otpCodeField: 'w-full',
    otpCodeFieldInputs: 'grid grid-cols-6 gap-2 sm:gap-3',
    otpCodeFieldInput:
      'min-h-[52px] min-w-0 border border-black/10 bg-[var(--linen-light)] text-base text-[var(--espresso)] shadow-none',
    otpCodeFieldErrorText: 'mt-2 text-sm leading-6 text-[#8A2222]',
    otpCodeFieldSuccessText: 'mt-2 text-sm leading-6 text-[#1E8A4D]',
    alertText: 'text-sm leading-6',
    alert: 'border border-[#EFCBB6] bg-[#FDF3E3] text-[var(--amber-800)]',
    formFieldSuccessText: 'text-sm leading-6 text-[#1E8A4D]',
    navbar: '!hidden',
    pageScrollBox: 'w-full',
    alternativeMethodsBlockButton:
      'btn-secondary !min-h-[52px] !w-full !justify-center !border-[rgba(0,0,0,0.08)] !bg-white !text-[var(--espresso)] hover:!bg-[var(--linen-light)]',
    alternativeMethodsBlockButtonText: 'text-sm text-[var(--espresso)]',
  },
};
