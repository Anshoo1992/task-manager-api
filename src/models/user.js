const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKeyword = 'generatejsonwebtokenforapp';
const Tasks = require('../models/task');
//Model creation 
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number,
        default: 0,
        validate(val) {
            if (val < 0) throw new Error('Invalid Age');
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Not a valid email');
            };
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlenght: 7,
        validate(val) {
            if (val.includes('password')) {
                throw new Error('Password cannot contain keyword "password" ');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

//generate auth token 
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, secretKeyword, { expiresIn: '1 hour' });

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

//hide password and tokens array while login nd signup
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.tokens;
    delete userObject.password;

    return userObject;
}

///login
userSchema.statics.loginByCredentials = async (email, password) => {
    const user = await Users.findOne({ email });
    if (!user) throw new Error('User not found!!');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Email/Password is incorrect!!');
    return user;
}

//middleware for passowrd incrypt
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;
    await Tasks.deleteMany({ owner: user._id });
    next();
});

const Users = mongoose.model('Users', userSchema);


module.exports = Users;