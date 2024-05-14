interface PopupProps {
	isOpen: boolean;
	children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, children }) => {
	return (
		<>
			{isOpen && (
				<div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
					<div className="fixed inset-0 bg-gray-500 opacity-75"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-md overflow-hidden shadow-xl">
						<div className="p-8 text-center">{children}</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Popup;
