import React from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'right',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-chilli active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs tracking-wider uppercase px-4 py-2 rounded-sm gap-1.5',
    md: 'text-sm sm:text-base px-6 py-3 rounded-sm gap-2',
    lg: 'text-base sm:text-lg px-8 py-3.5 rounded-sm gap-2.5 font-semibold',
  }[size];

  const variantStyles = {
    primary:
      'bg-chilli text-cream hover:bg-chilli-hover shadow-[0_2px_8px_rgba(164,61,46,0.18)] hover:shadow-[0_4px_16px_rgba(164,61,46,0.26)]',
    secondary:
      'bg-jaggery text-cream hover:bg-jaggery-dark shadow-[0_2px_8px_rgba(45,36,30,0.15)] hover:shadow-[0_4px_14px_rgba(45,36,30,0.22)]',
    outline:
      'bg-transparent text-jaggery border border-jaggery/25 hover:border-jaggery hover:bg-cream-dark/40',
    text:
      'bg-transparent text-jaggery hover:text-chilli underline-offset-4 hover:underline p-0 focus-visible:ring-0',
  }[variant];

  const fullClasses = twMerge(baseStyles, sizeStyles, variantStyles, className);

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0 text-current">{icon}</span>}
      <span className="text-current">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 text-current">
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`group ${fullClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <button className={`group ${fullClasses}`} {...props}>
      {content}
    </button>
  );
};

