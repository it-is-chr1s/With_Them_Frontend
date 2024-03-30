import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

// Define a type for the stomp client
type StompClientType = Stomp.Client | null;

function WebSocketClient() {
  const [stompClient, setStompClient] = useState<StompClientType>(null);
  const [message, setMessage] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:4000/ws"); // Adjust this URL to match your WebSocket endpoint
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);

      stompClient.subscribe("/topic/messages", function (messageOutput) {
        setReceivedMessages((prev) => [...prev, messageOutput.body]);
      });
    });

    setStompClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && message) {
      stompClient.send("/app/message", {}, message);
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <>
      <div className="message-input">
        <input
          type="text"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className="message-list">
        {receivedMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </>
  );
}

export default WebSocketClient;
