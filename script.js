let currentUser;

while(!currentUser) currentUser = prompt("What is your name");

const onlineList = document.querySelector('#aside-div');
const sideBar = document.querySelector('aside');
const main = document.querySelector('main');
const menuOpenButton = document.querySelector('#open-menu');
const menuCloseButton = document.querySelector('#close-menu');
let roomName = document.querySelector('#room h3');

function handleMenuOpen() {
    sideBar.style.display = "flex";

    menuCloseButton.style.display = "unset"

    this.style.display = "none";
}

function handleMenuClose() {
    sideBar.style.display = "none";

    menuOpenButton.style.display = "unset"

    this.style.display = "none";
}

menuOpenButton.addEventListener('click', handleMenuOpen);
menuCloseButton.addEventListener('click', handleMenuClose);

window.addEventListener('keydown', e => {
    if(e.key == "Enter") sendMessage();
})

let onlineArray = [];
let notViewedMessages = [];
let state = [];

// io(PATH: url | namespace, OPTIONS: object)

const socket = io('/', {auth: {name: currentUser}});
const private = io('/private', {auth: {name: currentUser}});
// const group = io('/group', {auth: {name: currentUser}});

function sendMessage() {
    const input = document.querySelector('input');

    if(input.value && roomName.innerHTML) {
        private.emit('send-message', {user: currentUser, message: input.value, to: roomName.innerHTML});

        displayMessage(currentUser, input.value);
    }

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

                notViewedMessages.splice(index, 1);
            }
        })
    })

    // if messages doesn't exist, clear the previous messages from the screen

    if(!exist) while(main.hasChildNodes()) main.removeChild(main.firstChild);
}

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
}

function alertNewMessage(user) {
    for(let i = 0; i < onlineArray.length; ++i) {
        if(user == onlineList.children[i].innerHTML) {
            onlineList.children[i].classList.add('new-message');
        }
    }
}

function removeAlertNewMessage(user) {
    for(let i = 0; i < onlineArray.length; ++i) {
        if(user == onlineList.children[i].innerHTML) {
            onlineList.children[i].classList.remove('new-message');
        }
    }
}

function changeView() {
    // this changes the view from user to user;

    if(this.innerHTML != currentUser) {
        saveState(main);

        removeAlertNewMessage(this.innerHTML);

        document.querySelector('input').focus();

        roomName.innerHTML = this.innerHTML;
        roomName.classList.add(this.classList.value);

        getState(roomName.innerHTML);
    }
}

function removeFromOnlineArray(user) {
    let userDisconnected = '';

    onlineArray.forEach((onlineUser, index) => {
        if(onlineUser == user) {
            userDisconnected = onlineArray.splice(index, 1);
        }
    })

    for(let i = 0; i < onlineList.children.length; ++i) {
        if(userDisconnected == onlineList.children[i].innerText) {
            onlineList.children[i].remove();
        }
    }
}

socket.on('on-connection', users => {
    while(onlineList.hasChildNodes()) onlineList.removeChild(onlineList.firstChild);

    // sessionStorage.setItem("users", )
    
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

socket.on('send-message', ({user, message}) => {
    if(roomName.innerHTML != user && user != currentUser) {
        saveNotViewed(user, message)

        alertNewMessage(user);

        return;
    }
    
    displayMessage(user, message);
})

socket.on('user_disconnect', ({user}) => {
    removeFromOnlineArray(user)
})