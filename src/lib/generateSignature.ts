function formatSigName(raw: string): string {
  if (!raw) return '';
  if (raw.includes(',')) {
    const [last, rest] = raw.split(',').map(s => s.trim());
    const first = (rest.split(' ')[0] || '').replace(/[^a-zA-Z]/g, '');
    return (first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()) + ' ' +
           (last.charAt(0).toUpperCase() + last.slice(1).toLowerCase());
  }
  return raw.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Simple seeded noise — gives consistent jitter for the same name
function seededNoise(seed: number, i: number): number {
  const s = Math.sin(seed * 9301 + i * 49297 + 233) * 49871;
  return s - Math.floor(s); // 0..1
}

// Apply a subtle vertical wave across the canvas pixels to simulate unsteady hand
function waveDistort(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  const src = ctx.getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);
  const s = src.data, d = dst.data;

  for (let x = 0; x < w; x++) {
    // 1–2px vertical shift that slowly oscillates across the width
    const shift = Math.round(
      Math.sin(x * 0.18 + seed) * 1.2 +
      Math.sin(x * 0.07 + seed * 2.3) * 0.8
    );
    for (let y = 0; y < h; y++) {
      const sy = Math.max(0, Math.min(h - 1, y + shift));
      const di = (y * w + x) * 4;
      const si = (sy * w + x) * 4;
      d[di] = s[si]; d[di+1] = s[si+1]; d[di+2] = s[si+2]; d[di+3] = s[si+3];
    }
  }
  ctx.putImageData(dst, 0, 0);
}

export const SIGNATURE_FONTS: { key: string; label: string; family: string }[] = [
  { key: 'kalam',        label: 'Kalam',          family: "'Kalam', cursive" },
  { key: 'indie',        label: 'Indie Flower',    family: "'Indie Flower', cursive" },
  { key: 'reenie',       label: 'Reenie Beanie',   family: "'Reenie Beanie', cursive" },
  { key: 'caveat',       label: 'Caveat',          family: "'Caveat', cursive" },
  { key: 'patrick',      label: 'Patrick Hand',    family: "'Patrick Hand', cursive" },
  { key: 'dancing',      label: 'Dancing Script',  family: "'Dancing Script', cursive" },
  { key: 'satisfy',      label: 'Satisfy',         family: "'Satisfy', cursive" },
  { key: 'sacramento',   label: 'Sacramento',      family: "'Sacramento', cursive" },
];

// Keep internal alias for the auto-pick logic
const FONTS = SIGNATURE_FONTS.map(f => f.family);

export async function generateSignature(
  ctx: CanvasRenderingContext2D,
  rawName: string,
  width: number,
  height: number,
  fontFamily?: string          // optional override; auto-picks from name if omitted
) {
  const name = formatSigName(rawName);
  if (!name) return;

  // Seed from name
  let seed0 = 0;
  for (let i = 0; i < name.length; i++) seed0 = (seed0 * 31 + name.charCodeAt(i)) >>> 0;

  const chosenFont = fontFamily ?? FONTS[seed0 % FONTS.length];

  // Sacramento / Reenie Beanie are taller — need smaller size
  const isTall = chosenFont.includes('Sacramento') || chosenFont.includes('Reenie');
  const isLight = chosenFont.includes('Reenie') || chosenFont.includes('Indie') || chosenFont.includes('Patrick');
  const fontSize = Math.min(height * (isTall ? 0.44 : 0.52), isTall ? 42 : 50);
  const fontStr = `${isLight ? '' : 'bold '}${fontSize}px ${chosenFont}`;

  try { await document.fonts.load(fontStr); } catch (_) {}

  ctx.clearRect(0, 0, width, height);

  const seed = seed0;
  const ns = (i: number) => seededNoise(seed, i);

  // ── Draw the name word by word with slight baseline drift ──
  ctx.save();
  ctx.font = fontStr;
  ctx.textBaseline = 'alphabetic';
  ctx.textBaseline = 'alphabetic';

  const baseY = height * 0.64;
  const startX = width * 0.06;

  // Slight global tilt (–3° to –6°)
  const tilt = -(0.045 + ns(0) * 0.03);
  ctx.translate(startX, baseY);
  ctx.rotate(tilt);

  // Measure full name for centering / underline
  const totalWidth = ctx.measureText(name).width;

  // Pass 1 — soft shadow (ink bleed)
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#111';
  ctx.filter = 'blur(1.5px)';
  ctx.fillText(name, 1.5, 1.5);

  // Pass 2 — main stroke at natural ink weight
  ctx.filter = 'none';
  ctx.globalAlpha = 0.88 + ns(1) * 0.10;
  ctx.fillStyle = '#0a0a12';
  ctx.font = fontStr; // re-assert after filter reset
  ctx.fillText(name, 0, 0);

  // Pass 3 — second word with a tiny y-drift for that mid-signature waver
  const words = name.split(' ');
  if (words.length > 1) {
    const firstW = ctx.measureText(words[0] + ' ').width;
    const drift = (ns(2) - 0.5) * 3.5; // –1.75 to +1.75 px
    ctx.globalAlpha = 0.82 + ns(3) * 0.12;
    // Redraw second word over itself with drift
    ctx.fillStyle = '#0d0d18';
    ctx.fillText(words.slice(1).join(' '), firstW, drift);
  }

  ctx.globalAlpha = 1;
  ctx.restore();

  // ── Pixel-level wave distortion ──
  waveDistort(ctx, width, height, (seed % 628) / 100);
}
