/*********************************************************************************
* WEB700 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Jaskirat Singh Student ID: 161757232 Date: 28/9/24
*
********************************************************************************/



const fs = require('fs').promises;

class Data 
{
    constructor(students, courses) 
    {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

async function initialize() 
{
    try 
    {
        const studentDataFromFile = await fs.readFile('E:/SEM 2/WEB/Assignment2/data/students.json', 'utf8');
        const courseDataFromFile = await fs.readFile('E:/SEM 2/WEB/Assignment2/data/courses.json', 'utf8');

        const students = JSON.parse(studentDataFromFile);
        const courses = JSON.parse(courseDataFromFile);

        dataCollection = new Data(students, courses);
        return Promise.resolve();
    } 
    catch (error) 
    {
        return Promise.reject("Unable to read files.");
    }
}

function getAllStudents() 
{
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) 
        {
            reject("No results returned.");
        } 
        else 
        {
            resolve(dataCollection.students);
        }
    });
}

function getTAs() 
{
    return new Promise((resolve, reject) => {

        const tas = dataCollection.students.filter(student => student.TA);

        if (tas.length === 0) 
        {
            reject("No results returned.");
        } 
        else 
        {
            resolve(tas);
        }
    });
}

function getCourses() 
{
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) 
        {
            reject("No results returned.");
        } 
        else 
        {
            resolve(dataCollection.courses);
        }
    });
}

module.exports = 
{
    initialize,
    getAllStudents,
    getTAs,
    getCourses
};
