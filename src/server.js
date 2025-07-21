// src/server.js
require('dotenv').config();
const http = require('http');
const app = require('./app');
const { setupSocket } = require('./socket/signaling');
const mongoose = require('mongoose');

const server = http.createServer(app);

// 🧠 Setup Socket.IO
setupSocket(server);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB Error:', err));
