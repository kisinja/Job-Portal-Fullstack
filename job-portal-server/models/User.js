import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import validator from 'validator';

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
        enum: ['job-seeker', 'admin', 'employer'],
        default: 'job-seeker'
    },
    bio: {
        type: String,
        default: 'Hey there! I am using Job Portal.'
    },
    profilePic: {
        type: String,
        default: "https://i.pinimg.com/736x/fb/8f/3e/fb8f3e83f9146e6b6a805a535f665dd7.jpg"
    },

    userSkills: [{
        type: String,
    }],

    // For password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // applied jobs
    appliedJobs: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Job'
        }
    ],
    experience: {
        type: Number,
        default: 0
    },
    education: {
        type: String, // Example: 'Bachelor's Degree'
        default: 'High School'
    },
}, { timestamps: true });

// Static sign up method
userSchema.statics.signUp = async function (username, email, password) {

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
    const user = await this.create({ username, email, password: hashedPassword });
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

export default User;