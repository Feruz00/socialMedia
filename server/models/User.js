const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        unique: true,
        default: ''
    },
    email: String,
    password: String,
    googleId: String,
    githubId: String,
    status:{
        type:Boolean,
        default: false
    },
    logo:{
        type:String,
        default: ''
    },
    firstName: {
        type:String,
        default: ''
    },
    lastName: {
        type:String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user','root'],
        default: 'user'
    },
    
    token: String,
    createToken: {
        type: Date
    },
    unreadPosts:{
        type: Boolean,
        default: false
    },
    unreadNotifications:{
        type: Boolean,
        default: false
    }
},{timestamps: true});

userSchema.plugin(passportLocalMongoose,{ usernameField: 'email'});
userSchema.plugin(findOrCreate);

const User = mongoose.model('User',userSchema);

module.exports = User;