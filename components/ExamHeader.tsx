
import React, { useEffect, useState } from 'react';
import { Icons } from '../constants';

interface ExamHeaderProps {
  studentName: string;
  studentClass: string;
  durationMinutes: number;
  startTime: number;
  onTimeUp: () => void;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({ studentName, studentClass, durationMinutes, startTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState<number>(durationMinutes * 60);

  useEffect(() => {
    const calculateTime = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remaining = (durationMinutes * 60) - elapsedSeconds;
      
      if (remaining <= 0) {
        setTimeLeft(0);
        onTimeUp();
      } else {
        setTimeLeft(remaining);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [startTime, durationMinutes, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 300; 

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-lime-100 sticky top-0 z-50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-tr from-lime-600 to-yellow-500 text-white p-2 rounded-xl shadow-lg shadow-lime-200">
            <span className="text-xl font-bold tracking-tighter">C</span>
          </div>
          <div>
            <h1 className="font-bold text-lime-900 leading-tight">CeinCBT</h1>
            <p className="text-xs text-lime-600 font-medium">MA Cendekia Nashiru Wasathiyyah</p>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className={`flex items-center space-x-3 px-4 py-2 rounded-2xl transition-all duration-300 ${
            isLowTime ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-lime-50 text-lime-700'
          }`}>
            <Icons.Clock />
            <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-3 text-right">
            <div>
              <p className="text-sm font-semibold text-gray-900">{studentName}</p>
              <p className="text-xs text-lime-500 uppercase tracking-wider font-bold">Kelas {studentClass}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-lime-500 to-yellow-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-lime-600 font-bold text-sm">
                  {studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;
