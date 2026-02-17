
import React from 'react';
import { Question, UserAnswer } from '../types';

interface SidebarNavigationProps {
  questions: Question[];
  currentIdx: number;
  answers: UserAnswer[];
  onSelect: (index: number) => void;
  onSubmit: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  questions, 
  currentIdx, 
  answers, 
  onSelect,
  onSubmit
}) => {
  const isAnswered = (questionId: string) => answers.some(a => a.questionId === questionId);

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-lime-100 p-6 shadow-xl shadow-lime-100/50 flex flex-col h-full sticky top-28">
        <h3 className="text-lg font-bold text-lime-900 mb-6 flex items-center">
          <span className="w-2 h-2 bg-lime-500 rounded-full mr-2"></span>
          Question Navigator
        </h3>
        
        <div className="grid grid-cols-5 gap-3 overflow-y-auto max-h-[400px] pr-2 mb-8">
          {questions.map((q, idx) => {
            const answered = isAnswered(q.id);
            const active = idx === currentIdx;
            
            return (
              <button
                key={q.id}
                onClick={() => onSelect(idx)}
                className={`
                  w-full aspect-square rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center
                  ${active 
                    ? 'bg-lime-600 text-white shadow-lg shadow-lime-200 ring-2 ring-lime-300 ring-offset-2 scale-110 z-10' 
                    : answered 
                      ? 'bg-lime-100 text-lime-700 border border-lime-200' 
                      : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-lime-50 hover:text-lime-500'}
                `}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="space-y-4 mt-auto">
          <div className="flex justify-between items-center p-3 rounded-2xl bg-lime-50 border border-lime-100/50">
            <span className="text-xs font-semibold text-lime-500 uppercase tracking-widest">Progress</span>
            <span className="text-lg font-bold text-lime-700">
              {answers.length} <span className="text-lime-300">/</span> {questions.length}
            </span>
          </div>
          
          <button
            onClick={onSubmit}
            className="w-full bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-700 hover:to-lime-800 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-lime-200 transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Finish Examination</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNavigation;
