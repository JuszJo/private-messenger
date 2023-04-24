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

async function getIds() {
    const onlineUsersID = new Set();

    try {
        const sockets = await ws.fetchSockets();

        
        for(const socket of sockets) {
            onlineUsersID.add([{id: socket.id, name: socket.handshake.auth.name}]);
        }

        return onlineUsersID;
    }
    catch(err) {
        throw new Error("Something went wrong in getting all sockets");
    }
}

async function getAllSockets() {
    const onlineUsers = new Set();

    try {
        const sockets = await ws.fetchSockets();

        for(const socket of sockets) {
            onlineUsers.add(socket.handshake.auth.name);
        }

        return onlineUsers;
    }
    catch(err) {
        throw new Error("Something went wrong in getting all sockets");
    }
}

// PRIVATE

ws.of('/private').on('connection', socket => {
    console.log("from-private");

    socket.on('send-message', ({user, message, to}) => {
        getIds()
        .then(set => {
            set.forEach(value => {
                if(to == value[0].name) {
                    ws.to(value[0].id).emit('send-message', {user: user, message: message});
                }
            })
        })
    })
})

// MAIN

ws.on('connection', socket => {
    console.log(`${socket.handshake.auth.name} has connected to the server`);

    getAllSockets()
    .then(value => {
        ws.emit('on-connection', [...value])
    })

    socket.on('disconnect', reason => {
        console.log(`${reason}: user disconnected`);
    })
});