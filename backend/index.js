const express = require('express');
require('dotenv').config();
require('./config/db');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const routes = require('./routes/index')
const path = require('path')

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/public', express.static(path.join(__dirname, 'public')));

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Client URL
        methods: ["GET", "POST"]
    }
})

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (token === null) {
        return console.log('Authentication error: Token is missing');
    } else {
        next();
    }
});


const userSockets = {};
const activeUsers = new Set();

io.on('connection', (socket) => {
    console.log('User connected')

    // Basic
    // socket.emit('welcome', `welcome to the server ${socket.id}`)
    // socket.broadcast.emit('welcome', `${socket.id} joined the server.`)

    // Group Chat
    socket.on('join_room', async (room) => {
        socket.join(room)
    });

    socket.on('send_group_message', async (data) => {
        io.to(data.room).emit('receive_group_message', data); // Ensure all clients in the room get the message
    });

    // Personal Chat
    socket.on('register_user', (userId) => {
        userSockets[userId] = socket.id;
        activeUsers.add(userId); // Add user to active list
        io.emit('update_active_users', Array.from(activeUsers)); // Notify all clients
    });

    socket.on('typing', (receiver) => {
        io.to(userSockets[receiver]).emit('typing', `Typing...`)
    })

    socket.on('stop_typing', (receiver) => {
        io.to(userSockets[receiver]).emit('typing', ``)
    })

    socket.on("send_message", (data) => {
        const { receiver } = data;
        const receiverSocketId = userSockets[receiver];
        io.to(receiverSocketId).emit('receive', data);
        // io.to(receiverSocketId).emit('new_message_notification', {
        //     sender: data.senderName,
        //     message: data.text
        // })
    })

    socket.on("disconnect", () => {
        console.log('User disconnected');
        const userId = Object.keys(userSockets).find(key => userSockets[key] === socket.id);

        if (userId) {
            delete userSockets[userId];
            activeUsers.delete(userId); // Remove user from active list
            io.emit('update_active_users', Array.from(activeUsers)); // Notify all clients
        }
    });

})

server.listen(5000, () => {
    console.log('listening on *:5000');
});