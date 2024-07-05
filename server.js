const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files from the 'public' directory

io.on('connection', (socket) => {
    socket.on('newuser', (username) => {
        socket.username = username;
        io.emit('update', `${username} joined the chat`);
    });

    socket.on('chat', (data) => {
        console.log('Received chat data:', data); // Debug log
        io.emit('chat', data);
    });

    socket.on('exituser', (username) => {
        io.emit('update', `${username} left the chat`);
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('update', `${socket.username} left the chat`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
