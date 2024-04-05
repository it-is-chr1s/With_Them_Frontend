import ConnectingWiresButton from "./ConnectingWiresButton";

const ConnectingWires: React.FC = () => {
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