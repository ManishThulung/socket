import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>();
  const [id, setId] = useState<string | undefined>();
  const [messages, setMessages] = useState<string[]>([]);
  const [room, setRoom] = useState<string>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("message", { message, receiverId });
    setMessage("");
  };

  const handleRoomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("join-room", room);
    setRoom("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setId(socket?.id);
      console.log(socket?.id, "connected");
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    socket.on("message-received", (msg) => {
      setMessages((prevData) => [...prevData, msg]);
      console.log(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <div>Welcome to Socket.io</div>
      <p>ID: {id}</p>

      <form onSubmit={handleRoomSubmit}>
        <input
          placeholder="Join Room"
          onChange={(e) => setRoom(e.target.value)}
          value={room}
        />

        <button type="submit">Join Room</button>
      </form>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter a message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <input
          placeholder="Enter an IDx"
          onChange={(e) => setReceiverId(e.target.value)}
          value={receiverId}
        />
        <button type="submit">Submit</button>
      </form>

      <>
        <p>Received Messages</p>
        {messages?.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </>
    </>
  );
};

export default App;
