const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*', // Allow all origins for dev
  }
});

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};


// When a client connects
io.on('connection', socket => {
  console.log(`New user connected: ${socket.id}`);

  // Join room
  socket.on('join', roomId => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Relay offer to the other peer
  socket.on('offer', ({ offer, roomId }) => {
    socket.to(roomId).emit('offer', { offer, senderId: socket.id });
  });

  // Relay answer to the offer sender
  socket.on('answer', ({ answer, roomId }) => {
    socket.to(roomId).emit('answer', { answer, senderId: socket.id });
  });

  // Relay ICE candidates
  socket.on('ice-candidate', ({ candidate, roomId }) => {
    socket.to(roomId).emit('ice-candidate', { candidate, senderId: socket.id });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    socket.broadcast.emit('user-left', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

