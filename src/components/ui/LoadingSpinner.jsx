import { forwardRef } from 'react';

const LoadingSpinner = forwardRef(({ 
  size = 'md', 
  className = '',
  text,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinnerClasses = [
    'loading-spinner',
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  if (text) {
    return (
      <div ref={ref} className="flex flex-col items-center space-y-3" {...props}>
        <div className={spinnerClasses} />
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    );
  }

  return <div ref={ref} className={spinnerClasses} {...props} />;
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;