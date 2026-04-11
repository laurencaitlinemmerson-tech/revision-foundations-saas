export const authClerkAppearance = {
  elements: {
    rootBox: 'w-full min-w-0',
    cardBox: 'w-full min-w-0',
    main: 'w-full min-w-0',
    card: 'w-full border-0 bg-transparent p-0 shadow-none !bg-transparent !shadow-none',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    socialButtonsRoot: 'w-full',
    socialButtons: 'grid gap-3',
    socialButtonsBlockButton:
      '!flex !min-h-[48px] !w-full !items-center !justify-center !gap-3 !rounded-none !border !border-[rgba(0,0,0,0.1)] dark:!border-[var(--linen-medium)] !bg-white dark:!bg-[var(--bg-secondary)] !px-4 !py-3 !text-[var(--text-primary)] !shadow-none hover:!bg-[var(--bg-secondary)] dark:hover:!bg-[var(--linen-medium)] !transition-colors',
    socialButtonsBlockButtonText: '!w-full text-[13px] leading-5 font-normal !text-[var(--text-primary)]',
    socialButtonsProviderIcon: 'shrink-0 dark:invert',
    dividerRow: 'my-5',
    dividerLine: '!bg-[rgba(0,0,0,0.08)] dark:!bg-[var(--linen-medium)]',
    dividerText: 'px-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#999] dark:text-[var(--text-muted)]',
    form: 'space-y-4',
    formContainer: 'w-full space-y-4',
    formField: 'space-y-2',
    formFieldRow: 'grid gap-4',
    formFieldLabelRow: 'items-center justify-between gap-3',
    formFieldLabel:
      'mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#999] dark:text-[var(--text-muted)]',
    formFieldInput:
      '!min-h-[48px] !rounded-none !border !border-[rgba(0,0,0,0.12)] dark:!border-[var(--linen-medium)] !bg-white dark:!bg-[var(--bg-secondary)] !px-4 !text-[14px] !leading-6 !text-[var(--text-primary)] !shadow-none placeholder:!text-[#bbb] dark:placeholder:!text-[var(--text-muted)] focus:!border-[rgba(0,0,0,0.3)] dark:focus:!border-[var(--text-muted)] focus:!ring-0 !transition-colors !outline-none',
    formFieldInputGroup: 'relative min-w-0',
    formFieldInputShowPasswordButton:
      'text-[var(--charcoal)] transition-colors hover:text-[var(--espresso)] focus-visible:outline-none',
    formFieldErrorText: 'mt-1.5 text-[12px] leading-5 text-[#8A2222] dark:text-[#EFA3A3]',
    formFieldWarningText: 'mt-1.5 text-[12px] leading-5 text-[#7A3F04] dark:text-[#E3A365]',
    formFieldInfoText: 'mt-1.5 text-[12px] leading-5 text-[var(--charcoal)]',
    formFieldHintText: 'mt-1.5 text-[12px] leading-5 text-[var(--charcoal)]',
    formFieldAction:
      'text-[11px] font-normal text-[#999] dark:text-[var(--text-muted)] underline underline-offset-3 hover:text-[var(--espresso)] transition-colors',
    formFieldCheckboxInput:
      'h-4 w-4 !rounded-none border border-[rgba(0,0,0,0.15)] dark:border-[var(--linen-medium)] !bg-white dark:!bg-[var(--bg-secondary)] text-[var(--espresso)] focus:ring-0',
    formFieldCheckboxLabel: 'text-[13px] leading-6 text-[var(--charcoal)]',
    formButtonPrimary:
      '!mt-5 !min-h-[48px] !w-full !rounded-none !justify-center !px-6 !text-[11px] !font-medium !tracking-[0.14em] !uppercase !transition-colors !bg-[var(--espresso)] !text-[var(--cream)] hover:!opacity-80 !shadow-none',
    badge: '!hidden',
    footer: 'pt-2 !bg-transparent',
    footerAction: 'mt-5 border-t border-[rgba(0,0,0,0.08)] dark:border-[var(--linen-medium)] pt-4 !bg-transparent',
    footerActionText: 'text-[12px] leading-6 text-[#999] dark:text-[var(--text-muted)]',
    footerActionLink:
      'text-[12px] font-normal text-[var(--espresso)] underline underline-offset-3 hover:text-[var(--charcoal)] ml-1 transition-colors',
    footerPages: '!hidden',
    footerPagesLink: '!hidden',
    formResendCodeLink:
      'text-[12px] font-normal text-[var(--espresso)] underline underline-offset-3 hover:text-[var(--charcoal)] transition-colors',
    identityPreviewText: 'text-[13px] leading-6 text-[var(--charcoal)]',
    identityPreviewEditButton:
      'text-[12px] font-normal text-[var(--espresso)] underline underline-offset-3 hover:text-[var(--charcoal)] transition-colors',
    otpCodeField: 'w-full',
    otpCodeFieldInputs: 'grid grid-cols-6 gap-2 sm:gap-3',
    otpCodeFieldInput:
      '!min-h-[48px] !min-w-0 !rounded-none !border !border-[rgba(0,0,0,0.1)] dark:!border-[var(--linen-medium)] !bg-[var(--linen-light)] dark:!bg-[var(--bg-secondary)] !text-base !text-[var(--text-primary)] !shadow-none',
    otpCodeFieldErrorText: 'mt-1.5 text-[12px] leading-5 text-[#8A2222]',
    otpCodeFieldSuccessText: 'mt-1.5 text-[12px] leading-5 text-[#1C7A67]',
    alertText: 'text-[12px] leading-6',
    alert: '!rounded-none border border-[rgba(0,0,0,0.08)] !bg-[#FAEEDA] !text-[#633806]',
    formFieldSuccessText: 'text-[12px] leading-5 text-[#1C7A67]',
    navbar: '!hidden',
    pageScrollBox: 'w-full',
    alternativeMethodsBlockButton:
      '!rounded-none !min-h-[48px] !w-full !justify-center !border !border-[rgba(0,0,0,0.1)] dark:!border-[var(--linen-medium)] !bg-white dark:!bg-[var(--bg-secondary)] !text-[var(--text-primary)] !shadow-none hover:!bg-[var(--bg-secondary)]',
    alternativeMethodsBlockButtonText: 'text-[13px] !text-[var(--text-primary)]',
  },
};
