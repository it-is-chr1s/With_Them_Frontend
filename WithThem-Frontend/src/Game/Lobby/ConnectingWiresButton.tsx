interface Probs {
    wire: number;
}

const ConnectingWiresButton: React.FC<Probs> = ({wire}) => {
    const colour = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
    return (
        <button className={"z-50 w-10 h-10 rounded-full mb-10 " + colour[wire]}></button>
    );
}

export default ConnectingWiresButton;