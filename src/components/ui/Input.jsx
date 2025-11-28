import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  help,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const inputClasses = [
    'form-input',
    icon && iconPosition === 'left' ? 'pl-10' : '',
    icon && iconPosition === 'right' ? 'pr-10' : '',
    error ? 'error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`form-group ${containerClassName}`}>
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && <div className="form-error">{error}</div>}
      {help && <div className="form-help">{help}</div>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;