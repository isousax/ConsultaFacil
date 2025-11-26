import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';

export interface AlertProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  className?: string;
}

export const Alert = ({
  type = 'info',
  message,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  className: customClassName,
}: AlertProps) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      className: 'bg-green-50 text-green-800 border-green-200',
    },
    error: {
      icon: AlertCircle,
      className: 'bg-red-50 text-red-800 border-red-200',
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    warning: {
      icon: AlertCircle,
      className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    },
  };

  const { icon: Icon, className } = config[type];

  return (
    <div
      className={clsx(
        'flex items-start gap-3 rounded-lg border p-4',
        className,
        customClassName
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 rounded-md p-1 hover:bg-black/5"
          aria-label="Fechar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
