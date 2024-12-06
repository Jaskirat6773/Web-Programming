var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require('path');
var app = express();
const collegeData = require(path.join(__dirname, "modules", "collegeData"));
const ejs = require("ejs"); 
app.engine('ejs', ejs.renderFile); 
app.set('view engine', 'ejs'); 
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts)
app.set('layout', 'layouts/main');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, "views")));

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute =
        "/" +
        (isNaN(route.split("/")[1])
            ? route.replace(/\/(?!.*)/, "")
            : route.replace(/\/(.*)/, ""));
    next();
});

app.locals.navLink = function (url, options) {
    return (
        '<li' +
        (url === app.locals.activeRoute ? ' class="nav-item active"' : ' class="nav-item"') +
        '><a class="nav-link" href="' +
        url +
        '">' +
        options.fn(this) +
        "</a></li>"
    );
};

app.locals.equal = function (lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Ejs Helper 'equal' needs 2 parameters");
    return lvalue !== rvalue ? options.inverse(this) : options.fn(this);
};

app.get('/', (req, res) => {
    res.render('home', { title: "Home" }); 
  });  
  
app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});

app.get('/students', async (req, res) => {
    const course = req.query.course;
    try {
        const students = course ? await getStudents(course) : await getStudents();
        if (students.length > 0) {
            res.render('students', { students });
        } else {
            res.render('students', {students});
        }
    } catch (err) {
        res.render('students', {students});
    }
});

app.get("/student/:studentNum", (req, res) => {
    const studentNum = req.params.studentNum;
    Promise.all([
        collegeData.getStudentByNum(studentNum),
        collegeData.getCourses()                
    ])
    .then(([student, courses]) => {
        res.render("student", { student, courses });
    })
    .catch((err) => {
        console.log(err);
        res.render("student", { message: "Student not found" });
    });
});


app.post("/student/update", (req, res) => {
    const updatedStudent = req.body;
    collegeData.updateStudent(updatedStudent)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Unable to update student");
        });
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((data) => {
                res.render("courses", { courses: data });
        })
        .catch(() => {
            res.render("courses", { courses: data });
        });
});

app.get("/course/:id", (req, res) => {
    const courseId = req.params.id;

    collegeData.getCourseById(courseId)
        .then((course) => {
            res.render("course", { course: course });
        })
        .catch((error) => {
            res.render("course", { message: error });
        });
});

const getStudents = async (course) => {
    try {
        if (course) {
            return await collegeData.getStudentsByCourse(course);
        } else {
            return await collegeData.getAllStudents();
        }
    } catch (err) {
        console.error(err);
        throw new Error("No results");
    }
};

app.get('/students/add', (req, res) => {
    collegeData.getCourses()
        .then((courses) => {
            res.render("addStudent", { courses });
        })
        .catch((err) => {
            console.log(err);
            res.render("addStudent", { message: "Error retrieving courses" });
        });
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect('/students'))
        .catch(err => res.status(500).send('Unable to add student: ' + err));
});

app.get('/courses/add', (req, res) => {
    res.render('addCourse');
});

app.post('/courses/add', (req, res) => {
    collegeData.addCourse(req.body)
        .then(() => res.redirect('/courses'))
        .catch(err => res.status(500).send('Unable to add course: ' + err));
});

app.use((req, res, next) => {
    res.sendFile("error.html", { root: "views" });
  });

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
    })
    .catch(err => {
        console.log("Failed to initialize data:", err);
    });

module.exports = app;
