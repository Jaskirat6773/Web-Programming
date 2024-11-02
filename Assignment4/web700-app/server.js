
/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Jaskirat Singh Student ID: 161757232 Date: NOvember 1, 2024
*
********************************************************************************/


const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const collegeData = require("D:/Webprogramming/web700-app/modules/collegeData");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse URL-encoded data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// Route for home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Route for about page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route for HTML demo page
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

// Route for adding a student (GET)
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

// Route for adding a student (POST)
app.post('/students/add', (req, res) => {
    console.log("Received student data:", req.body); // Log the received data
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect('/students'); // Redirect to students page after successful addition
        })
        .catch(err => {
            console.error("Error adding student:", err);
            res.status(500).send('Error adding student'); // Handle error appropriately
        });
});

// Route to get students
app.get("/students", async (req, res) => {
    const course = req.query.course;
    try {
        let students;
        if (course) {
            students = await collegeData.getStudentsByCourse(course);
        } else {
            students = await collegeData.getAllStudents();
        }
        res.json(students);
    } catch (err) {
        res.json({ message: "no results" });
    }
});

// Route to get TAs
app.get("/tas", async (req, res) => {
    try {
        res.json(await collegeData.getTAs());
    } catch (err) {
        res.json({ message: "no results" });
    }
});

// Route to get courses
app.get("/courses", async (req, res) => {
    try {
        res.json(await collegeData.getCourses());
    } catch (err) {
        res.json({ message: "no results" });
    }
});

// Route to get a specific student by number
app.get("/student/:num", async (req, res) => {
    const studentId = req.params.num;
    try {
        res.json(await collegeData.getStudentByNum(studentId));
    } catch (err) {
        res.json({ message: "no results" });
    }
});

// 404 Error handling
app.use((req, res, next) => {
    res.status(404).send("404 - We're unable to find what you're looking for.");
});

// Initialize college data and start server
collegeData.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server listening on port: " + PORT);
        });
    })
    .catch(err => {
        console.log("Failed to initialize data:", err);
    });
