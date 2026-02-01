'use client';

import { ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
  as?: 'span' | 'div' | 'label';
}

// Component for visually hidden but screen-reader accessible content
export default function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
  return (
    <Component
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </Component>
  );
}
