const PRODUCT_LABELS: Record<string, { name: string; cta: string; href: string }> = {
  quiz:   { name: 'Core Quiz',          cta: 'Open the quiz',         href: '/quiz' },
  osce:   { name: 'OSCE Tool',          cta: 'Open the OSCE tool',    href: '/osce' },
  bundle: { name: "Children's Bundle",  cta: 'Go to your dashboard',  href: '/dashboard' },
};

export async function sendPurchaseConfirmation(
  toEmail: string,
  productKey: string,
): Promise<{ delivered: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { delivered: false, reason: 'missing_resend_api_key' };

  const from = process.env.PURCHASE_FROM_EMAIL ?? 'The Nurse Lab <hello@nurselab.co.uk>';
  const product = PRODUCT_LABELS[productKey] ?? { name: productKey, cta: 'Go to your account', href: '/dashboard' };

  const subject = `You're in — ${product.name} is ready`;

  const text = [
    `Hi,`,
    ``,
    `Your purchase of ${product.name} is confirmed and your access is now live.`,
    ``,
    `${product.cta}: https://nurselab.co.uk${product.href}`,
    ``,
    `If you have any questions, just reply to this email.`,
    ``,
    `— The Nurse Lab`,
  ].join('\n');

  const html = `
<div style="font-family:Inter,Arial,sans-serif;line-height:1.7;color:#1A1815;max-width:560px;margin:0 auto;padding:40px 24px;">
  <p style="font-size:22px;font-family:Georgia,serif;font-weight:400;margin:0 0 24px;">
    You&rsquo;re in.
  </p>
  <p style="margin:0 0 16px;font-size:15px;font-weight:300;color:#3A3835;">
    Your purchase of <strong style="font-weight:500;">${product.name}</strong> is confirmed and your access is now live.
  </p>
  <div style="margin:28px 0;">
    <a href="https://nurselab.co.uk${product.href}"
       style="display:inline-block;background:#1A1815;color:#FAFAF8;text-decoration:none;padding:12px 24px;font-size:14px;font-family:Inter,Arial,sans-serif;">
      ${product.cta} &rarr;
    </a>
  </div>
  <p style="font-size:13px;font-weight:300;color:#706A63;margin:0;">
    If anything looks wrong or you have questions, just reply to this email.
  </p>
  <hr style="border:none;border-top:0.5px solid rgba(0,0,0,0.1);margin:32px 0;" />
  <p style="font-size:12px;font-weight:300;color:#9C8878;margin:0;">The Nurse Lab &mdash; nurselab.co.uk</p>
</div>
  `.trim();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [toEmail], subject, text, html }),
  });

  if (!res.ok) {
    const details = await res.text();
    return { delivered: false, reason: `resend_error:${res.status}:${details}` };
  }

  return { delivered: true };
}
