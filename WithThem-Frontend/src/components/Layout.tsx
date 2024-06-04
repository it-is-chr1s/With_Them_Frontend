import React, { ReactNode } from "react";
import SpaceVideo from "../assets/blue_spcae.mp4";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center relative">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src={SpaceVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="flex flex-col items-center justify-center h-full text-center z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
