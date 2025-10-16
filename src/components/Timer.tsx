'use client';

import React from 'react';

interface TimerProps {
  timeRemaining: number;
  isRunning: boolean;
  totalTime?: number;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, isRunning, totalTime = 30 }) => {
  const percentage = (timeRemaining / totalTime) * 100;
  const isLowTime = timeRemaining <= 5;
  const isVeryLowTime = timeRemaining <= 3;

  const getTimerColor = () => {
    if (isVeryLowTime) return 'text-red-600';
    if (isLowTime) return 'text-orange-600';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (isVeryLowTime) return 'bg-red-500';
    if (isLowTime) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getBackgroundColor = () => {
    if (isVeryLowTime) return 'bg-red-50 border-red-200';
    if (isLowTime) return 'bg-orange-50 border-orange-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 ${getBackgroundColor()}`}>
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">⏱️</span>
          <h3 className="text-xl font-bold text-gray-800">Time Remaining</h3>
        </div>
        
        <div className={`text-4xl font-bold transition-all duration-300 ${getTimerColor()}`}>
          {timeRemaining}s
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="text-sm text-gray-600">
            {isRunning ? 'Timer Running' : 'Timer Stopped'}
          </span>
        </div>
        
        {/* Warning messages */}
        {isVeryLowTime && isRunning && (
          <div className="text-red-600 text-sm font-medium animate-pulse">
            ⚠️ Hurry up! Time is almost up!
          </div>
        )}
        {isLowTime && !isVeryLowTime && isRunning && (
          <div className="text-orange-600 text-sm font-medium">
            ⏰ Running out of time!
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
export { Timer };