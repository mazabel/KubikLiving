import { useMemo } from 'react';

type Position = 'top' | 'bottom' | 'left' | 'right';
type Curve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out';

interface GradualBlurProps {
  position?: Position;
  strength?: number;
  height?: string;
  divCount?: number;
  curve?: Curve;
  exponential?: boolean;
  opacity?: number;
  zIndex?: number;
  className?: string;
}

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: p => p,
  bezier: p => p * p * (3 - 2 * p),
  'ease-in': p => p * p,
  'ease-out': p => 1 - Math.pow(1 - p, 2),
  'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const GRADIENT_DIRECTION: Record<Position, string> = {
  top: 'to top',
  bottom: 'to bottom',
  left: 'to left',
  right: 'to right',
};

export function GradualBlur({
  position = 'bottom',
  strength = 2,
  height = '6rem',
  divCount = 8,
  curve = 'ease-out',
  exponential = false,
  opacity = 1,
  zIndex = 10,
  className = '',
}: GradualBlurProps) {
  const blurDivs = useMemo(() => {
    const divs = [];
    const increment = 100 / divCount;
    const curveFunc = CURVE_FUNCTIONS[curve] ?? CURVE_FUNCTIONS.linear;
    const direction = GRADIENT_DIRECTION[position];

    for (let i = 1; i <= divCount; i++) {
      let progress = i / divCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * strength;
      } else {
        blurValue = 0.0625 * (progress * divCount + 1) * strength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const maskImage = `linear-gradient(${direction}, ${gradient})`;

      divs.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            maskImage,
            WebkitMaskImage: maskImage,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity,
          }}
        />
      );
    }
    return divs;
  }, [position, strength, divCount, curve, exponential, opacity]);

  const isVertical = position === 'top' || position === 'bottom';

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex,
    left: 0,
    right: 0,
    ...(isVertical
      ? {
          height,
          width: '100%',
          [position]: 0,
        }
      : {
          width: height,
          height: '100%',
          top: 0,
          bottom: 0,
          [position]: 0,
        }),
  };

  return (
    <div style={containerStyle} className={className}>
      {blurDivs}
    </div>
  );
}
