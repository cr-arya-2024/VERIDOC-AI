
import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', icon }) => {
  return (
    <div className={`bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="text-indigo-400">{icon}</div>}
          <div>
            {title && <h3 className="text-lg font-semibold text-white leading-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
