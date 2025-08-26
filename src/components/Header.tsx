import React from 'react';
import LogoClean from './LogoClean';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <LogoClean size="md" />
        </div>
      </div>
    </header>
  );
};

export default Header;
