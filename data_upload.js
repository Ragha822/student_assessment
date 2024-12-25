const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/semester_assessment")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Connection error:", error));

// Define the Class schema and model
const classSchema = new mongoose.Schema({
    className: { type: String, required: true },
    numberOfBenches: { type: Number, required: true },
});

const Class = mongoose.model("Class", classSchema);

// Define the Student schema and model
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    usn: { type: String, required: true, unique: true },
    semester: { type: String, required: true },
    rollNumber: { type: Number, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }, // Reference to Class
});

const Student = mongoose.model("Student", studentSchema);

// Route to handle GET requests at root URL
app.get("/", (req, res) => {
    res.send("Welcome to the Semester Assessment Management System");
});

// API to upload classes from CSV
app.post("/upload/classes", (req, res) => {
    const classes = [];
    fs.createReadStream("C:/Users/ragha/Downloads/class_database.csv") // Use forward slashes in paths
        .pipe(csv())
        .on("data", (row) => {
            classes.push({
                className: row["Class Name"],
                numberOfBenches: parseInt(row["Number of Benches"]),
            });
        })
        .on("end", async () => {
            try {
                await Class.insertMany(classes);
                res.json({ message: "Classes uploaded successfully!" });
            } catch (error) {
                console.error(error); // Log detailed error for debugging
                res.status(500).json({ error: "Failed to upload classes" });
            }
        })
        .on("error", (error) => {
            console.error("CSV parsing error:", error);
            res.status(500).json({ error: "CSV parsing error" });
        });
});

// API to upload students from CSV and assign classes
app.post("/upload/students", async (req, res) => {
    const students = [];
    const classes = await Class.find(); // Fetch all classes to assign students

    fs.createReadStream("C:/Users/ragha/Downloads/student_database_updated.csv") // Use forward slashes in paths
        .pipe(csv())
        .on("data", (row) => {
            const randomClass = classes[Math.floor(Math.random() * classes.length)];
            students.push({
                name: row["Name"],
                usn: row["USN"],
                semester: row["Semester"],
                rollNumber: parseInt(row["Roll Number"]),
                classId: randomClass._id, // Assign a random class
            });
        })
        .on("end", async () => {
            try {
                await Student.insertMany(students);
                res.json({ message: "Students uploaded successfully!" });
            } catch (error) {
                console.error(error); // Log detailed error for debugging
                res.status(500).json({ error: "Failed to upload students" });
            }
        })
        .on("error", (error) => {
            console.error("CSV parsing error:", error);
            res.status(500).json({ error: "CSV parsing error" });
        });
});

// API to fetch students with class details
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find().populate("classId", "className numberOfBenches");
        res.json(students);
    } catch (error) {
        console.error(error); // Log detailed error for debugging
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
