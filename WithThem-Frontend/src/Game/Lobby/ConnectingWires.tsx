import ConnectingWiresButton from "./ConnectingWiresButton";
import React, { useEffect } from 'react';

const ConnectingWires: React.FC = () => {
    const colour = ['red', 'blue', 'green', 'orange'];
    const lines = [[0, 3], [1, 2], [2, 1], [3, 0]];
    const buttons = [[0, 3], [1, 2], [2, 1], [3, 0]];

    useEffect(() => {

        const canvas = document.getElementById('connectingWires') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.lineWidth = 10;

            const start_x = 0;
            const start_y = 10.5;
            const button_distance = 41.75;
            const offset = 50;
                       
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            lines.forEach((line) => {
                ctx.strokeStyle = colour[line[0]];
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
        <div className="flex h-72 w-96">
            <div id="leftButtons" className="flex flex-col justify-between absolute left-7">
                {
                    buttons.map((button) => (
                        <ConnectingWiresButton wire={colour[button[0]]}/>
                    ))
                }
            </div>
            <canvas id="connectingWires" className="z-0"></canvas>
            <div id="rightButtons" className="flex flex-col justify-between absolute right-7">
                {
                    buttons.map((button) => (
                        <ConnectingWiresButton wire={colour[button[1]]}/>
                    ))
                }
            </div>
        </div>
    );
};

export default ConnectingWires;