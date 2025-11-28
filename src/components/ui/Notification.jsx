import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Notification = ({ 
  type = 'info', 
  title, 
  message, 
  isVisible, 
  onClose, 
  autoClose = true, 
  duration = 4000,
  className = ''
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const typeClasses = {
    success: 'notification-success',
    error: 'notification-error',
    warning: 'notification-warning',
    info: 'notification-info'
  };

  useEffect(() => {
    if (isVisible && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className={`notification ${typeClasses[type]} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-sm">{title}</h4>
          )}
          {message && (
            <p className="text-sm mt-1 opacity-90">{message}</p>
          )}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;