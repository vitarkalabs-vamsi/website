import React from "react";
import { COLORS } from "./constants";

export const VitarkaMark: React.FC<{ size?: number; color?: string }> = ({
  size = 80,
  color = COLORS.ink,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="0.5" y="0.5" width="39" height="39" stroke={color} strokeWidth="1" />
    <path
      d="M8 8 L20 28 L32 8"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="miter"
    />
    <circle cx="20" cy="20" r="2" fill={color} />
    <line x1="20" y1="2"  x2="20" y2="6"  stroke={color} strokeWidth="1" />
    <line x1="20" y1="34" x2="20" y2="38" stroke={color} strokeWidth="1" />
    <line x1="2"  y1="20" x2="6"  y2="20" stroke={color} strokeWidth="1" />
    <line x1="34" y1="20" x2="38" y2="20" stroke={color} strokeWidth="1" />
  </svg>
);
