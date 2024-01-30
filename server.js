/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import data from "./data/data.js";
import express from "express";
// import { chats } from "./data/data.js";
import connectDB from "./config/db.js";
import colors from "colors";
import { Server, Socket } from "socket.io";
import userRoutes from "./routes/userRouter.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dotenv from "dotenv";
import { notFound } from "./middleware/errorMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
dotenv.config();
const app = express();
//"https://testcaseonly.onrender.com",
const corsOptions = {
  origin: ["https://testcaseonly.onrender.com", "http://localhost:5173"],
  // methods: ["POST", "PUT", "DELETE", "GET"],
  // credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
connectDB();

// chat - app routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 2000;
const server = app.listen(
  PORT,
  console.log(`Serever Started on PORT ${PORT}`.yellow.bold)
);
// origin: ["https://testcaseonly.onrender.com", "http://localhost:5173"],
const io = new Server(server, {
  cors: {
    origin: ["https://testcaseonly.onrender.com", "http://localhost:5173"],
  },
});


// io.on("connection", (socket) => {
//   console.log("Connected to socket.io");
// });
io.on("connection", (socket) => {
  console.log("Connected to Socket.IO");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
