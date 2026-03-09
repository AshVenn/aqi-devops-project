import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface AQIGaugeProps {
  value: number;
  category: string;
  className?: string;
}

// AQI ranges with colors
const AQI_RANGES = [
  { min: 0, max: 50, label: 'Good', color: 'hsl(var(--aqi-good))' },
  { min: 51, max: 100, label: 'Moderate', color: 'hsl(var(--aqi-moderate))' },
  { min: 101, max: 150, label: 'Unhealthy for Sensitive', color: 'hsl(var(--aqi-unhealthy-sensitive))' },
  { min: 151, max: 200, label: 'Unhealthy', color: 'hsl(var(--aqi-unhealthy))' },
  { min: 201, max: 300, label: 'Very Unhealthy', color: 'hsl(var(--aqi-very-unhealthy))' },
  { min: 301, max: 500, label: 'Hazardous', color: 'hsl(var(--aqi-hazardous))' },
];

const MAX_AQI = 500;
const START_ANGLE = -225; // Start from bottom-left
const END_ANGLE = 45; // End at bottom-right
const TOTAL_ANGLE = END_ANGLE - START_ANGLE; // 270 degrees total

function getColorForAQI(aqi: number): string {
  const range = AQI_RANGES.find(r => aqi >= r.min && aqi <= r.max);
  return range?.color || AQI_RANGES[AQI_RANGES.length - 1].color;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
}

export function AQIGauge({ value, category, className }: AQIGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const clampedValue = Math.min(Math.max(value, 0), MAX_AQI);

  // Animate the needle
  useEffect(() => {
    const duration = 1000; // 1 second animation
    const startTime = performance.now();
    const startValue = animatedValue;
    const endValue = clampedValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (endValue - startValue) * eased;
      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [clampedValue]);

  // Calculate needle angle
  const needleAngle = useMemo(() => {
    const ratio = animatedValue / MAX_AQI;
    return START_ANGLE + ratio * TOTAL_ANGLE;
  }, [animatedValue]);

  // SVG dimensions
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const arcWidth = 12;

  // Generate arc segments for each AQI range
  const arcSegments = useMemo(() => {
    return AQI_RANGES.map((range, index) => {
      const startRatio = range.min / MAX_AQI;
      const endRatio = range.max / MAX_AQI;
      const segmentStartAngle = START_ANGLE + startRatio * TOTAL_ANGLE;
      const segmentEndAngle = START_ANGLE + endRatio * TOTAL_ANGLE;
      
      return {
        path: describeArc(center, center, radius, segmentStartAngle, segmentEndAngle),
        color: range.color,
        label: range.label,
        key: `segment-${index}`,
      };
    });
  }, [center, radius]);

  // Needle path
  const needleLength = radius - 15;
  const needleEnd = polarToCartesian(center, center, needleLength, needleAngle);
  const needleBase1 = polarToCartesian(center, center, 8, needleAngle - 90);
  const needleBase2 = polarToCartesian(center, center, 8, needleAngle + 90);

  const currentColor = getColorForAQI(animatedValue);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        width={size}
        height={size * 0.7}
        viewBox={`0 0 ${size} ${size * 0.75}`}
        className="overflow-visible"
      >
        {/* Background arc (subtle) */}
        <path
          d={describeArc(center, center, radius, START_ANGLE, END_ANGLE)}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={arcWidth + 4}
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Colored arc segments */}
        {arcSegments.map((segment) => (
          <path
            key={segment.key}
            d={segment.path}
            fill="none"
            stroke={segment.color}
            strokeWidth={arcWidth}
            strokeLinecap="butt"
          />
        ))}

        {/* Tick marks */}
        {[0, 50, 100, 150, 200, 300, 500].map((tick) => {
          const ratio = tick / MAX_AQI;
          const angle = START_ANGLE + ratio * TOTAL_ANGLE;
          const innerPoint = polarToCartesian(center, center, radius - arcWidth / 2 - 4, angle);
          const outerPoint = polarToCartesian(center, center, radius + arcWidth / 2 + 4, angle);
          const labelPoint = polarToCartesian(center, center, radius + arcWidth / 2 + 16, angle);
          
          return (
            <g key={`tick-${tick}`}>
              <line
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke="hsl(var(--foreground))"
                strokeWidth={tick % 100 === 0 ? 2 : 1}
                opacity={0.4}
              />
              {tick % 100 === 0 && (
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] fill-muted-foreground font-medium"
                >
                  {tick}
                </text>
              )}
            </g>
          );
        })}

        {/* Needle shadow */}
        <polygon
          points={`${needleBase1.x},${needleBase1.y} ${needleEnd.x},${needleEnd.y} ${needleBase2.x},${needleBase2.y}`}
          fill="hsl(var(--foreground))"
          opacity={0.1}
          transform="translate(2, 2)"
        />

        {/* Needle */}
        <polygon
          points={`${needleBase1.x},${needleBase1.y} ${needleEnd.x},${needleEnd.y} ${needleBase2.x},${needleBase2.y}`}
          fill={currentColor}
          className="drop-shadow-md"
        />

        {/* Center circle */}
        <circle
          cx={center}
          cy={center}
          r={12}
          fill="hsl(var(--background))"
          stroke={currentColor}
          strokeWidth={3}
        />

        {/* Inner center dot */}
        <circle
          cx={center}
          cy={center}
          r={4}
          fill={currentColor}
        />

        {/* AQI Value in center area */}
        <text
          x={center}
          y={center + 40}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-3xl font-bold"
          fill={currentColor}
        >
          {Math.round(animatedValue)}
        </text>
      </svg>

      {/* Category label */}
      <div 
        className="mt-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-md"
        style={{ backgroundColor: currentColor }}
      >
        {category}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-1.5 text-[10px]">
        {AQI_RANGES.map((range) => (
          <div key={range.label} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: range.color }}
            />
            <span className="text-muted-foreground truncate">
              {range.min}-{range.max}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
