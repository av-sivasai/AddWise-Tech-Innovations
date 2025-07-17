import React from 'react';
import HomePage from '../components/HomePage';
import { useEffect } from 'react';

const Mainpage = () => {
  // Add floating animation for background elements
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(2deg); }
      }
      @keyframes float-reverse {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(20px) rotate(-2deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.3; }
      }
      @keyframes text-gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);

    // Add floating background elements
    const floatingElements = `
      <div class="fixed inset-0 flex justify-center items-center pointer-events-none z-0 overflow-hidden">
        <div class="absolute w-[800px] h-[800px] bg-gradient-to-tr from-purple-900/60 via-gray-800/60 to-blue-900/60 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute left-[15%] top-[15%] w-32 h-32 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-xl animate-float-slow"></div>
        <div class="absolute right-[15%] bottom-[15%] w-40 h-40 bg-gradient-to-br from-amber-600/20 to-pink-600/20 rounded-full blur-xl animate-float-reverse-slow"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', floatingElements);

    return () => {
      document.head.removeChild(style);
      const elements = document.querySelectorAll('.fixed.inset-0');
      elements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen overflow-hidden">
      <HomePage/>
    </div>
  );
};

export default Mainpage;