import { useRef, useEffect, useCallback, RefObject, CSSProperties } from 'react';

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  style?: CSSProperties;
}

function parseFontVariationSettings(settings: string): Record<string, number> {
  const result: Record<string, number> = {};
  const regex = /'([^']+)'\s+([\d.+-]+)/g;
  let match;
  while ((match = regex.exec(settings)) !== null) {
    result[match[1]] = parseFloat(match[2]);
  }
  return result;
}

function buildFontVariationSettings(settings: Record<string, number>): string {
  return Object.entries(settings)
    .map(([key, val]) => `'${key}' ${val}`)
    .join(', ');
}

function getFalloff(distance: number, radius: number, falloff: string): number {
  const t = Math.max(0, 1 - distance / radius);
  if (falloff === 'exponential') return t * t;
  if (falloff === 'gaussian') {
    const sigma = 0.4;
    return Math.exp(-(Math.pow(1 - t, 2)) / (2 * sigma * sigma));
  }
  return t;
}

export function VariableProximity({
  label,
  fromFontVariationSettings,
  toFontVariationSettings,
  containerRef,
  radius = 150,
  falloff = 'gaussian',
  className,
  style,
}: VariableProximityProps) {
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const fromSettings = parseFontVariationSettings(fromFontVariationSettings);
  const toSettings = parseFontVariationSettings(toFontVariationSettings);

  const updateCharacters = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mx = mousePos.current.x;
    const my = mousePos.current.y;

    spanRefs.current.forEach((span) => {
      if (!span) return;
      const rect = span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - containerRect.left;
      const cy = rect.top + rect.height / 2 - containerRect.top;
      const localMx = mx - containerRect.left;
      const localMy = my - containerRect.top;
      const dist = Math.sqrt(Math.pow(localMx - cx, 2) + Math.pow(localMy - cy, 2));

      const factor = getFalloff(dist, radius, falloff);

      const interpolated: Record<string, number> = {};
      for (const key in fromSettings) {
        const from = fromSettings[key];
        const to = toSettings[key] ?? from;
        interpolated[key] = from + (to - from) * factor;
      }

      span.style.fontVariationSettings = buildFontVariationSettings(interpolated);
    });
  }, [containerRef, radius, falloff, fromSettings, toSettings]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateCharacters);
    };

    const onMouseLeave = () => {
      spanRefs.current.forEach((span) => {
        if (!span) return;
        span.style.fontVariationSettings = fromFontVariationSettings;
      });
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [containerRef, fromFontVariationSettings, updateCharacters]);

  const lines = label.split('\n');
  let charIndex = 0;

  return (
    <span className={className} style={style}>
      {lines.map((line, lineIdx) => {
        const words = line.split(' ');
        return (
          <span key={lineIdx} style={{ display: 'block' }}>
            {words.map((word, wordIdx) => {
              const wordSpans = word.split('').map((char) => {
                const idx = charIndex++;
                return (
                  <span
                    key={idx}
                    ref={(el) => { spanRefs.current[idx] = el; }}
                    style={{
                      display: 'inline-block',
                      fontVariationSettings: fromFontVariationSettings,
                      transition: 'font-variation-settings 0.1s ease-out',
                    }}
                  >
                    {char}
                  </span>
                );
              });
              return (
                <span key={wordIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                  {wordSpans}
                  {wordIdx < words.length - 1 && (
                    <span style={{ display: 'inline-block' }}>&nbsp;</span>
                  )}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
