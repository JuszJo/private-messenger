const dotenv = require('dotenv');
dotenv.config();

let prod = false;
let config;

if(prod) {
    config = {
        url: `mongodb+srv://joshua:${process.env.PASSWD}@cluster0.xjoqb.mongodb.net/messenger?retryWrites=true&w=majority`,
        collection: "messages"
    }
}
else {
    config = {
        url: "mongodb://127.0.0.1:27017/messenger",
        collection: "messages"
    }
}

module.exports = config;