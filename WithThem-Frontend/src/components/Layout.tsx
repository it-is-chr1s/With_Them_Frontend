import React, { ReactNode } from 'react';
import SpaceBackground from '../assets/SpaceBackground.jpg';

interface LayoutProps {
  children: ReactNode; // Define children prop as ReactNode type
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${SpaceBackground})` }}>
              <div className="flex flex-col items-center justify-center h-full text-center">

      {children}
      </div>
    </div>
  );
};

export default Layout;
