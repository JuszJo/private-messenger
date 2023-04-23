const currentUser = prompt("What is your name");

let mainContainer = document.getElementById('main-container');
const onlineList = document.querySelector('#aside-div');
const main = document.querySelector('main');
let roomName = document.querySelector('#room h3');

let onlineArray = [];
let messages = [];
let state = [];

// io(PATH: url | namespace, OPTIONS: object)

const socket = io('/', {auth: {name: currentUser}});
const group = io('/group', {auth: {name: currentUser}});
const private = io('/private', {auth: {name: currentUser}});

/* function createRoom() {
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
} */

function sendMessage() {
    const input = document.querySelector('input');
    let privateMessage = false;

    if(input.value && roomName.innerHTML) {
        for(let i = 0; i < onlineArray.length; ++i) {
            if(roomName.classList.value == "private") {
                privateMessage = true;
                private.emit('send-message', {user: currentUser, message: input.value, to: roomName.innerHTML});

                break;
            }
        }
        
        if(!privateMessage) group.emit('send-message', {user: currentUser, message: input.value});

        displayMessage(currentUser, input.value);
    };

    input.value = '';

}

function displayMessage(currentUser, message) {
    const msg = document.createElement('h3');
    msg.innerHTML = `${currentUser}: ${message}`;

    main.append(msg);

    main.scrollTo(0, main.clientHeight)
    // window.scrollTo(0, document.body.scrollHeight)
}

function saveState(main) {
    let exist = false;

    // search in state if user has recieved message before from said user

    state.forEach(value => {
        Object.keys(value).forEach(key => {
            if(key == roomName.innerHTML) {
                // console.log(key, roomName.innerHTML);
                exist = true;
                // console.log("exist", roomName.innerHTML);

                // console.log(main.children);
                const arr = [];
    
                for(let i = 0; i < main.children.length; ++i) {
                    arr.push(main.children[i].innerHTML);
                }

                value[key] = arr;
            }
        })
    })

    // if user hasn't recieved a message before, create the said user and add to state

    if(!exist) {
        const arr = [];
        // console.log("does not exist", roomName.innerHTML);

        for(let i = 0; i < main.children.length; ++i) {
            arr.push(main.children[i].innerHTML);
        }

        const obj = {
            [roomName.innerHTML]: arr
        };

        state.push(obj);
    }

    // console.log(state);
}

function getState(stateToGet) {
    let exist = false;

    // console.log(state, stateToGet);

    // check if messages exist between users before and display;

    state.forEach(value => {
        Object.keys(value).forEach(key => {
            if(key == stateToGet) {
                while(main.hasChildNodes()) main.removeChild(main.firstChild);
                // console.log(`${stateToGet} exist`);
                exist = true;

                value[key].forEach(message => {
                    const h3 = document.createElement('h3');
                    h3.innerHTML = message;

                    main.append(h3);
                    // console.log(message);
                })
                // mainContainer = value[key];
            }
        })
    })

    // if messages doesn't exist, clear the previous messages from the screen

    if(!exist) {
        /* console.log(state[0][""]);
        console.log(state); */
        // console.log(`${stateToGet} does not exist`);
        while(main.hasChildNodes()) main.removeChild(main.firstChild);

        // console.log(state);
        // mainContainer = state[0][""];
    }
}

function changeView() {
    // this changes the view from user to user;

    if(this.innerHTML != currentUser) {
        saveState(main);

        roomName.innerHTML = this.innerHTML;
        roomName.classList.add(this.classList.value);

        getState(roomName.innerHTML);
    }

    // console.log(state);
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

/* socket.on('created-room', room => {
    const h3 = document.createElement('h3');
    h3.innerHTML = `${room}`;
    h3.classList.add('room');
    h3.addEventListener('click', changeView);

    onlineList.append(h3);
}) */

/* group.on('room-error', message => {
    const error = document.createElement('p');
    error.innerHTML = message;

    document.querySelector('footer').append(error);
}) */

/* group.on('send-message', ({user, message}) => {
    const msg = document.createElement('h3');
    msg.innerHTML = `${user}: ${message}`;

    main.append(msg);
}) */

/* private.on('send-message', ({user, message}) => {
    console.log("pthis-worked");
    const msg = document.createElement('h3');
    msg.innerHTML = `${user}: ${message}`;

    main.append(msg);
}) */

socket.on('send-message', ({user, message}) => {
    if(!roomName.innerHTML) return;

    if(roomName.innerHTML != user && user != currentUser) return;

    // messages.push({sender: user, message: message});
    
    const msg = document.createElement('h3');
    msg.innerHTML = `${user}: ${message}`;

    main.append(msg);

    main.scrollTo(0, main.clientHeight)

    // window.scrollTo(0, document.body.scrollHeight)
})