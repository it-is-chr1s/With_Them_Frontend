import React, { useState, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";

const WebSocketComponent: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [greetings, setGreetings] = useState<string[]>([]);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: "ws://localhost:4000/ws",
      onConnect: () => {
        setConnected(true);
        stompClient.current?.subscribe(
          "/topic/messages",
          (message: IMessage) => {
            const greeting: { content: string } = JSON.parse(message.body);
            setGreetings((prev) => [...prev, greeting.content]);
          }
        );
      },
      onWebSocketError: (error: Event) => {
        console.error("Error with websocket", error);
      },
      onStompError: (frame: any) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const sendName = () => {
    if (stompClient.current && name) {
      stompClient.current.publish({
        destination: "/app/message",
        body: JSON.stringify({ name }),
      });
    }
  };

  return (
    <div className="container">
      <div>
        {connected ? (
          <button
            onClick={() => {
              stompClient.current?.deactivate();
              setConnected(false);
            }}
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => {
              if (stompClient.current) {
                stompClient.current.activate();
                setConnected(true);
              }
            }}
          >
            Connect
          </button>
        )}
      </div>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name here..."
        />
        <button onClick={sendName}>Send</button>
      </div>
      <div>
        <h2>Greetings</h2>
        <ul>
          {greetings.map((greeting, index) => (
            <li key={index}>{greeting}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
