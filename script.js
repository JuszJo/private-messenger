const user = prompt("What is your name");

const onlineList = document.querySelector('#aside-div');
const main = document.querySelector('main');
let roomName = document.querySelector('#room h3');

let onlineArray = [];

// io(PATH: url | namespace, OPTIONS: object)

const socket = io('/', {auth: {name: user}});
const group = io('/group', {auth: {name: user}});
const private = io('/private', {auth: {name: user}});

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
    let privateMessage = false;

    if(input.value) {
        for(let i = 0; i < onlineArray.length; ++i) {
            if(roomName.classList.value == "private") {
                privateMessage = true;
                private.emit('send-message', {user: user, message: input.value});

                break;
            }
        }
        
        if(!privateMessage) group.emit('send-message', {user: user, message: input.value});
    };

    input.value = '';
}

function changeView() {
    if(this.innerHTML != user) {
        roomName.innerHTML = this.innerHTML;
        roomName.classList.add(this.classList.value)
    }
}

socket.on('on-connection', users => {
    while(onlineList.hasChildNodes()) onlineList.removeChild(onlineList.firstChild);
    onlineArray = [];

    for(let i = 0; i < users.length; ++i) {
        onlineArray.push(users[i]);

        const h3 = document.createElement('h3');
        h3.innerHTML = `${users[i]}`;
        h3.classList.add('private');
        h3.addEventListener('click', changeView);

        onlineList.append(h3);
    }
})

socket.on('created-room', room => {
    const h3 = document.createElement('h3');
    h3.innerHTML = `${room}`;
    h3.classList.add('room');
    h3.addEventListener('click', changeView);

    onlineList.append(h3);
})

group.on('room-error', message => {
    const error = document.createElement('p');
    error.innerHTML = message;

    document.querySelector('footer').append(error);
})

group.on('send-message', ({user, message}) => {
    const msg = document.createElement('h3');
    msg.innerHTML = `${user}: ${message}`;

    main.append(msg);
})