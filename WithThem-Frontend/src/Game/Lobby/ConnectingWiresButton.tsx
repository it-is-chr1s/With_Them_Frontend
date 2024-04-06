interface Probs {
    wire: string;
    onClick: () => void;
}

const ConnectingWiresButton: React.FC<Probs> = ({wire, onClick}) => {
    return (
        <button onClick={onClick} style={{backgroundColor: wire}} className="z-50 w-10 h-10 rounded-full mb-10"></button>
    );
}

export default ConnectingWiresButton;