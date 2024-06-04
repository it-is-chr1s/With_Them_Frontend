// ChooseColorPopup.tsx
import React, { useState } from 'react';
import Popup from './Popup';

interface ChooseColorPopupProps {
    isOpen: boolean;
    occupied: string[] | null;
    onClose: () => void;
    onColorSelect: (color: string) => void;
}

const ChooseColorPopup: React.FC<ChooseColorPopupProps> = ({ isOpen, onClose, onColorSelect, occupied }) => {
    const colors = ['#ff0000', '#994C00', '#ff8000', '#ffff00', '#80ff00', '#1FA61A', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff0080', '#ff8080'];
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const handleColorClick = (color: string) => {
        if (occupied && occupied.includes(color)) return; // Prevent selecting an occupied color

        setSelectedColor(color);
        onColorSelect(color);
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
                        style={{ backgroundColor: (occupied && occupied.includes(color)) ? 'black' : color }}
                        onClick={() => handleColorClick(color)}
                    ></div>
                ))}
            </div>
        </Popup>
    );
};

export default ChooseColorPopup;
