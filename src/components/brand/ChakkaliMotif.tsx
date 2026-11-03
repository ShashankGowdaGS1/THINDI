import React from 'react';

interface ChakkaliMotifProps {
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
}

/**
 * ChakkaliMotif
 * An authentic, restrained geometric interpretation of the spiral ridged form
 * of Hassan chakkali. Crafted with concentric ribbed contours and an open spiral core.
 */
export const ChakkaliMotif: React.FC<ChakkaliMotifProps> = ({
  className = '',
  size = 48,
  color = '#2D241E',
  accentColor = '#A43D2E',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer spiral ridge */}
      <path
        d="M50 8C73.196 8 92 26.804 92 50C92 73.196 73.196 92 50 92C26.804 92 8 73.196 8 50C8 31.5 20 15.5 37 10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1.5 4"
        opacity="0.45"
      />
      {/* Secondary spiral ring */}
      <path
        d="M49 16C67.778 16 83 31.222 83 50C83 68.778 67.778 84 49 84C30.222 84 15 68.778 15 50C15 35 24.5 22.5 38 18"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Mid spiral tier */}
      <path
        d="M50 24C64.359 24 76 35.641 76 50C76 64.359 64.359 76 50 76C35.641 76 24 64.359 24 50C24 38.5 31.5 29 42 25.5"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Inner ridged turn */}
      <path
        d="M50 33C59.389 33 67 40.611 67 50C67 59.389 59.389 67 50 67C40.611 67 33 59.389 33 50C33 42.5 38 36.5 45 34.2"
        stroke={accentColor}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Core spiral node */}
      <path
        d="M50 42C54.418 42 58 45.582 58 50C58 54.418 54.418 58 50 58C45.582 58 42 54.418 42 50C42 46.5 45 43.5 48.5 42.2"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Small central seed / crunch center */}
      <circle cx="50" cy="50" r="2.5" fill={accentColor} />
    </svg>
  );
};

