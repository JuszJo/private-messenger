const { getAllSockets , getIds } = require('../utils/utils');

class Socket {
    static handleSocket(ws, socket) {
        console.log(`${socket.handshake.auth.name} has connected to the server`);
    
        getAllSockets(ws)
        .then(value => {
            ws.emit('on-connection', value);
        })
    
        socket.on('disconnect', reason => {
            console.log(`${reason}: user disconnected`);
        })
    }
    
    static handlePrivate(ws, socket) {
        console.log("from-private");
    
        socket.on('send-message', ({user, message, to}) => {
            getIds(ws)
            .then(arr => {
                arr.forEach(value => {
                    if(to == value.name) {
                        ws.to(value.id).emit('send-message', {user: user, message: message});
                    }
                })
            })
        })
    }
}

module.exports = Socket;
