import { AREAS, AreaOption, OPTION_LABELS } from '@/app/pip/constants';

const PIP_NOTIFICATION_TO = 'laurencaitlinemmerson@gmail.com';

export type PipSubmission = {
  answers: Record<string, { option: AreaOption | null; note: string }>;
  extra: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function sendPipSummary(input: PipSubmission) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.PIP_NOTIFICATION_TO || PIP_NOTIFICATION_TO;
  const from =
    process.env.PIP_FROM_EMAIL ||
    process.env.CONTACT_FROM_EMAIL ||
    'The Nurse Lab <onboarding@resend.dev>';

  if (!apiKey) {
    return { delivered: false, reason: 'missing_resend_api_key' as const };
  }

  const rows = AREAS.map((area) => {
    const answer = input.answers[area.id];
    return {
      name: area.name,
      subtitle: area.subtitle,
      label: answer?.option ? OPTION_LABELS[answer.option] : 'Not answered',
      note: answer?.note?.trim() ?? '',
    };
  });

  const textLines = [
    'PIP prep — Louis’s full answers.',
    '',
    ...rows.map(
      (r) =>
        `${r.name} (${r.subtitle}): ${r.label}${r.note ? `\n  Note: ${r.note}` : ''}`,
    ),
  ];
  if (input.extra.trim()) {
    textLines.push('', 'Anything else:', input.extra.trim());
  }
  const text = textLines.join('\n');

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#1A1815;">
      <p style="margin:0 0 16px;font-weight:600;">PIP prep — Louis’s full answers.</p>
      <table style="border-collapse:collapse;width:100%;">
        ${rows
          .map(
            (r) => `
          <tr>
            <td style="padding:12px;border-bottom:1px solid rgba(0,0,0,0.08);vertical-align:top;">
              <strong>${escapeHtml(r.name)}</strong> — ${escapeHtml(r.label)}
              <div style="color:#8A8178;font-size:13px;">${escapeHtml(r.subtitle)}</div>
              ${r.note ? `<div style="color:#5A5750;margin-top:6px;white-space:pre-wrap;">${escapeHtml(r.note)}</div>` : ''}
            </td>
          </tr>`,
          )
          .join('')}
      </table>
      ${
        input.extra.trim()
          ? `<p style="margin:20px 0 4px;"><strong>Anything else:</strong></p>
             <div style="white-space:pre-wrap;border:1px solid rgba(0,0,0,0.08);padding:16px;background:#FAFAF8;">${escapeHtml(input.extra.trim())}</div>`
          : ''
      }
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
      subject: 'PIP prep — Louis’s full answers',
      text,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return { delivered: false, reason: `resend_error:${response.status}:${details}` as const };
  }

  return { delivered: true as const };
}
