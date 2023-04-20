const express = require('express');
const io = require('socket.io');
const app = express();

app.use(express.static(__dirname))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

const server = app.listen(3000, () => console.log(`Listening on http://localhost:${3000}`));
const ws = new io.Server(server);

// in socket.io the room is the same as the socket id

// ws.of('/').adapter.rooms stores total rooms in a server instance

// socket.nsp shows all namespaces, then .name is to show current socket namespace

function checkRoom(room) {
    const rooms = ws.of('/group').adapter.rooms;
    let exist = false;

    rooms.forEach((value, key, map) => {
        console.log(key, room);
        if(key == room) exist = true;
    })

    return exist;
}

ws.of('/group').adapter.on('create-room', room => {
    console.log(room, "Was created");
})

ws.of('/group').on('connection', socket => {
    socket.on('create-room', room => {
        socket.leave(socket.id);
        
        socket.join(room);

        console.log(`${socket.handshake.auth.name} has joined ${room} room`);
        
        ws.emit('created-room', room);
    })

    socket.on('join-room', room => {
        if(!checkRoom(room)) {
            socket.emit('room-error', "room not available");
        }
        else {
            socket.leave(socket.id);
        
            socket.join(room);
        
            console.log(`${socket.handshake.auth.name} has joined ${room} room`);
        }
    })

    socket.on('send-message', message => {
        Array.from(socket.rooms)
        .filter(id => id != socket.id)
        .forEach(room => {
            ws.of('/group').in(room).emit('send-message', message);
            // socket.emit('send-message', message)
            // socket.broadcast.emit('send-message', message)
            // ws.in(room).emit('send-message', message);
            // ws.emit('send-message', message)
        })
    })
})

ws.on('connection', socket => {
    console.log(`${socket.handshake.auth.name} has connected to the server`);

    /* socket.on('send-message', message => {
        // create an array from the rooms set and filter it for the recently created room
        // then emit the message to the particular room
        // NOTE in the scope of rooms the broadcast property is undefined so the io will be used to send to all sockets
        // while the socket will emit to all sockets excluding itself

        Array.from(socket.rooms)
        .filter(id => id != socket.id)
        .forEach(room => {
            // console.log(socket.id, room);
            ws.in(room).emit('send-message', message)
        })
    }) */
});