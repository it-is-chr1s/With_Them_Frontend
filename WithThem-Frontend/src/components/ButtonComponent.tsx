import React from 'react';

interface ButtonProps {
  onClick:(event: React.MouseEvent<HTMLButtonElement>) => void; // Function to be called when the button is clicked
  label: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <button 
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-64"
      onClick={onClick} // Call the onClick function when the button is clicked
    >
      {label}
    </button>
  );
};

export default ButtonComponent;
