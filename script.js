/* const socket = io();
socket.emit('home', {name: "Joshua"}) */

const room1 = "joshua";
const message = "Welcome"

const div = document.querySelector('div');
const main = document.querySelector('main');

const socket = io();

function createRoom() {
    socket.emit('create-room', room1);
}

function joinRoom() {
    socket.emit('join-room', room1);
}

function sendMessage() {
    socket.emit('send-message', message);
}

socket.on('created-room', room => {
    const h1 = document.createElement('h1');
    h1.innerHTML = `${room} room has been created`;

    div.append(h1)
})

socket.on('send-message', message => {
    const msg = document.createElement('h2');
    msg.innerHTML = message;

    main.append(msg);
})