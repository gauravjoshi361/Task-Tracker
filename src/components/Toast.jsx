import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all duration-300';
  const typeClasses = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const visibilityClasses = isLeaving ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0';

  return isVisible ? (
    <div className={`${baseClasses} ${typeClasses} ${visibilityClasses}`}>
      <div className="flex items-center text-white">
        {type === 'error' ? (
          <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  ) : null;
}