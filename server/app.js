import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// middleware for socket
const user = false;
io.use((socket, next) => {
  if (user) next();
});

io.on("connection", (socket) => {
  console.log(`socket connected: ${socket?.id}`);
  // // to that one socket only
  // socket.emit("welcome", `welcome bro, ${socket?.id}`);
  // // to all socket except that socket who triggered this event
  // socket.broadcast.emit(`${socket?.id} has joined the server`);

  socket.on("message", (data) => {
    console.log(data, "data");
    // // to entire application
    // io.emit("message-received", data);

    socket.to(data.receiverId).emit("message-received", data?.message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`user joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log(`disconnect, ${socket?.id}`);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
