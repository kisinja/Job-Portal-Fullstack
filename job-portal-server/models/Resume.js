import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    personalInfo: {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: String,
        linkedin: String,
        github: String,
        website: String,
        summary: String,
    },
    experience: [
        {
            company: String,
            role: String,
            description: String,
            startDate: Date,
            endDate: Date,  // Use null or a string like "Present" for ongoing roles
            location: String,
        },
    ],
    education: [
        {
            institution: String,
            degree: String,
            fieldOfStudy: String,
            startDate: Date,
            endDate: Date,
            location: String,
        },
    ],
    skills: [
        {
            type: String,
        },
    ],
    projects: [
        {
            title: String,
            description: String,
            link: String, // GitHub or live demo link
        },
    ],
    certifications: [
        {
            title: String,
            issuingOrganization: String,
            issueDate: Date,
            expirationDate: Date,
            credentialId: String,
            credentialUrl: String,
        },
    ],
    languages: [
        {
            name: String,
            proficiency: String, // e.g., "Fluent", "Intermediate", "Beginner"
        },
    ],
    hobbies: [
        {
            type: String,
        },
    ],
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;