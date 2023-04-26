exports.getAllSockets = async ws => {
    const onlineUsers = [];

    try {
        const sockets = await ws.fetchSockets();

        for(const socket of sockets) onlineUsers.push(socket.handshake.auth.name);

        return onlineUsers;
    }
    catch(err) {
        throw err;
    }
}

exports.getIds = async ws => {
    const onlineUsersID = [];

    try {
        const sockets = await ws.fetchSockets();

        for(const socket of sockets) onlineUsersID.push({id: socket.id, name: socket.handshake.auth.name});

        return onlineUsersID;
    }
    catch(err) {
        throw err;
    }
}