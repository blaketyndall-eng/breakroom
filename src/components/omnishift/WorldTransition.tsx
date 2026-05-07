import { useEffect, useRef, useState } from 'react';

/**
 * VHS Title Card Transition — plays during Clock In / Clock Out world switch.
 * Full-screen canvas overlay with analog degradation pipeline.
 * Shows 3-5 random cards then calls onComplete.
 */

const CARDS = [
  { word: 'BRUTAL', bg: [45, 12, 60], fg: [255, 100, 220], echo: [180, 50, 255], style: 'bold' as const },
  { word: 'ILLEGAL', bg: [60, 15, 20], fg: [255, 80, 80], echo: [255, 200, 60], style: 'bold' as const },
  { word: 'I AM\nDEFINITELY\nUP TO\nSOMETHING', bg: [10, 40, 50], fg: [0, 255, 200], echo: [255, 100, 80], style: 'block' as const },
  { word: "WHAT I'M\nAFTER\nCAN'T BE\nPURCHASED", bg: [35, 10, 75], fg: [255, 230, 140], echo: [200, 180, 100], style: 'italic' as const },
  { word: "WE'RE\nCOOKED", bg: [50, 10, 10], fg: [255, 140, 60], echo: [255, 60, 180], style: 'bold' as const },
  { word: 'KEEP\nSMILING', bg: [55, 5, 45], fg: [255, 130, 200], echo: [100, 255, 220], style: 'italic' as const },
  { word: 'CHAOS IS\nMY\nCOMFORT\nZONE', bg: [20, 10, 55], fg: [220, 80, 255], echo: [80, 220, 255], style: 'bold' as const },
  { word: 'YOU KNOW\nNOTHING', bg: [10, 20, 50], fg: [200, 220, 255], echo: [255, 180, 80], style: 'bold' as const },
  { word: 'THE FUN\nIS BACK', bg: [15, 15, 70], fg: [255, 240, 80], echo: [80, 255, 200], style: 'block' as const },
  { word: 'IMAXXING', bg: [50, 30, 5], fg: [255, 180, 50], echo: [255, 80, 180], style: 'bold' as const },
  { word: "AGGRESSIVELY\nDOESN'T\nKNOW", bg: [20, 20, 30], fg: [180, 180, 200], echo: [100, 255, 180], style: 'italic' as const },
  { word: 'THE AND', bg: [70, 10, 10], fg: [255, 210, 100], echo: [255, 100, 100], style: 'italic' as const },
  { word: 'GET A\nLIFE', bg: [5, 35, 45], fg: [80, 255, 200], echo: [255, 200, 80], style: 'bold' as const },
  { word: 'SIMON\nSAYS SIT', bg: [40, 5, 50], fg: [255, 100, 180], echo: [100, 200, 255], style: 'bold' as const },
  { word: 'FOREVER', bg: [30, 10, 55], fg: [200, 150, 255], echo: [255, 200, 100], style: 'italic' as const },
  { word: 'NO SLEEP', bg: [10, 10, 45], fg: [255, 240, 80], echo: [80, 200, 255], style: 'bold' as const },
  { word: "TOO\nNAUGHTY\nTO SAY\nNO", bg: [60, 8, 30], fg: [255, 100, 150], echo: [255, 200, 220], style: 'italic' as const },
  { word: 'OVERWORKED', bg: [20, 15, 10], fg: [255, 160, 60], echo: [200, 100, 40], style: 'bold' as const },
  { word: 'NEVER\nENDING\nFUN', bg: [50, 10, 50], fg: [255, 80, 255], echo: [80, 255, 180], style: 'block' as const },
  { word: "I DIDN'T\nCOME THIS\nFAR TO\nCOME\nTHIS FAR", bg: [15, 30, 50], fg: [200, 230, 255], echo: [100, 180, 255], style: 'italic' as const },
  { word: 'THIS USER\nIS\nBLESSED', bg: [45, 15, 55], fg: [255, 200, 100], echo: [200, 100, 255], style: 'italic' as const },
  { word: 'CAN', bg: [10, 45, 35], fg: [0, 255, 180], echo: [180, 255, 80], style: 'bold' as const },
  { word: 'PRETTY\nHUSTLER', bg: [55, 5, 35], fg: [255, 120, 200], echo: [200, 80, 255], style: 'italic' as const },
  { word: 'LET ME\nDISTRACT\nYOU', bg: [40, 10, 10], fg: [255, 200, 80], echo: [255, 100, 60], style: 'bold' as const },
  { word: 'PLEASURE', bg: [50, 5, 50], fg: [255, 140, 220], echo: [140, 220, 255], style: 'italic' as const },
];

