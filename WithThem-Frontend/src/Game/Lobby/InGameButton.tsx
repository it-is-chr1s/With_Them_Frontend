import React from "react";

interface ButtonProps {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; // Function to be called when the button is clicked
	label: string;
	active: boolean;
}

const InGameButton: React.FC<ButtonProps> = ({ onClick, label, active }) => {
	return (
		<button
			className={
				(active ? "opacity-60 hover:bg-gray-700" : "opacity-30") +
				" bg-gray-500 text-white font-bold rounded-full w-20 h-20 "
			}
			onClick={onClick}
			disabled={!active}
		>
			{label}
		</button>
	);
};

export default InGameButton;
