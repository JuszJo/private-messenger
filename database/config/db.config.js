const dotenv = require('dotenv');
dotenv.config();

let prod = true;
let config;

if(prod) {
    config = {
        url: `mongodb+srv://${process.env.USER}:${process.env.PASSWD}@cluster0.xjoqb.mongodb.net/messenger?retryWrites=true&w=majority`,
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