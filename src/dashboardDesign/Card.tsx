import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`p-4 bg-white rounded-md shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;
