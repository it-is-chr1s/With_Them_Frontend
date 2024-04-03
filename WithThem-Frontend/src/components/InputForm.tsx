import React, { useState } from 'react';

interface InputFormProps {
  inputPlaceholder: string;
  buttonText: string;
  value: string; // Define the value prop
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Define the onChange prop with explicit typing
  onSubmit: (username: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ inputPlaceholder, buttonText, value, onChange, onSubmit }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full mb-4">
      <input
        type="text"
        placeholder={inputPlaceholder}
        value={value}
        onChange={onChange}
        className="rounded-l-lg py-2 px-4 w-64 border-t border-b border-l text-gray-800 border-gray-200 bg-white focus:outline-none focus:border-blue-500"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg ml-1">
        {buttonText}
      </button>
    </form>
  );
};

export default InputForm;
