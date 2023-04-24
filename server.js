const express = require('express');
const io = require('socket.io');
const Socket = require('./controllers/socket.controller');

const app = express();

app.use(express.static(__dirname))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(500).send('Internal Server Error')
})

const server = app.listen(3000, () => console.log(`Listening on http://localhost:${3000}`));
const ws = new io.Server(server);

// in socket.io the room is the same as the socket id

// ws.of('/').adapter.rooms stores total rooms in a server instance

// socket.nsp shows all namespaces, then .name is to show current socket namespace

// PRIVATE

ws.of('/private').on('connection', socket => {
    Socket.handlePrivate(ws, socket)
})

// MAIN

ws.on('connection', socket => {
    Socket.handleSocket(ws, socket)
});