type CardStyle = 'bold' | 'italic' | 'block';
type Card = typeof CARDS[number];

interface Props {
  /** How many cards to show before completing (default 4) */
  cardCount?: number;
  /** Called when the transition sequence finishes */
  onComplete?: () => void;
}

function shufflePick(count: number): Card[] {
  const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getFont(style: CardStyle, sz: number): string {
  if (style === 'italic') return `italic 700 ${sz}px Georgia, "Palatino Linotype", serif`;
  if (style === 'block') return `900 ${sz}px "Trebuchet MS", "Lucida Grande", sans-serif`;
  return `700 ${sz}px Georgia, "Palatino Linotype", serif`;
}

// Phosphor blur offset grid — weighted more horizontal than vertical
const BLUR_STEPS: [number, number][] = [
  [-5, 0], [5, 0], [-4, 0], [4, 0], [-3, 0], [3, 0], [-2, 0], [2, 0], [-1, 0], [1, 0],
  [-3, -1], [3, -1], [-3, 1], [3, 1], [-2, -1], [2, -1], [-2, 1], [2, 1],
  [-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1], [-4, -1], [4, -1], [0, -2], [0, 2],
];

function applyVHSBleed(d: ImageData, W: number, H: number) {
  const p = d.data;
  for (let y = 0; y < H; y += 2) {
    for (let x = W - 1; x > 2; x--) {
      const i = (y * W + x) * 4;
      const prev = (y * W + x - 2) * 4;
      p[i] = Math.min(255, p[i] * 0.8 + p[prev] * 0.2);
    }
  }
}

function applyGentleChroma(d: ImageData, W: number, H: number) {
  const p = d.data;
  const c = new Uint8ClampedArray(p);
  for (let y = 0; y < H; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = (y * W + x) * 4;
      p[i] = c[(y * W + x + 1) * 4];
      p[i + 2] = c[(y * W + x - 1) * 4 + 2];
    }
  }
}

function applyGrain(d: ImageData, amt: number) {
  const p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const n = (Math.random() - 0.5) * amt;
    p[i] = Math.min(255, Math.max(0, p[i] + n));
    p[i + 1] = Math.min(255, Math.max(0, p[i + 1] + n));
    p[i + 2] = Math.min(255, Math.max(0, p[i + 2] + n));
  }
}

function applyMicroTracking(d: ImageData, W: number, H: number) {
  const p = d.data;
  const y = Math.floor(Math.random() * H);
  const sh = Math.floor(Math.random() * 4) - 2;
  for (let dy = 0; dy < 2 && y + dy < H; dy++) {
    const row = (y + dy) * W * 4;
    const rd = new Uint8ClampedArray(W * 4);
    for (let x = 0; x < W; x++) {
      const sx = Math.min(W - 1, Math.max(0, x - sh));
      rd[x * 4] = p[row + sx * 4];
      rd[x * 4 + 1] = p[row + sx * 4 + 1];
      rd[x * 4 + 2] = p[row + sx * 4 + 2];
      rd[x * 4 + 3] = 255;
    }
    p.set(rd, row);
  }
}

