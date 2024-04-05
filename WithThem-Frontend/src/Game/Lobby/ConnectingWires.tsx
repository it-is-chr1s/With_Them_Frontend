import ConnectingWiresButton from "./ConnectingWiresButton";
import React, { useEffect } from 'react';

const ConnectingWires: React.FC = () => {
    useEffect(() => {
        const lines = [[0, 3], [1, 2], [2, 1], [3, 0]];

        const canvas = document.getElementById('connectingWires') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 10;

            const start_x = 0;
            const start_y = 10;
            const button_distance = 37.25;
            const offset = 30;

            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            lines.forEach((line) => {
                ctx.beginPath();
                ctx.moveTo(start_x, start_y + line[0] * button_distance);
                ctx.lineTo(start_x + offset, start_y + line[0] * button_distance);
                ctx.lineTo(canvas.width - offset, start_y + line[1] * button_distance);
                ctx.lineTo(canvas.width, start_y + line[1] * button_distance);
                ctx.stroke();
            })
        }
    }, []);

    return (
        <div className="flex">
            <div className="flex flex-col justify-between">
                <ConnectingWiresButton wire={0} />
                <ConnectingWiresButton wire={1} />
                <ConnectingWiresButton wire={2} />
                <ConnectingWiresButton wire={3} />
            </div>
            <canvas id="connectingWires"></canvas>
            <div className="flex flex-col justify-between">
                <ConnectingWiresButton wire={0} />
                <ConnectingWiresButton wire={1} />
                <ConnectingWiresButton wire={2} />
                <ConnectingWiresButton wire={3} />
            </div>
        </div>
    );
};

export default ConnectingWires;