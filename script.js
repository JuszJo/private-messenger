const user = prompt("What is your name");

const onlineList = document.querySelector('#aside-div');
const roomName = document.querySelector('#room h3');
const main = document.querySelector('main');

// io(PATH: url | namespace, OPTIONS: object)

const socket = io('/', {auth: {name: user}});
const group = io('/group', {auth: {name: user}});

function createRoom() {
    const input = document.querySelector('input');
    if(input.value) group.emit('create-room', input.value);
    // if(input.value) socket.emit('create-room', input.value);
    input.value = '';
}

function joinRoom() {
    const input = document.querySelector('input');
    if(input.value) group.emit('join-room', input.value);
    // if(input.value) socket.emit('join-room', input.value);
    input.value = '';
}

function sendMessage() {
    const input = document.querySelector('input');
    if(input.value) group.emit('send-message', {user: user, message: input.value});
    input.value = '';
}

socket.on('on-connection', user => {
    const h3 = document.createElement('h3');
    h3.innerHTML = `${user}`;

    onlineList.append(h3)
})

socket.on('created-room', room => {
    const h3 = document.createElement('h3');
    h3.innerHTML = `${room}`;
    // h3.innerHTML = `"${room}" room has been created`;

    onlineList.append(h3);
    // roomName.append(h3)
})

group.on('room-error', message => {
    const error = document.createElement('p');
    error.innerHTML = message;

    document.querySelector('footer').append(error);
})

group.on('send-message', ({user, message}) => {
    console.log('working');
    const msg = document.createElement('h3');
    msg.innerHTML = `${user}: ${message}`;

    main.append(msg);
})