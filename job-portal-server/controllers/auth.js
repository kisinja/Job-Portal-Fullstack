const User = require('../models/User');
const jwt = require('jsonwebtoken');

// create token
const createToken = (_id) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: '3d'
    });

    return token;
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // create token
        const token = createToken(user._id);

        res.status(200).json({
            email,
            token,
        });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

// sign up user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // check if user exists using the signUp method from the User model
        const user = await User.signUp(username, email, password, req.file || '');

        // create token
        const token = createToken(user._id);

        res.status(201).json({
            email,
            token
        });

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginUser,
    registerUser
};