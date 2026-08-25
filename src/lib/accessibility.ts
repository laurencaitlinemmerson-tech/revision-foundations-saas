export type A11ySettings = {
  font: 'default' | 'dyslexic';
  lineHeight: 'default' | 'loose';
  motion: 'default' | 'reduced';
  theme: 'default' | 'night';
};

export const DEFAULT_A11Y_SETTINGS: A11ySettings = {
  font: 'default',
  lineHeight: 'default',
  motion: 'default',
  theme: 'default',
};

export const A11Y_STORAGE_KEY = 'nurselab.a11y';
export const A11Y_CHANGE_EVENT = 'nurselab:a11y-change';

export function mergeA11ySettings(
  value: Partial<A11ySettings> | null | undefined,
): A11ySettings {
  return {
    ...DEFAULT_A11Y_SETTINGS,
    ...(value ?? {}),
  };
}

export function applyA11ySettingsToRoot(
  root: Pick<Element, 'setAttribute'>,
  settings: A11ySettings,
) {
  root.setAttribute('data-a11y-font', settings.font);
  root.setAttribute('data-a11y-lineheight', settings.lineHeight);
  root.setAttribute('data-a11y-motion', settings.motion);
  root.setAttribute('data-a11y-theme', settings.theme);
}

export function readA11ySettingsFromStorage(
  storage: Pick<Storage, 'getItem'>,
): A11ySettings {
  try {
    const raw = storage.getItem(A11Y_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_A11Y_SETTINGS;
    }

    return mergeA11ySettings(JSON.parse(raw) as Partial<A11ySettings>);
  } catch {
    return DEFAULT_A11Y_SETTINGS;
  }
}

export function readA11ySettingsFromDocument(
  root: Element | null,
): A11ySettings {
  if (!root) {
    return DEFAULT_A11Y_SETTINGS;
  }

  return mergeA11ySettings({
    font:
      root.getAttribute('data-a11y-font') === 'dyslexic'
        ? 'dyslexic'
        : 'default',
    lineHeight:
      root.getAttribute('data-a11y-lineheight') === 'loose'
        ? 'loose'
        : 'default',
    motion:
      root.getAttribute('data-a11y-motion') === 'reduced'
        ? 'reduced'
        : 'default',
    theme:
      root.getAttribute('data-a11y-theme') === 'night' ? 'night' : 'default',
  });
}

export function getEffectiveReducedMotion(
  settings: A11ySettings,
  systemPrefersReducedMotion: boolean,
) {
  return settings.motion === 'reduced' || systemPrefersReducedMotion;
}

export function getA11yBootstrapScript() {
  // Runs blocking in <head> before first paint. Night mode in particular has
  // to be resolved here — applying it after hydration means a full-brightness
  // cream flash first, which is exactly what someone reading at 1am does not
  // want. The background is also set inline for the same reason.
  return `
    (function () {
      try {
        var raw = window.localStorage.getItem('${A11Y_STORAGE_KEY}');
        if (!raw) return;
        var parsed = JSON.parse(raw);
        var settings = {
          font: parsed && parsed.font === 'dyslexic' ? 'dyslexic' : 'default',
          lineHeight: parsed && parsed.lineHeight === 'loose' ? 'loose' : 'default',
          motion: parsed && parsed.motion === 'reduced' ? 'reduced' : 'default',
          theme: parsed && parsed.theme === 'night' ? 'night' : 'default'
        };
        var root = document.documentElement;
        root.setAttribute('data-a11y-font', settings.font);
        root.setAttribute('data-a11y-lineheight', settings.lineHeight);
        root.setAttribute('data-a11y-motion', settings.motion);
        root.setAttribute('data-a11y-theme', settings.theme);
        if (settings.theme === 'night') {
          root.style.colorScheme = 'dark';
          root.style.backgroundColor = '#191713';
        }
      } catch (error) {
        /* no-op */
      }
    })();
  `;
}

export function getA11yDocumentStyle() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap');

    html[data-a11y-font='dyslexic'] body,
    html[data-a11y-font='dyslexic'] body *:not(code):not(pre):not(kbd):not(samp):not(svg):not(path) {
      font-family: 'Atkinson Hyperlegible', 'Arial', sans-serif !important;
    }

    html[data-a11y-lineheight='loose'] body {
      line-height: 1.9 !important;
    }

    html[data-a11y-lineheight='loose'] p,
    html[data-a11y-lineheight='loose'] li,
    html[data-a11y-lineheight='loose'] label,
    html[data-a11y-lineheight='loose'] input,
    html[data-a11y-lineheight='loose'] textarea,
    html[data-a11y-lineheight='loose'] button,
    html[data-a11y-lineheight='loose'] a,
    html[data-a11y-lineheight='loose'] span {
      line-height: 1.95 !important;
      letter-spacing: 0.012em;
      word-spacing: 0.08em;
    }

    html[data-a11y-lineheight='loose'] h1,
    html[data-a11y-lineheight='loose'] h2,
    html[data-a11y-lineheight='loose'] h3,
    html[data-a11y-lineheight='loose'] h4,
    html[data-a11y-lineheight='loose'] h5,
    html[data-a11y-lineheight='loose'] h6 {
      line-height: 1.2 !important;
    }

    html[data-a11y-motion='reduced'] *,
    html[data-a11y-motion='reduced'] *::before,
    html[data-a11y-motion='reduced'] *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      transition-delay: 0ms !important;
      scroll-behavior: auto !important;
    }
  `;
}
