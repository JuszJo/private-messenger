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

ws.on('connection', socket => {
    console.log("A user has connected to the server");

    socket.on('create-room', room => {
        socket.leave(socket.id);
        
        ws.emit('created-room', room);
        
        socket.join(room)
        
        console.log(`${room} room has been created`);
    })
    
    socket.on('join-room', room => {
        socket.leave(socket.id);

        socket.join(room);

        console.log(`${socket.id} has joined ${room} room`);
    })

    socket.on('send-message', message => {
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
    })
});