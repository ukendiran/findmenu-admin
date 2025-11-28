import { forwardRef } from 'react';

const Textarea = forwardRef(({ 
  label,
  error,
  help,
  className = '',
  containerClassName = '',
  rows = 3,
  ...props 
}, ref) => {
  const textareaClasses = [
    'form-textarea',
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
      <textarea
        ref={ref}
        className={textareaClasses}
        rows={rows}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {help && <div className="form-help">{help}</div>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;