const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    companyLogo: {
        type: String,
        required: true
    },
    minPrice: {
        type: Number,
        required: true
    },
    maxPrice: {
        type: Number,
        required: true
    },
    salaryType: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    exprerienceLevel: {
        type: String,
        required: true
    },
    employmentType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);