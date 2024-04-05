import ConnectingWires from "./ConnectingWires";

interface Probs {
    visible: boolean;
    task: string;
}

const TaskPopup: React.FC<Probs> = ({visible, task}) => {
    return (
        <>
            {visible && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
                    <div className="p-4 bg-gray-100 border-4 rounded-2xl">
                        <h2 className="text-center font-mono font-bold text-lg">{task}</h2>
                        <ConnectingWires />
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskPopup;