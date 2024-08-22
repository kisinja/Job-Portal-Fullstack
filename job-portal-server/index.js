require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

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
const connectDB = require("./db");

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
const uploadPic = require("./routes/uploadPic");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/user");
const salaryRoutes = require("./routes/salary");

app.use("/api", uploadPic);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/salary", salaryRoutes);