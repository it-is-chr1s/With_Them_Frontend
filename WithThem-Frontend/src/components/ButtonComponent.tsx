import React from "react";

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-64"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ButtonComponent;
