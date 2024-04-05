interface Probs {
    wire: string;
}

const ConnectingWiresButton: React.FC<Probs> = ({wire}) => {
    return (
        <button style={{backgroundColor: wire}} className="z-50 w-10 h-10 rounded-full mb-10"></button>
    );
}

export default ConnectingWiresButton;