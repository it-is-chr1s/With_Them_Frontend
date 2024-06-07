import React from "react";

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  active: boolean;
}

const InGameButton: React.FC<ButtonProps> = ({ onClick, label, active }) => {
  return (
    <button
      className={
        (active ? "opacity-60 hover:bg-blue-300" : "opacity-30") +
        " bg-blue-400 text-white font-bold rounded-full w-20 h-20"
      }
      onClick={onClick}
      disabled={!active}
    >
      <p className="text-white">{label}</p>
    </button>
  );
};

export default InGameButton;
