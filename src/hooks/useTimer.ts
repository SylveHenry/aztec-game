'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState } from '@/types/game';

export const useTimer = (initialTime: number = 180) => {
  const [timerState, setTimerState] = useState<TimerState>({
    timeRemaining: initialTime,
    isRunning: false
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef<(() => void) | null>(null);

  // Start the timer
  const startTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: true
    }));
  }, []);

  // Stop the timer
  const stopTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false
    }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset the timer
  const resetTimer = useCallback((newTime?: number) => {
    stopTimer();
    setTimerState({
      timeRemaining: newTime ?? initialTime,
      isRunning: false
    });
  }, [initialTime, stopTimer]);

  // Set callback for when timer reaches zero
  const setOnTimeUp = useCallback((callback: () => void) => {
    onTimeUpRef.current = callback;
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerState.isRunning && timerState.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          const newTime = prev.timeRemaining - 1;
          
          // If time is up, call the callback and stop the timer
          if (newTime <= 0) {
            if (onTimeUpRef.current) {
              onTimeUpRef.current();
            }
            return {
              timeRemaining: 0,
              isRunning: false
            };
          }
          
          return {
            ...prev,
            timeRemaining: newTime
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.timeRemaining]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeRemaining: timerState.timeRemaining,
    isRunning: timerState.isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    setOnTimeUp
  };
};