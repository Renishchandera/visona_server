// src/socket/signaling.js
function setupSocket(server) {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('🟢 New socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected:', socket.id);
    });

    // Add your socket listeners here
    socket.on('message', (data) => {
      console.log('📨 Message received:', data);
      socket.broadcast.emit('message', data);
    });
  });
}

module.exports = { setupSocket };
