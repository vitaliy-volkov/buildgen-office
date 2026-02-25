interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strength: number;
}

export function ConnectionLine({ x1, y1, x2, y2, strength }: ConnectionLineProps) {
  // Calculate a slight curve for a more organic feel
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Offset control point perpendicular to the line
  const offset = Math.min(dist * 0.2, 50);
  const cx = midX - (dy / dist) * offset;
  const cy = midY + (dx / dist) * offset;

  const pathData = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return (
    <g>
      {/* Background glow line */}
      <path
        d={pathData}
        fill="none"
        stroke="#60a5fa"
        strokeWidth={3}
        opacity={Math.max(0.05, strength * 0.2)}
        style={{ filter: "blur(2px)" }}
      />
      {/* Animated dashed line */}
      <path
        d={pathData}
        fill="none"
        stroke="#60a5fa"
        strokeWidth={1.5}
        strokeDasharray="8,6"
        opacity={Math.max(0.2, strength)}
        style={{
          animation: "dash-flow 1.5s linear infinite",
          filter: "drop-shadow(0 0 3px rgba(96, 165, 250, 0.8))",
        }}
      />
    </g>
  );
}
