import ConnectingWiresButton from "./ConnectingWiresButton";
import React, { useEffect, useState } from 'react';

interface Probs{
    plugs: number[][];
    wires: boolean[];
    stompClient: React.MutableRefObject<Client | null>;
    lobbyId: string;
    name: string;
}

const ConnectingWires: React.FC<Probs> = ({plugs, wires, stompClient, lobbyId, name}) => {
    const colour = ['red', 'blue', 'green', 'orange'];
    const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

    useEffect(() => {
        setTaskCompleted(allWiresConnected());

        const canvas = document.getElementById('connectingWires') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.lineWidth = 10;

            const start_x = 0;
            const start_y = 10.5;
            const button_distance = 41.75;
            const offset = 50;
                       
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log("Plugs: " + plugs);
            plugs.forEach(plug => {
                if(wires[plug[0]]){
                    ctx.strokeStyle = colour[plug[1]];
                    ctx.beginPath();
                    ctx.moveTo(start_x, start_y + plug[1] * button_distance);
                    ctx.lineTo(start_x + offset, start_y + plug[1] * button_distance);
                    ctx.lineTo(canvas.width - offset, start_y + plug[0] * button_distance);
                    ctx.lineTo(canvas.width, start_y + plug[0] * button_distance);
                    ctx.stroke();
                }
            })
        }
    }, [wires]);

    const allWiresConnected = () => {
        for(const wire of wires) {
            if(!wire)
                return false;
        }

        return true;
    }
    
    let leftClick = -1
    const connectingWiresButtonClick = (plugId: number, side: string) => {
        if(side === 'left') {
            leftClick = plugId;
        }else if(leftClick != -1) {
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

    return (
        <div className="flex h-72 w-96">
            <div id="leftButtons" className="flex flex-col justify-between absolute left-7">
                {
                    plugs.map((plug, index) => (
                        <ConnectingWiresButton
                            onClick={() => {connectingWiresButtonClick(plug[0], "left")}}
                            wire={colour[plug[0]]}
                            disabled={taskCompleted}
                            key={index}
                        />
                    ))
                }
            </div>
            <canvas id="connectingWires" className="z-0"></canvas>
            {taskCompleted && (
                <h3 className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-extrabold text-3xl -rotate-12 py-2 bg-red-300 shadow-lg shadow-red-500">Task Completed</h3>
            )}
            <div id="rightButtons" className="flex flex-col justify-between absolute right-7">
                {
                    plugs.map((plug, index) => (
                        <ConnectingWiresButton
                            onClick={() => {connectingWiresButtonClick(plug[1], "right")}}
                            wire={colour[plug[1]]}
                            disabled={taskCompleted}
                            key={index}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default ConnectingWires;