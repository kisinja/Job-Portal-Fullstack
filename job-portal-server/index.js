require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
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

// Routes
const uploadPic = require("./routes/uploadPic");
const authRoutes = require("./routes/auth");

app.use("/api", uploadPic);
app.use("/api/auth", authRoutes);