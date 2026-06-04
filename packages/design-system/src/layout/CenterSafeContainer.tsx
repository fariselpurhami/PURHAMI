// packages/design-system/src/layout/CenterSafeContainer.tsx

import * as React from 'react';
import { cn } from '../primitives/Typography'; // Reusing cn utility

interface CenterSafeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function CenterSafeContainer({
  as: Component = 'div',
  className,
  children,
  ...props
}: CenterSafeContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full max-w-[1440px] px-sm md:px-lg lg:px-2xl', className)}
      {...props}
    >
      {children}
    </Component>
  );
}
