import React, { useState, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";

interface ChatProps {
    inLobby:boolean;
    gameId: string;
    name: string;
}

interface Message {
    _gameId: string;
    _sender: string;
    _content: string;
}

const Chat: React.FC<ChatProps> = ({ inLobby, gameId, name }) => {
    const stompClientChat = useRef<Client | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    useEffect(() => {
        stompClientChat.current = new Client({
            brokerURL: "ws://localhost:4003/ws",
            onConnect: () => {
                console.log("Connected to chat websocket");
                if(inLobby){
                    // Call the backend endpoint to fetch chat messages
                    fetch(`http://localhost:4003/chat/messages/${gameId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch chat messages');
                        }
                        console.log(response);
                        return response.json();
                    })
                    .then(data => {
                        // Set the fetched messages to the state
                        setMessages(data);
                        // Scroll to the bottom of the container
                       // Scroll to the bottom of the container after state update
                        setTimeout(() => {
                            const messagesContainer = document.querySelector('.messages-container');
                            if (messagesContainer) {
                                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                            }
                        }, 0);
                    })
                    .catch(error => {
                        console.error("Error fetching chat messages:", error);
                    });
                }
                stompClientChat.current?.subscribe(
                    `/topic/chat/${gameId}/message`,
                    (message: IMessage) => {
                        console.log(JSON.parse(message.body));
                        const parsedMessage: Message = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                    }
                );
            },
            onDisconnect: () => {},
            onWebSocketError: (error: Event) => {
                console.error("Error with CHAT websocket", error);
            },
            onStompError: (frame: any) => {
                console.error(
                    "Broker reported error in CHAT: " +
                        frame.headers["message"]
                );
                console.error("Additional details: " + frame.body);
            },
        });

        stompClientChat.current.activate();

        return () => {
            stompClientChat.current?.deactivate();
        };
    }, [gameId]);

    const handleSendMessage = () => {
        if (stompClientChat.current && newMessage.trim() !== "") {
            const msg = {
                gameId:gameId,
                sender: name,
                content: newMessage,
            };
            stompClientChat.current.publish({
                destination: `/app/chat/message`,
                body: JSON.stringify(msg),                
            });
            setNewMessage("");
        }
    };
    useEffect(() => {
        // Scroll to the bottom of the container
        const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
        const isUserAtBottom = messagesContainer.scrollHeight - messagesContainer.clientHeight - messagesContainer.scrollTop <= 50;
        if (isUserAtBottom) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    }, [messages]);
    return (
        <div className="chat-container p-4 border rounded-lg">
        <h1 className="text-black text-3xl mb-4">Chat</h1>
        <div
            className="messages-container"
            style={{
                maxHeight: '160px',
                overflowY: 'scroll',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '4px',
            }}
        >
            {messages.map((msg, index) => (
                <div key={index} className="message mb-2">
                    <strong>{msg._sender}: </strong>{msg._content}
                </div>
            ))}
        </div>
        <div className="input-container mt-4 flex">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="rounded-l-lg py-2 px-4 w-full border-t border-b border-l text-gray-800 border-gray-200 bg-white focus:outline-none focus:border-blue-500"
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg ml-1"
                onClick={handleSendMessage}
            >
                Send
            </button>
        </div>
    </div>
    );
};

export default Chat;
