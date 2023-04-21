const express = require('express');
const io = require('socket.io');
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

// HELPER FUNCTIONS

function checkRoom(room) {
    const rooms = ws.of('/group').adapter.rooms;
    let exist = false;

    rooms.forEach((value, key, map) => {
        if(key == room) exist = true;
    })

    return exist;
}

async function getAllSockets() {
    const onlineUsers = new Set();

    try {
        const sockets = await ws.fetchSockets();

        for(const socket of sockets) {
            onlineUsers.add(socket.handshake.auth.name)
        }

        return onlineUsers;
    }
    catch(err) {
        throw new Error("Something went wrong in getting all sockets");
    }
}

// GROUP

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

    socket.on('send-message', ({user, message}) => {
        console.log("from-group");
        // create an array from the rooms set and filter it for the recently created room
        // then emit the message to the particular room
        // NOTE in the scope of rooms the broadcast property is undefined so the io will be used to send to all sockets
        // while the socket will emit to all sockets excluding itself

        Array.from(socket.rooms)
        .filter(id => id != socket.id)
        .forEach(room => {
            ws.of('/group').in(room).emit('send-message', {user: user, message: message});
        })
    })
})

// PRIVATE

ws.of('/private', socket => {
    socket.on('send-message', ({user, message, to}) => {
        console.log("from-private");
    })
})

// MAIN

ws.on('connection', socket => {
    console.log(`${socket.handshake.auth.name} has connected to the server`);

    getAllSockets()
    .then(value => {
        ws.emit('on-connection', [...value])
    })

    // ws.emit('on-connection', sockets);

    // ws.emit('on-connection', socket.handshake.auth.name);

    socket.on('disconnect', reason => {
        console.log(`${reason}: user disconnected`);
    })
});