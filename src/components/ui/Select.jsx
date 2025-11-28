import { forwardRef } from 'react';

const Select = forwardRef(({ 
  label,
  error,
  help,
  options = [],
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  children,
  ...props 
}, ref) => {
  const selectClasses = [
    'form-select',
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
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && <div className="form-error">{error}</div>}
      {help && <div className="form-help">{help}</div>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;