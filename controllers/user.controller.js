const mongoose = require('mongoose');
const config = require('../database/config/db.config');
const User = require('../database/models/UserModel');

exports.createUser = async (username, userID) => {
    try {
        await mongoose.connect(config.url);
        
        const user = new User({ username: username, userID: userID });
    
        user.save();
    }
    catch(err) {
        throw err;
    }
}

exports.deleteUser = async username => {
    User.findOneAndRemove({username: username})
    .then(() => console.log("user removed from db"))
}