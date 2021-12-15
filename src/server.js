const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const socketio = require("socket.io");
const publicDir = path.join(__dirname, "../public");
const Filter = require("bad-words");
const server = http.createServer(app);

const io = socketio(server);
const port = 3000;
app.use(express.static(publicDir));

let count = 0;

// io.on("connection", function (socket) {
//   console.log("new Socket connected");
//   socket.emit("countUpdated", count);
//   socket.on("increment", () => {
//     count++;
//     //socket.emit("countUpdated", count); //will emit the event for sinlge connection
//     io.emit("countUpdated", count); //emit to everysingle connection
//   });
// });
// io.on("connection", (socket) => {
//   console.log("new client connected");
//   socket.emit("message", "welcome");
// });
// app.post("/chat", (req, res) => {
//   io.on("connection", (socket) => {
//     io.on("sendMessage", (message) => {
//       res.json({
//         data: message,
//       });
//     });
//   });
// });

io.on("connection", (socket) => {
  console.log("new webSocket connected");
  socket.emit("message", "welcome!");
  socket.broadcast.emit("message", " A new user has joined!");
  socket.on("sendMessage", (message, acknowlegEventCallback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return acknowlegEventCallback("Profanity is not allowed!");
    }
    io.emit("message", message);
    acknowlegEventCallback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "a user has left!");
  });

  socket.on("sendLocation", (lat, long, acknowlegEventCallback) => {
    io.emit("message", `https://www.google.com/maps?q=${lat},${long}`);
    acknowlegEventCallback("location shared successfully!");
  });
});

server.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});
