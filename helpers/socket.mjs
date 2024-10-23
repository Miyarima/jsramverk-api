import { Server } from "socket.io";
import roomState from "./roomState.mjs";
import comments from "./comments.mjs";

const socketServer = (httpServer) => {
  let timeout;

  const io = new Server(httpServer, {
    cors: {
      // origin: ["http://localhost:3000", "https://www.student.bth.se/"],
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("create", async function (room) {
      socket.join(room);

      socket.currentRoom = room;
      console.log("Joined the room:", room);

      const docComments = await comments.getComments(socket.currentRoom);

      socket.emit("newComment", docComments);

      if (socket.rooms.has(room)) {
        const data = await roomState.getRoomState(room);
        if (data) {
          socket.emit("socketJoin", data);
        }
      }
    });

    socket.on("update", (data) => {
      socket.to(socket.currentRoom).emit("serverUpdate", data);

      clearTimeout(timeout);

      timeout = setTimeout(function () {
        roomState.updateRoomState(socket.currentRoom, data);
      }, 2000);
    });

    socket.on("comment", (data) => {
      comments.addComment(
        socket.currentRoom,
        data.comment,
        data.caretPosition.caret,
        data.caretPosition.line
      );

      socket.to(socket.currentRoom).emit("newComment", data);
    });

    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);
      const users = io.sockets.adapter.rooms.get(socket.currentRoom);
      if (users === undefined) {
        roomState.clearRoomState(socket.currentRoom);
      }
    });
  });
};

export default socketServer;
