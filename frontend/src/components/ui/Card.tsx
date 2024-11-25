// Before (Card.tsx)
import React from 'react';

// After
// No need to import React unless it is specifically used in the file
interface CardProps {
    children: React.ReactNode;
    className?: string;
  }
  
  const Card: React.FC<CardProps> = ({ children, className = "" }) => {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        {children}
      </div>
    );
  };
  
  export default Card;
  