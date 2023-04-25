const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: String,
    userID: Schema.Types.Mixed
})

const User = model('User', UserSchema);

module.exports = User;