export default function WorldTransition({ cardCount = 4, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to fill viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    const deck = shufflePick(cardCount);
    let ci = 0;
    let last = 0;
    let fadePhase = 1;
    let animId = 0;
    const CARD_DURATION = 4200; // ms per card
    const FADE_DURATION = 500; // ms for crossfade

    function measureCard(card: Card): number {
      const w = W(), h = H();
      const lines = card.word.split('\n');
      const n = lines.length;
      let sz = n === 1 ? 140 : n === 2 ? 110 : n <= 3 ? 85 : n <= 4 ? 72 : 60;
      // Scale base size relative to viewport (prototype was 680px wide)
      sz = Math.round(sz * (w / 680));
      ctx!.font = getFont(card.style, sz);
      let maxW = 0;
      lines.forEach(l => { const m = ctx!.measureText(l).width; if (m > maxW) maxW = m; });
      const targetW = w * 0.88;
      if (maxW > targetW) sz = Math.floor(sz * (targetW / maxW));
      if (maxW < targetW * 0.6) sz = Math.floor(sz * (targetW * 0.85 / maxW));
      return Math.min(sz, Math.round(180 * (w / 680)));
    }

    function drawCard(card: Card, t: number) {
      const w = W(), h = H();
      // Breathing background
      const breathe = Math.sin(t * 0.0008) * 0.06;
      const bg = [
        Math.max(0, card.bg[0] + card.bg[0] * breathe) | 0,
        Math.max(0, card.bg[1] + card.bg[1] * breathe) | 0,
        Math.max(0, card.bg[2] + card.bg[2] * breathe) | 0,
      ];
      ctx!.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`;
      ctx!.fillRect(0, 0, w, h);

      const lines = card.word.split('\n');
      const sz = measureCard(card);
      const font = getFont(card.style, sz);
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      const lh = sz * 1.1;
      const totalH = lines.length * lh;
      const startY = h / 2 - totalH / 2 + lh / 2;

      // Echo drift
      const drift = Math.sin(t * 0.001) * 1.5;
      const echoBreath = 0.09 + Math.sin(t * 0.0015) * 0.03;
      for (let e = 3; e >= 1; e--) {
        const alpha = echoBreath - e * 0.018;
        const yOff = -e * 10 + drift;
        ctx!.fillStyle = `rgba(${card.echo[0]},${card.echo[1]},${card.echo[2]},${Math.max(0, alpha)})`;
        ctx!.font = font;
        lines.forEach((line, li) => {
          ctx!.fillText(line, w / 2, startY + li * lh + yOff);
        });
      }

      // Phosphor blur
      BLUR_STEPS.forEach(([bx, by]) => {
        const dist = Math.sqrt(bx * bx + by * by * 4);
        const a = 0.08 / dist;
        ctx!.fillStyle = `rgba(${card.fg[0]},${card.fg[1]},${card.fg[2]},${a})`;
        ctx!.font = font;
        lines.forEach((line, li) => {
          ctx!.fillText(line, w / 2 + bx * 1.5, startY + li * lh + by * 1.3);
        });
      });

      // Extrusion shadow
      ctx!.font = font;
      for (let s = 3; s >= 1; s--) {
        ctx!.fillStyle = `rgba(0,0,0,${0.15 - s * 0.025})`;
        lines.forEach((line, li) => {
          ctx!.fillText(line, w / 2 + s * 0.8, startY + li * lh + s * 0.8);
        });
      }

      // Main text
      ctx!.fillStyle = `rgba(${card.fg[0]},${card.fg[1]},${card.fg[2]},0.92)`;
      ctx!.font = font;
      lines.forEach((line, li) => {
        ctx!.fillText(line, w / 2, startY + li * lh);
      });

      // Post-processing pipeline
      const imgData = ctx!.getImageData(0, 0, w, h);
      applyVHSBleed(imgData, w, h);
      applyGentleChroma(imgData, w, h);
      applyGrain(imgData, 22 + Math.sin(t * 0.003) * 6);
      if (Math.random() > 0.93) applyMicroTracking(imgData, w, h);
      ctx!.putImageData(imgData, 0, 0);

      // Vignette
      const vg = ctx!.createRadialGradient(w / 2, h / 2, h * 0.32, w / 2, h / 2, h * 0.82);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.42)');
      ctx!.fillStyle = vg;
      ctx!.fillRect(0, 0, w, h);

      // Crossfade black overlay
      if (fadePhase < 1) {
        ctx!.fillStyle = `rgba(0,0,0,${1 - fadePhase})`;
        ctx!.fillRect(0, 0, w, h);
      }
    }

    function loop(t: number) {
      if (!last) last = t;
      const elapsed = t - last;

      if (elapsed > CARD_DURATION) {
        if (elapsed < CARD_DURATION + FADE_DURATION) {
          fadePhase = 1 - (elapsed - CARD_DURATION) / FADE_DURATION;
        } else {
          ci++;
          if (ci >= deck.length) {
            // Transition complete — fade out overlay
            setVisible(false);
            setTimeout(() => onComplete?.(), 400);
            return;
          }
          last = t;
          fadePhase = 0;
        }
      } else if (elapsed < FADE_DURATION) {
        fadePhase = Math.min(1, elapsed / FADE_DURATION);
      } else {
        fadePhase = 1;
      }

      drawCard(deck[ci], t);
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [cardCount, onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="world-transition-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#000',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100vw', height: '100vh' }}
      />
    </div>
  );
}
