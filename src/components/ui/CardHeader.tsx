import React from 'react';

interface CardHeaderProps {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return (
    <div className="mb-4 border-b pb-2">
      {children}
    </div>
  );
};
