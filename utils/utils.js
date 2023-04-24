exports.getAllSockets = async ws => {
    const onlineUsers = new Set();

    try {
        const sockets = await ws.fetchSockets();

        for(const socket of sockets) {
            onlineUsers.add(socket.handshake.auth.name);
        }

        return onlineUsers;
    }
    catch(err) {
        throw err;
    }
}

exports.getIds = async ws => {
    const onlineUsersID = new Set();

    try {
        const sockets = await ws.fetchSockets();

        for(const socket of sockets) {
            onlineUsersID.add([{id: socket.id, name: socket.handshake.auth.name}]);
        }

        return onlineUsersID;
    }
    catch(err) {
        throw err;
    }
}