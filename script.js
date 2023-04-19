/* const socket = io();
socket.emit('home', {name: "Joshua"}) */

/* const room1 = "joshua";
const message = "Welcome" */

const div = document.querySelector('div');
const main = document.querySelector('main');

const socket = io();

function createRoom() {
    const input = document.querySelector('input');
    if(input.value) socket.emit('create-room', input.value);
    input.value = '';
}

function joinRoom() {
    const input = document.querySelector('input');
    if(input.value) socket.emit('join-room', input.value);
    input.value = '';
}

function sendMessage() {
    const input = document.querySelector('input');
    if(input.value) socket.emit('send-message', input.value);
    input.value = '';
}

socket.on('created-room', room => {
    const h3 = document.createElement('h3');
    h3.innerHTML = `"${room}" room has been created`;

    div.append(h3)
})

socket.on('send-message', message => {
    const msg = document.createElement('p');
    msg.innerHTML = message;

    main.append(msg);
})