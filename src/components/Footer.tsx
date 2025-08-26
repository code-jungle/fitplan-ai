import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <p className="text-white/70 text-sm font-inter">
            © 2025 FitPlanAI powered by{' '}
            <span className="text-mint-400 font-semibold hover:text-mint-300 transition-colors duration-300">
              CodeJungle
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
