import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  path: string;
  label: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({ path, label }) => {
  return (
    <Link to={path}>
      <button style={{ marginRight: '10px' }}>{label}</button>
    </Link>
  );
};

export default ButtonComponent;
