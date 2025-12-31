import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = '', showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/logo.png" 
        alt="Solina AI Logo"
        width={size}
        height={size}
        className="object-contain"
      />
      {showText && (
        <span className="text-xl font-semibold tracking-wider text-gray-600">
          SOLINA AI
        </span>
      )}
    </div>
  );
};

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => {
  return (
    <img 
      src="/logo.png" 
      alt="Solina AI"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
};

export default Logo;
