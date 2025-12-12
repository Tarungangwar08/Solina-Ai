import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = '', showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9B7EBD" />
            <stop offset="40%" stopColor="#B794D4" />
            <stop offset="100%" stopColor="#F5D061" />
          </linearGradient>
        </defs>
        {/* Outer circle */}
        <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
        {/* S-shaped yin-yang style design */}
        <path
          d="M50 8 
             C25 8 8 28 8 50 
             C8 72 25 92 50 92
             C60 92 68 85 68 75
             C68 65 58 60 50 60
             C35 60 25 70 25 50
             C25 30 40 20 50 20
             C60 20 68 28 68 38
             C68 48 58 50 50 50
             C30 50 8 35 8 50"
          fill="none"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Inner curve accent */}
        <ellipse cx="38" cy="35" rx="8" ry="8" fill="white" opacity="0.3" />
        <ellipse cx="62" cy="65" rx="8" ry="8" fill="white" opacity="0.3" />
      </svg>
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
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradientIcon" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9B7EBD" />
          <stop offset="40%" stopColor="#B794D4" />
          <stop offset="100%" stopColor="#F5D061" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#logoGradientIcon)" />
      <path
        d="M50 8 
           C25 8 8 28 8 50 
           C8 72 25 92 50 92
           C60 92 68 85 68 75
           C68 65 58 60 50 60
           C35 60 25 70 25 50
           C25 30 40 20 50 20
           C60 20 68 28 68 38
           C68 48 58 50 50 50
           C30 50 8 35 8 50"
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <ellipse cx="38" cy="35" rx="8" ry="8" fill="white" opacity="0.3" />
      <ellipse cx="62" cy="65" rx="8" ry="8" fill="white" opacity="0.3" />
    </svg>
  );
};

export default Logo;
