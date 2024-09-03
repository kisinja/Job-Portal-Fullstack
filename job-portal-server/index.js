import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { __dirname } from './utils.js'

const app = express();

dotenv.config();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", 'https://techposter-frontend.onrender.com'],
},
    {
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
import connectDB from "./db.js";

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

startServer();

app.get("/", (req, res) => {
    res.send("Welcome to Job Portal API");
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
import uploadPic from "./routes/uploadPic.js";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import userRoutes from "./routes/user.js";
import salaryRoutes from "./routes/salary.js";
import courseRoutes from "./routes/course.js";
import resumeRoutes from "./routes/resume.js";

app.use("/api", uploadPic);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/resumes", resumeRoutes);