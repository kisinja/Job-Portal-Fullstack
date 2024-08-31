const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyName: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    companyLogo: {
        type: String,
    },
    minPrice: {
        type: Number,
    },
    maxPrice: {
        type: Number,
    },
    salaryType: {
        type: String,
    },
    jobLocation: {
        type: String,
    },
    exprerienceLevel: {
        type: String,
    },
    employmentType: {
        type: String,
    },
    description: {
        type: String,
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    skills: [
        {
            value: {
                type: String,
            },
            label: {
                type: String,
            }
        }
    ],
    applicants: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);