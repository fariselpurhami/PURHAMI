// packages/design-system/src/primitives/Typography.tsx

import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: 'display-1' | 'display-2' | 'heading-1' | 'heading-2' | 'body-large' | 'body-base' | 'caption';
  color?: 'obsidian' | 'oxblood' | 'porcelain';
}

export function Typography({
  as: Component = 'span',
  variant = 'body-base',
  color = 'obsidian',
  className,
  children,
  ...props
}: TypographyProps) {
  const baseStyles = 'antialiased transition-colors duration-200';
  
  const variants = {
    'display-1': 'font-serif text-display-1',
    'display-2': 'font-serif text-display-2',
    'heading-1': 'font-serif text-heading-1',
    'heading-2': 'font-serif text-heading-2',
    'body-large': 'font-sans text-body-large',
    'body-base': 'font-sans text-body-base',
    'caption': 'font-sans text-caption uppercase tracking-wider',
  };

  const colors = {
    obsidian: 'text-obsidian',
    oxblood: 'text-oxblood',
    porcelain: 'text-porcelain',
  };

  return (
    <Component
      className={cn(baseStyles, variants[variant], colors[color], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
