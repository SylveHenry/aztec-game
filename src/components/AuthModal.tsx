'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/game';
import { authenticateUser } from '@/utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticate }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = useCallback(() => {
    setUsername('');
    setPin('');
    setError('');
    setIsLoading(false);
    onClose();
  }, [onClose]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (username.length < 4 || username.length > 10) {
      setError('Username must be 4-10 characters');
      setIsLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setError('PIN must be exactly 6 digits');
      setIsLoading(false);
      return;
    }

    try {
      // First try to login
      let result = await authenticateUser(username, pin, 'login');
      
      // If login fails with invalid credentials, try to register
      if (result.error === 'Invalid username or PIN') {
        result = await authenticateUser(username, pin, 'register');
      }
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        onAuthenticate(result.user);
        handleClose();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    setUsername(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto transform transition-all">
        {/* Header */}
        <div className="text-center pt-8 pb-2 px-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏛️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Welcome to Aztec Word Hunt
          </h2>
          <p className="text-sm text-gray-500">
            Enter your username and PIN to play
          </p>
        </div>
        
        {/* Content */}
        <div className="px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Username"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-gray-400"
                required
                disabled={isLoading}
                autoComplete="username"
              />
              <div className="text-xs text-gray-400 mt-1 px-1">
                {username.length}/10 characters
              </div>
            </div>

            <div>
              <input
                type="password"
                value={pin}
                onChange={handlePinChange}
                placeholder="6-digit PIN"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-center text-lg tracking-widest placeholder-gray-400"
                required
                disabled={isLoading}
                maxLength={6}
                autoComplete="current-password"
              />
              <div className="text-xs text-gray-400 mt-1 px-1">
                {pin.length}/6 digits
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || username.length < 4 || pin.length !== 6}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entering...
                </span>
              ) : (
                'Enter'
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              New users will be automatically registered
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;