import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const requireAuth = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findOne({ _id }).select('-password');

        req.user = user;

        next();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(401).json({ error: `Request is not authorized, Error: ${error.message}` });
    }
};

export default requireAuth;