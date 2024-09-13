/*********************************************************************************
*  WEB700 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jaskirat Singh Student ID: 161757232 Date: Sepetember 10, 2024
*
********************************************************************************/ 


// Utility function to generate a random integer between 0 and max (exclusive)
function getRandomInt(max) 
{
    return Math.floor(Math.random() * max);
}


// Defining the arrays for server verbs, paths, and responses

const serverVerbs = ["GET", "GET", "GET", "POST", "GET", "POST"];

const serverPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout"];

const serverResponses = [
    "Welcome to WEB700 Assignment 1",
    "This assignment was prepared by Jaskirat Singh",
    "Student Name: jsingh1128@myseneca.ca",
    "User Logged In",
    "Main Panel",
    "Logout Complete"
];

// Creating the "web server simulator" Function - "httpRequest" 

function httpRequest(httpVerb, path)
{
    for (let i = 0; i < serverResponses.length; i++)
    {
        if (serverVerbs[i] === httpVerb && serverPaths[i] === path)
        {
            return '200: ' + serverResponses[i] ;
        }
    }

    return '404: Unable to process ' + httpVerb + 'request for ' + path;
}

// MANUAL TESTS

console.log(httpRequest("GET", "/"));           // shows "200: Welcome to WEB700 Assignment 1"
console.log(httpRequest("GET", "/about"));      // shows "200: This Assignment was prepared by Jaskirat"
console.log(httpRequest("PUT", "/"));           // shows "404: Unable to process PUT request for /"


//Automate Testing using automateTests function and randomRequest 

function automateTests()
{
    const testVerbs = ["GET", "POST"]

    const testPaths = [ "/", "/about", "/contact", "/login", "/panel", "/logout", "/randomPath1", "/randomPath2"]

    function randomRequest()
    {
        const randVerb = testVerbs[getRandomInt(testVerbs.length)];     //getting random value for verb
        
        const randPath = testPaths[getRandomInt(testPaths.length)];     //getting random value for path

        console.log(httpRequest(randVerb,randPath))

    }

    setInterval(randomRequest, 1000);

}

automateTests();        //invoking automateTest function