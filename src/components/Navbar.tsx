'use client';

import React, { useState } from 'react';
import InstructionsModal from './InstructionsModal';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openInstructionsModal = () => {
    setIsInstructionsModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when opening modal
  };

  const closeInstructionsModal = () => {
    setIsInstructionsModalOpen(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <span className="mr-2">🏛️</span>
                  Aztec Word Cross
                </h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button className="text-white hover:bg-amber-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  New Game
                </button>
                <button 
                  onClick={openInstructionsModal}
                  className="text-white hover:bg-amber-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Instructions
                </button>
              </div>
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-white hover:bg-amber-700 p-2 rounded-md transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-amber-700 rounded-b-lg">
                <button className="text-white hover:bg-amber-800 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors">
                  New Game
                </button>
                <button 
                  onClick={openInstructionsModal}
                  className="text-white hover:bg-amber-800 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                >
                  Instructions
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Instructions Modal */}
      <InstructionsModal 
        isOpen={isInstructionsModalOpen} 
        onClose={closeInstructionsModal} 
      />
    </>
  );
};

export default Navbar;