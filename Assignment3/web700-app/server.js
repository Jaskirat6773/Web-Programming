
/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jaskirat Singh Student ID: 161757232 Date: October 10.2024
*
********************************************************************************/ 
const path = require('path');

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const collegeData = require("E:/SEM 2/WEB/Assignment3/web700-app/modules/collegeData");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

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

app.get("/tas", async (req, res) => {
    try {
        res.json(await collegeData.getTAs());
    } catch (err) {
        res.json({ message: "no results" });
    }
});

app.get("/courses", async (req, res) => {
    try {
        res.json(await collegeData.getCourses());
    } catch (err) {
        res.json({ message: "no results" });
    }
});

app.get("/student/:num", async (req, res) => {
    const studentId = req.params.num;
    try {
        res.json(await collegeData.getStudentByNum(studentId));
    } catch (err) {
        res.json({ message: "no results" });
    }
});

app.use((req, res, next) => {
    res.status(404).send("404 - We're unable to find what you're looking for.");
  });

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
    })
    .catch(err => {
        console.log("Failed to initialize data:", err);
    });
