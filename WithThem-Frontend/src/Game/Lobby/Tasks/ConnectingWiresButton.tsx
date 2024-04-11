interface Probs {
    wire: string;
    onClick: () => void;
    disabled: boolean;
}

const ConnectingWiresButton: React.FC<Probs> = ({wire, onClick, disabled}) => {
    return (
        <button onClick={onClick} style={{backgroundColor: wire}} className="z-50 w-10 h-10 rounded-full mb-10" disabled={disabled}></button>
    );
}

export default ConnectingWiresButton;