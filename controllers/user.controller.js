const User = require('../database/models/UserModel');

exports.createUser = async (username, userID) => {
    try {
        const user = new User({ username: username, userID: userID });
    
        await user.save();
    }
    catch(err) {
        throw err;
    }
}

exports.deleteUser = async username => {
    try {
        await User.findOneAndRemove({username: username});

        console.log("user removed from db");
    }
    catch(err) {
        throw err;            
    }
}