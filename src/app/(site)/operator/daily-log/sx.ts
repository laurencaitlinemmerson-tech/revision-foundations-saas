import type { CSSProperties } from 'react';

const cache = new Map<string, CSSProperties>();

/**
 * Parse a CSS declaration string into a React style object.
 *
 * The redesign computes most of its styling as CSS text in the derivation layer
 * (`'height:100%;width:42%;background:#8B72C4;'`), so the view needs to hand
 * those strings to React as objects. Results are cached because the same
 * handful of strings recur across every render.
 */
export function sx(css: string | CSSProperties | null | undefined): CSSProperties {
  if (!css) return {};
  if (typeof css !== 'string') return css;

  const hit = cache.get(css);
  if (hit) return hit;

  const style: Record<string, string> = {};
  for (const decl of css.split(';')) {
    const at = decl.indexOf(':');
    if (at === -1) continue;
    const prop = decl.slice(0, at).trim();
    const value = decl.slice(at + 1).trim();
    if (!prop || !value) continue;
    style[prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = value;
  }

  const out = style as CSSProperties;
  cache.set(css, out);
  return out;
}
