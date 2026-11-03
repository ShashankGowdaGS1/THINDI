import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ThindiWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showOrigin?: boolean;
  asLink?: boolean;
  theme?: 'light' | 'dark';
}

export const ThindiWordmark: React.FC<ThindiWordmarkProps> = ({
  className = '',
  size = 'md',
  asLink = true,
  theme = 'light',
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-10 sm:h-12 lg:h-14 w-auto',
    lg: 'h-12 sm:h-16 lg:h-18 w-auto',
  }[size];

  const logoSrc = theme === 'dark' ? '/images/logo-dark.png' : '/images/logo.png';

  const content = (
    <div
      className={`inline-flex items-center select-none group transition-opacity hover:opacity-90 ${className}`}
      aria-label="THINDI — ತಿಂಡಿ, Authentic Karnataka Traditional Foods from Hassan"
    >
      {/* Official Brand Logo */}
      <Image
        src={logoSrc}
        alt="THINDI — ತಿಂಡಿ | Hassan, Karnataka"
        width={912}
        height={289}
        priority
        className={`object-contain transition-transform duration-200 group-hover:scale-[1.02] ${heightClasses}`}
      />
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli rounded-sm"
      >
        {content}
      </Link>
    );
  }

  return content;
};

