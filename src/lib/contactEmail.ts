import type { ContactInput } from '@/lib/validations';

const DEFAULT_CONTACT_NOTIFICATION_TO = 'lauren@nurselab.co.uk';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function sendContactNotification(input: ContactInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_TO || DEFAULT_CONTACT_NOTIFICATION_TO;
  const from = process.env.CONTACT_FROM_EMAIL || `The Nurse Lab <${DEFAULT_CONTACT_NOTIFICATION_TO}>`;
  const subject = input.subject?.trim()
    ? `[Contact] ${input.subject.trim()}`
    : `[Contact] New website message from ${input.name.trim()}`;

  if (!apiKey) {
    return { delivered: false, reason: 'missing_resend_api_key' as const };
  }

  const senderName = input.name.trim();
  const senderEmail = input.email.trim().toLowerCase();
  const message = input.message.trim();
  const submittedSubject = input.subject?.trim() || 'No subject provided';

  const text = [
    'New contact form message from The Nurse Lab website.',
    '',
    `Name: ${senderName}`,
    `Email: ${senderEmail}`,
    `Subject: ${submittedSubject}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:var(--ink-strong);">
      <p style="margin:0 0 16px;">New contact form message from The Nurse Lab website.</p>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(senderName)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(senderEmail)}</p>
      <p style="margin:0 0 16px;"><strong>Subject:</strong> ${escapeHtml(submittedSubject)}</p>
      <p style="margin:0 0 8px;"><strong>Message:</strong></p>
      <div style="white-space:pre-wrap;border:1px solid var(--hairline-soft);padding:16px;background:var(--surface-page);">${escapeHtml(message)}</div>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: senderEmail,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return {
      delivered: false,
      reason: `resend_error:${response.status}:${details}` as const,
    };
  }

  return { delivered: true as const };
}
