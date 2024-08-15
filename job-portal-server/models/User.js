const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    bio: {
        type: String,
        default: 'Hey there! I am using Job Portal.'
    },
    profilePic: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Static sign up method
userSchema.statics.signUp = async function (username, email, password, profilePic) {

    let emptyFields = [];

    if (!username) {
        emptyFields.push('username');
    }

    if (!email) {
        emptyFields.push('email');
    }

    if (!password) {
        emptyFields.push('password');
    }

    if (emptyFields.length > 0) {
        console.log(emptyFields);
        throw Error("Please provide all fields", emptyFields);
    }

    /* Validation */
    if (!username || !email || !password) {
        throw new Error('All fields must be provided');
    };

    if (!validator.isEmail(email)) {
        throw new Error('Email is not valid');
    };

    if (!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    };

    // 'this' refers to the model itself in Mongoose statics
    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error('Email already in use');
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.create({ username, email, password: hashedPassword, profilePic: profilePic ? profilePic.filename : null });
    if (!user) {
        throw new Error('Error creating user');
    }

    return user;
};

// Static login method
userSchema.statics.login = async function (email, password) {
    /* Validation */
    if (!email || !password) {
        throw new Error('All fields must be provided');
    };

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;