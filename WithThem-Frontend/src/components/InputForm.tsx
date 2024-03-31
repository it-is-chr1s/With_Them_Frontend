// InputForm.tsx
import React, { useState } from 'react';

interface InputFormProps {
  inputPlaceholder: string;
  buttonText: string;
  onSubmit: () => void; // Function to handle form submission
}

const InputForm: React.FC<InputFormProps> = ({ inputPlaceholder, buttonText, onSubmit }) => {
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    onSubmit(); // Call the provided onSubmit function
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full mb-4">
      <input
        type="text"
        placeholder={inputPlaceholder}
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="rounded-l-lg py-2 px-4 w-64 border-t border-b border-l text-gray-800 border-gray-200 bg-white focus:outline-none focus:border-blue-500"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg ml-1">
        {buttonText}
      </button>
    </form>
  );
};

export default InputForm;
