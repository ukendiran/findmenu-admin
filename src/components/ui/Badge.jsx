import { forwardRef } from 'react';

const Badge = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'badge';
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    accent: 'badge-accent'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span ref={ref} className={classes} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;