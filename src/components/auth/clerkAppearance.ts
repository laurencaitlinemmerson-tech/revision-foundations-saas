export const authClerkAppearance = {
  variables: {
    colorPrimary: '#1A1815',
    colorText: '#2C2A27',
    colorTextSecondary: '#5A5750',
    colorBackground: 'transparent',
    colorInputBackground: '#FFFFFF',
    colorInputText: '#2C2A27',
    borderRadius: '0px',
    colorShadow: 'transparent',
  } as Record<string, string>,
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
      '!flex !min-h-[48px] !w-full !items-center !justify-center !gap-3 !rounded-none !border !border-[rgba(0,0,0,0.1)] !bg-white !px-4 !py-3 !text-[#2C2A27] !shadow-none hover:!bg-[#F5F3F0] !transition-colors',
    socialButtonsBlockButtonText: '!w-full text-[13px] leading-5 font-normal text-[#2C2A27]',
    socialButtonsProviderIcon: 'shrink-0',
    dividerRow: 'my-5',
    dividerLine: '!bg-[rgba(0,0,0,0.08)]',
    dividerText: 'px-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#999]',
    form: 'space-y-4',
    formContainer: 'w-full space-y-4',
    formField: 'space-y-2',
    formFieldRow: 'grid gap-4',
    formFieldLabelRow: 'items-center justify-between gap-3',
    formFieldLabel:
      'mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#999]',
    formFieldInput:
      '!min-h-[48px] !rounded-none !border !border-[rgba(0,0,0,0.12)] !bg-white !px-4 !text-[14px] !leading-6 !text-[#2C2A27] !shadow-none placeholder:!text-[#bbb] focus:!border-[rgba(0,0,0,0.28)] focus:!ring-0 !transition-colors !outline-none',
    formFieldInputGroup: 'relative min-w-0',
    formFieldInputShowPasswordButton:
      'text-[#5A5750] transition-colors hover:text-[#1A1815] focus-visible:outline-none',
    formFieldErrorText: 'mt-1.5 text-[12px] leading-5 text-[#8A2222]',
    formFieldWarningText: 'mt-1.5 text-[12px] leading-5 text-[#7A3F04]',
    formFieldInfoText: 'mt-1.5 text-[12px] leading-5 text-[#5A5750]',
    formFieldHintText: 'mt-1.5 text-[12px] leading-5 text-[#5A5750]',
    formFieldAction:
      'text-[11px] font-normal text-[#999] underline underline-offset-3 hover:text-[#1A1815] transition-colors',
    formFieldCheckboxInput:
      'h-4 w-4 !rounded-none border border-[rgba(0,0,0,0.15)] text-[#1A1815] focus:ring-0',
    formFieldCheckboxLabel: 'text-[13px] leading-6 text-[#5A5750]',
    formButtonPrimary:
      '!mt-5 !min-h-[48px] !w-full !rounded-none !justify-center !px-6 !text-[11px] !font-medium !tracking-[0.14em] !uppercase !transition-colors !bg-[#1A1815] !text-[#FAFAF8] hover:!bg-[#2C2A27] !shadow-none',
    badge: '!hidden',
    footer: 'pt-2 !bg-transparent',
    footerAction: 'mt-5 border-t border-[rgba(0,0,0,0.08)] pt-4 !bg-transparent',
    footerActionText: 'text-[12px] leading-6 text-[#999]',
    footerActionLink:
      'text-[12px] font-normal text-[#1A1815] underline underline-offset-3 hover:text-[#5A5750] ml-1',
    footerPages: '!hidden',
    footerPagesLink: '!hidden',
    formResendCodeLink:
      'text-[12px] font-normal text-[#1A1815] underline underline-offset-3 hover:text-[#5A5750]',
    identityPreviewText: 'text-[13px] leading-6 text-[#5A5750]',
    identityPreviewEditButton:
      'text-[12px] font-normal text-[#1A1815] underline underline-offset-3 hover:text-[#5A5750]',
    otpCodeField: 'w-full',
    otpCodeFieldInputs: 'grid grid-cols-6 gap-2 sm:gap-3',
    otpCodeFieldInput:
      '!min-h-[48px] !min-w-0 !rounded-none !border !border-[rgba(0,0,0,0.1)] !bg-[#FBF8F3] !text-base !text-[#2C2A27] !shadow-none',
    otpCodeFieldErrorText: 'mt-1.5 text-[12px] leading-5 text-[#8A2222]',
    otpCodeFieldSuccessText: 'mt-1.5 text-[12px] leading-5 text-[#1C7A67]',
    alertText: 'text-[12px] leading-6',
    alert: '!rounded-none border border-[rgba(0,0,0,0.08)] bg-[#FAEEDA] text-[#633806]',
    formFieldSuccessText: 'text-[12px] leading-5 text-[#1C7A67]',
    navbar: '!hidden',
    pageScrollBox: 'w-full',
    alternativeMethodsBlockButton:
      '!rounded-none !min-h-[48px] !w-full !justify-center !border !border-[rgba(0,0,0,0.1)] !bg-white !text-[#2C2A27] !shadow-none hover:!bg-[#F5F3F0]',
    alternativeMethodsBlockButtonText: 'text-[13px] text-[#2C2A27]',
  },
};
