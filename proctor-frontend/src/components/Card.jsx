import React from 'react';

const Card = ({ children, className = '', elevated = false }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 ${
        elevated ? 'card-shadow-lg' : 'card-shadow'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
