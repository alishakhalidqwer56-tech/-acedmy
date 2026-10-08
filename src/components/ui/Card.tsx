import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassmorphism?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glassmorphism = false,
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseCard = glassmorphism 
    ? 'glass-card' 
    : 'surface-card';

  const hoverStyle = hoverable && !glassmorphism
    ? 'transition-all duration-200 hover:border-purple-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-950/20'
    : '';

  return (
    <div
      className={`rounded-2xl p-6 ${baseCard} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
