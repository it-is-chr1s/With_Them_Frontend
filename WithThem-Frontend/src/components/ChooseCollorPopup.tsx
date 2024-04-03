// ChooseColorPopup.tsx
import React, { useState } from 'react';
import Popup from './Popup';

interface ChooseColorPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onColorSelect: (color: string) => void; // New prop to pass selected color
}

const ChooseColorPopup: React.FC<ChooseColorPopupProps> = ({ isOpen, onClose, onColorSelect }) => {
    const colors = ['#ff0000', '#994C00', '#ff8000', '#ffff00', '#80ff00', '#1FA61A', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff0080', '#ff8080'];
    const [selectedColor, setSelectedColor] = useState<string>('gray');

    const handleColorClick = (color: string) => {
        setSelectedColor(color);
        onColorSelect(color); // Pass selected color to parent component
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Popup isOpen={isOpen} onClose={handleClose}>
            <h1 className="text-black text-3xl mb-8">Choose Color</h1>
            <div className="flex justify-center flex-wrap gap-4">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        className="w-12 h-12 rounded-full cursor-pointer"
                        style={{ backgroundColor: selectedColor === color ? 'gray' : color }}
                        onClick={() => handleColorClick(color)}
                    ></div>
                ))}
            </div>
        </Popup>
    );
};

export default ChooseColorPopup;