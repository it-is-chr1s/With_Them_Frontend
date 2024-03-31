import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  path: string;
  label: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({ path, label }) => {
  return (
    <Link to={path}>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-64">
        {label}
      </button>
    </Link>
  );
};

export default ButtonComponent;
