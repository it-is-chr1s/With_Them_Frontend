import { useEffect, useState } from "react";
import ButtonComponent from "../../../components/ButtonComponent";

interface Probs {
    type: string;
    progress: number;
    stompClient: React.MutableRefObject<Client | null>;
    lobbyId: string;
    name: string;
}

const FileUploadDownload : React.FC<Probs> = ({status, progress, stompClient, lobbyId, name}) => {
    const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

    useEffect(() => {
        setTaskCompleted(allFilesUploaded());

        const canvas = document.getElementById("progressBar") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        if(ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            

            drawRoundedRect(7, 7, canvas.width - 14, canvas.height - 14, 14, 2, "black", "#C0C0C0");

            
            drawProgress(progress);
            

            drawRoundedRect(0, 0, canvas.width, canvas.height, 20, 7, "#606060", "");
            drawRoundedRect(0, 0, canvas.width, canvas.height, 20, 2, "black", "");
            drawRoundedRect(7, 7, canvas.width - 14, canvas.height - 14, 14, 2, "black", "");

            function drawProgress(progressPercentage){
                const progressWidth = (canvas.width - 14) * progressPercentage;
                    const numSegments = Math.ceil(progressPercentage * 10);
                    const segmentWidth = progressWidth / numSegments;
                    for (let i = 0; i < numSegments; i++) {
                        let color;

                        if (i < 3) {
                            color = "#DD0000"; // Red
                        } else if (i < 6) {
                            color = "#FFA000"; // Orange
                        } else {
                            color = "#008000"; // Green
                        }

                        drawRect(8 + i * segmentWidth, 8, segmentWidth - 2, canvas.height - 16, color); // Green color for progress
                    }
            }

            function drawRect(x, y, width, height, color) {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, width, height);
            }
        
            function drawRoundedRect(x, y, width, height, radius, lineWidth, color, fillColor) {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color;
                ctx.fillStyle = fillColor;
                lineWidth = lineWidth / 2;
                ctx.beginPath();
                ctx.moveTo(x + radius + lineWidth, y + lineWidth);
                ctx.arcTo(x + width - lineWidth, y + lineWidth, x + width - lineWidth, y + height - lineWidth, radius);
                ctx.arcTo(x + width - lineWidth, y + height - lineWidth, x + lineWidth, y + height - lineWidth, radius);
                ctx.arcTo(x + lineWidth, y + height - lineWidth, x + lineWidth, y - lineWidth, radius);
                ctx.arcTo(x + lineWidth, y + lineWidth, x + width + lineWidth, y + lineWidth, radius);
                ctx.closePath();
                if(fillColor == "") {
                    ctx.stroke();
                }else{
                    ctx.stroke();
                    ctx.fill();
                }
            }
        }

        
    }, [progress]);

    function allFilesUploaded(){
        return status === "Upload" && progress >= 1.0
    }

    function downloadUpload(){
        stompClient.current?.publish({
            destination: "/app/tasks/playerAction",
            body: JSON.stringify({
                type: "incomingFileDownloadUpload",
                lobby: lobbyId,
                player: name,
                make: status,
                task: "FileDownloadUpload"}),
          });
    }

    return (
        <div>
            <canvas className="mb-8" height="120" id="progressBar" />
            <ButtonComponent label={status} onClick={() => {downloadUpload()}} />
            {taskCompleted && (
                <h3 className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-extrabold text-3xl -rotate-12 py-2 bg-red-300 shadow-lg shadow-red-500">Task Completed</h3>
            )}
        </div>
    )
}

export default FileUploadDownload;