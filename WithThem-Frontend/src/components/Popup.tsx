import React, { useEffect } from "react";

interface PopupProps {
	isOpen: boolean;
	onClose: (() => void) | null;
	children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
	return (
		<>
			{isOpen && (
				<div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
					<div className="fixed inset-0 bg-gray-500 opacity-75"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-md overflow-hidden shadow-xl">
						<div className="p-8 text-center">{children}</div>
						{onClose ? (
							<button
								onClick={onClose}
								type="button"
								className="block w-full py-2 bg-indigo-600 text-white font-bold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Close
							</button>
						) : null}
					</div>
				</div>
			)}
		</>
	);
};

export default Popup;
