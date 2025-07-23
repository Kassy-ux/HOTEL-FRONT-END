import React from 'react';
import classNames from 'classnames';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={classNames(
        "bg-white rounded-2xl shadow-md border border-gray-200 p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
