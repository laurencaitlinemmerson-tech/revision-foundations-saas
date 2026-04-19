import { readFile } from 'node:fs/promises';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  getA11yBootstrapScript,
  getA11yDocumentStyle,
} from '@/lib/accessibility';
import {
  getUserEntitlements,
  hasAccessToContent,
  type Product,
} from '@/lib/entitlements';

const PREVIEW_SEARCH_PARAM = 'preview';
const PREVIEW_SECONDS = 180;

const htmlCache = new Map<string, Promise<string>>();

function readHtml(fileUrl: URL) {
  const key = fileUrl.href;
  const cached = htmlCache.get(key);
  if (cached) return cached;

  const promise = readFile(fileUrl, 'utf8');
  htmlCache.set(key, promise);
  return promise;
}

function getPreviewExpiryScript(product: Product) {
  const productLabel = product === 'osce' ? 'OSCE tool' : 'quiz';
  const pricingUrl = `/pricing?product=${product}`;
  const tried = product === 'osce'
    ? 'one station warm-up'
    : 'one quiz warm-up';
  const nextBlock = product === 'osce'
    ? 'Next: unlock the full bank, run one timed paediatric station, then repeat the section that felt least fluent.'
    : 'Next: unlock the full quiz, answer 10 mixed questions, mark your slowest topic, then repeat it once.';

  return `
<script>
(() => {
  const limitMs = ${PREVIEW_SECONDS * 1000};
  const pricingUrl = ${JSON.stringify(pricingUrl)};
  const productLabel = ${JSON.stringify(productLabel)};
  const tried = ${JSON.stringify(tried)};
  const nextBlock = ${JSON.stringify(nextBlock)};

  function expirePreview() {
    document.documentElement.innerHTML = '<head><title>Preview ended | The Nurse Lab</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
      '<body style="margin:0;background:#FAFAF8;color:#1C1510;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;">' +
      '<main style="min-height:100vh;box-sizing:border-box;display:flex;align-items:center;justify-content:center;padding:24px;">' +
      '<section style="max-width:520px;background:#fff;border:1px solid rgba(28,21,16,.12);padding:34px 28px;text-align:center;">' +
      '<p style="margin:0 0 12px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#9C8878;">Preview ended</p>' +
      '<h1 style="font-family:Georgia,serif;font-weight:400;line-height:1.08;font-size:clamp(2rem,8vw,3rem);margin:0 0 14px;">Keep practising with full access.</h1>' +
      '<p style="margin:0 0 14px;color:#5C4A38;line-height:1.75;font-size:15px;">You just tried ' + tried + '. The free ' + productLabel + ' preview is limited to 3 minutes.</p>' +
      '<p style="margin:0 0 24px;background:#F5F3F0;padding:14px 16px;color:#5C4A38;line-height:1.65;font-size:13px;text-align:left;">' + nextBlock + '</p>' +
      '<a target="_top" href="' + pricingUrl + '" style="display:inline-flex;justify-content:center;background:#1C1510;color:#FAFAF8;text-decoration:none;padding:14px 22px;font-size:14px;">Unlock full access</a>' +
      '</section></main></body>';
  }

  window.setTimeout(expirePreview, limitMs);
})();
</script>
`;
}

function injectPreviewGate(html: string, product: Product) {
  const script = getPreviewExpiryScript(product);
  if (html.includes('</body>')) {
    return html.replace('</body>', `${script}</body>`);
  }

  return `${html}${script}`;
}

function injectA11ySupport(html: string) {
  const a11yMarkup = `
<style>${getA11yDocumentStyle()}</style>
<script>${getA11yBootstrapScript()}</script>
`;

  if (html.includes('</head>')) {
    return html.replace('</head>', `${a11yMarkup}</head>`);
  }

  return `${a11yMarkup}${html}`;
}

function redirectToSignIn(request: NextRequest) {
  const signInUrl = new URL('/sign-in', request.url);
  signInUrl.searchParams.set('redirect_url', request.url);
  return NextResponse.redirect(signInUrl);
}

async function hasPremiumToolAccess(userId: string, product: Product) {
  const entitlements = await getUserEntitlements(userId);
  return hasAccessToContent(entitlements, product);
}

export async function serveToolHtml(
  request: NextRequest,
  product: Product,
  fileUrl: URL,
) {
  const isPreview = request.nextUrl.searchParams.get(PREVIEW_SEARCH_PARAM) === '1';
  const { userId } = await auth();
  const hasPremium = userId ? await hasPremiumToolAccess(userId, product) : false;

  if (!hasPremium && !isPreview) {
    return redirectToSignIn(request);
  }

  const html = injectA11ySupport(await readHtml(fileUrl));
  const body = isPreview && !hasPremium ? injectPreviewGate(html, product) : html;

  return new NextResponse(body, {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Type': 'text/html; charset=utf-8',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
