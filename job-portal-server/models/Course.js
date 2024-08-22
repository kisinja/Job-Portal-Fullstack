const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
    },
    skillsTaught: {
        type: String,
    },
    duration: {
        type: String,
    },
    courseLink: {
        type: String,
    }
});