import React from 'react';
import Link from 'next/link';

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
  showOrigin = true,
  asLink = true,
  theme = 'light',
}) => {
  const sizeClasses = {
    sm: {
      en: 'text-xl tracking-tight font-extrabold',
      kn: 'text-sm font-semibold ml-1.5',
      origin: 'text-[9px] tracking-widest',
      gap: 'gap-0.5',
    },
    md: {
      en: 'text-2xl sm:text-3xl tracking-tight font-extrabold',
      kn: 'text-base sm:text-lg font-semibold ml-2',
      origin: 'text-[10px] tracking-[0.2em]',
      gap: 'gap-0.5',
    },
    lg: {
      en: 'text-4xl sm:text-5xl tracking-tight font-black',
      kn: 'text-xl sm:text-2xl font-bold ml-2.5',
      origin: 'text-xs tracking-[0.25em]',
      gap: 'gap-1',
    },
  }[size];

  const content = (
    <div
      className={`inline-flex flex-col select-none group transition-opacity hover:opacity-90 ${sizeClasses.gap} ${className}`}
      aria-label="THINDI — ತಿಂಡಿ, Traditional Karnataka Foods from Hassan"
    >
      <div className="flex items-baseline leading-none">
        <span
          className={`font-display font-black tracking-[-0.03em] ${
            theme === 'dark' ? 'text-cream' : 'text-jaggery'
          } ${sizeClasses.en}`}
        >
          THINDI
        </span>
        <span
          className={`font-kannada opacity-95 transition-transform duration-300 group-hover:scale-105 ${
            theme === 'dark' ? 'text-turmeric' : 'text-chilli'
          } ${sizeClasses.kn}`}
          aria-hidden="true"
        >
          ತಿಂಡಿ
        </span>
      </div>
      {showOrigin && (
        <span
          className={`font-sans font-medium uppercase ${
            theme === 'dark' ? 'text-cream/60' : 'text-jaggery-muted/75'
          } ${sizeClasses.origin}`}
        >
          Hassan · Karnataka
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli rounded-sm">
        {content}
      </Link>
    );
  }

  return content;
};

