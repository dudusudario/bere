
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator my-2">
      <div className="typing-dot" style={{ animationDelay: "0s" }} />
      <div className="typing-dot" style={{ animationDelay: "0.2s" }} />
      <div className="typing-dot" style={{ animationDelay: "0.4s" }} />
    </div>
  );
};

export default TypingIndicator;
