const currentUser = prompt("What is your name");

const onlineList = document.querySelector('#aside-div');
const main = document.querySelector('main');
let roomName = document.querySelector('#room h3');

window.addEventListener('keydown', e => {
    if(e.key == "Enter") sendMessage();
})

let onlineArray = [];
let notViewedMessages = [];
let state = [];

// io(PATH: url | namespace, OPTIONS: object)

const socket = io('/', {auth: {name: currentUser}});
const group = io('/group', {auth: {name: currentUser}});
const private = io('/private', {auth: {name: currentUser}});

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
    main.scrollTo(0, main.clientHeight);
}

function saveState(main) {
    let exist = false;

    // search in state if user has recieved message before from said user

    state.forEach(value => {
        Object.keys(value).forEach(key => {
            if(key == roomName.innerHTML) {
                exist = true;
            
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

        for(let i = 0; i < main.children.length; ++i) {
            arr.push(main.children[i].innerHTML);
        }

        const obj = {
            [roomName.innerHTML]: arr
        };

        state.push(obj);
    }
}

function getState(stateToGet) {
    let exist = false;

    while(main.hasChildNodes()) main.removeChild(main.firstChild);

    // check if messages exist between users before and display;

    state.forEach(value => {
        Object.keys(value).forEach(key => {
            if(key == stateToGet) {
                exist = true;

                // while(main.hasChildNodes()) main.removeChild(main.firstChild);

                value[key].forEach(message => {
                    const h3 = document.createElement('h3');
                    h3.innerHTML = message;

                    main.append(h3);
                })
            }
        })
    })

    notViewedMessages.forEach((value, index) => {
        Object.keys(value).forEach(key => {
            if(key == stateToGet) {
                exist = true;
                
                value[key].forEach(message => {
                    const h3 = document.createElement('h3');
                    h3.innerHTML = message;

                    main.append(h3);
                })

                // remove viewed messages

                notViewedMessages.splice(index, 1);

            }
        })
    })

    // if messages doesn't exist, clear the previous messages from the screen

    if(!exist) while(main.hasChildNodes()) main.removeChild(main.firstChild);
}

function changeView() {
    // this changes the view from user to user;

    if(this.innerHTML != currentUser) {
        saveState(main);

        roomName.innerHTML = this.innerHTML;
        roomName.classList.add(this.classList.value);

        getState(roomName.innerHTML);
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

function saveNotViewed(user, message) {
    let exist = false;

    notViewedMessages.forEach(value => {
        Object.keys(value).forEach(key => {
            if(key == user) {
                exist = true;

                value[key].push(`${user}: ${message}`);
            }
        })
    })

    if(!exist) {
        const arr = [];

        arr.push(`${user}: ${message}`);

        const obj = {
            [user]: arr
        }

        notViewedMessages.push(obj)
    }
    // console.log(notViewedMessages);
}

socket.on('send-message', ({user, message}) => {
    if(roomName.innerHTML != user && user != currentUser) {
        saveNotViewed(user, message)

        return;
    }
    
    const msg = document.createElement('h3');
    msg.innerHTML = `${user}: ${message}`;

    main.append(msg);
    main.scrollTo(0, main.clientHeight);
})