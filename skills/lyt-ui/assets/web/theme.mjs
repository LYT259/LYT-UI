export function resolveTokens(tokens, mode = 'light', preset = 'lyt') {
  const theme = tokens.themes[mode] ?? tokens.themes.light;
  const variant = tokens.presets[preset] ?? tokens.presets.lyt;
  return { ...tokens.common, ...theme, ...variant.common, ...variant[mode] };
}

export function applyTheme(tokens, { mode = 'system', preset = 'lyt', systemDark = false } = {}, root = document.documentElement) {
  const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  const values = resolveTokens(tokens, resolved, preset);
  for (const [key, value] of Object.entries(values)) root.style.setProperty(`--${key}`, value);
  root.dataset.theme = resolved;
  root.dataset.preset = preset;
  root.style.colorScheme = resolved;
  return values;
}

export function contrast(a, b) {
  const luminance = hex => {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error('Contrast requires opaque six-digit sRGB colors');
    const c = hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
