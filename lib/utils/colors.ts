// lib/utils/colors.ts

/**
 * Renk değerini güvenli hex formatına çevirir
 * lab(), oklch() gibi formatları varsayılan renge çevirir
 */
export function ensureHexColor(color: string | undefined): string {
  if (!color) return '#3B82F6'; // Varsayılan mavi

  // Zaten hex formatındaysa direkt dön
  if (color.startsWith('#')) {
    return color;
  }

  // rgb/rgba formatı
  if (color.startsWith('rgb')) {
    return rgbToHex(color);
  }

  // hsl formatı
  if (color.startsWith('hsl')) {
    return hslToHex(color);
  }

  // lab, oklch veya desteklenmeyen formatlar
  if (color.includes('lab') || color.includes('oklch') || color.includes('lch')) {
    console.warn(`Unsupported color format: ${color}, using default`);
    return '#3B82F6'; // Varsayılan mavi
  }

  // Bilinmeyen format, varsayılan dön
  return '#3B82F6';
}

/**
 * RGB/RGBA string'ini hex'e çevirir
 */
function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#3B82F6';

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * HSL string'ini hex'e çevirir (basitleştirilmiş)
 */
function hslToHex(hsl: string): string {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return '#3B82F6';

  let h = parseInt(match[1]) / 360;
  let s = parseInt(match[2]) / 100;
  let l = parseInt(match[3]) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Renge opacity ekler (hex formatına)
 */
export function addOpacity(color: string, opacity: number): string {
  const hex = ensureHexColor(color);
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${hex}${alpha}`;
}

/**
 * Rengi açar/koyulaştırır
 */
export function adjustBrightness(color: string, percent: number): string {
  const hex = ensureHexColor(color).replace('#', '');
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}