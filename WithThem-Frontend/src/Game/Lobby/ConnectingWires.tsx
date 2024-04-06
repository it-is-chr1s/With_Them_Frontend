import ConnectingWiresButton from "./ConnectingWiresButton";
import React, { useEffect } from 'react';

interface Probs{
    plugs: number[][];
    wires: number[][];
    stompClient: React.MutableRefObject<Client | null>;
    lobbyId: string;
    name: string;
}

const ConnectingWires: React.FC<Probs> = ({plugs, wires, stompClient, lobbyId, name}) => {
    const colour = ['red', 'blue', 'green', 'orange'];
    //const lines = [[0, 3], [1, 2], [2, 1], [3, 0]];
    //const buttons = [[0, 3], [1, 2], [2, 1], [3, 0]];

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
            wires.forEach(wire => {
                if(wire[1] != -1){
                    ctx.strokeStyle = colour[wire[1]];
                    ctx.beginPath();
                    ctx.moveTo(start_x, start_y + wire[1] * button_distance);
                    ctx.lineTo(start_x + offset, start_y + wire[1] * button_distance);
                    ctx.lineTo(canvas.width - offset, start_y + wire[0] * button_distance);
                    ctx.lineTo(canvas.width, start_y + wire[0] * button_distance);
                    ctx.stroke();
                }
            })
        }
    }, [wires]);
    
    let leftClick = -1
    const connectingWiresButtonClick = (plugId: number, side: string) => {
        if(side === 'left') {
            leftClick = plugId;
        }else if(leftClick != -1) {
            //setNewWire([leftClick, plugId])
            stompClient.current?.publish({
                destination: "/app/tasks/playerAction",
                body: JSON.stringify({
                    type: "incomingConnectingWires",
                    lobby: lobbyId,
                    player: name,
                    plug1: leftClick,
                    plug2: plugId,
                    task: "Connecting Wires"}),
              });
        }
    }

    let counter = 0;
    return (
        <div className="flex h-72 w-96">
            <div id="leftButtons" className="flex flex-col justify-between absolute left-7">
                {
                    plugs.map((plug, index) => (
                        <ConnectingWiresButton
                            onClick={() => {connectingWiresButtonClick(plug[0], "left")}}
                            wire={colour[plug[0]]}
                            key={index}
                        />
                    ))
                }
            </div>
            <canvas id="connectingWires" className="z-0"></canvas>
            <div id="rightButtons" className="flex flex-col justify-between absolute right-7">
                {
                    plugs.map((plug, index) => (
                        <ConnectingWiresButton
                            onClick={() => {connectingWiresButtonClick(plug[1], "right")}}
                            wire={colour[plug[1]]}
                            key={index}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default ConnectingWires;