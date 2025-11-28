import { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../ui/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((type, title, message, options = {}) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      type,
      title,
      message,
      ...options
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove after duration
    const duration = options.duration || 4000;
    if (options.autoClose !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback((title, message, options) => 
    showNotification('success', title, message, options), [showNotification]);
  
  const error = useCallback((title, message, options) => 
    showNotification('error', title, message, options), [showNotification]);
  
  const warning = useCallback((title, message, options) => 
    showNotification('warning', title, message, options), [showNotification]);
  
  const info = useCallback((title, message, options) => 
    showNotification('info', title, message, options), [showNotification]);

  const value = {
    showNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            isVisible={true}
            onClose={() => removeNotification(notification.id)}
            autoClose={false} // We handle auto-close in the provider
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};