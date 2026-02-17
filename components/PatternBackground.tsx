
import React from 'react';

const PatternBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-50 via-white to-yellow-50/50"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 pattern-bg opacity-60"></div>
      
      {/* Floating decorative shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-lime-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-200/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      {/* Dot pattern */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(circle, #84cc16 0.5px, transparent 0.5px)', 
        backgroundSize: '30px 30px' 
      }} />
    </div>
  );
};

export default PatternBackground;
