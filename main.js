/*
//note* how express handle status 200 ok, 400 error
// use promise instead of callbacks 
// change functions to GET, POST, PATCH, DELETE or CRUD
// Data in JSON format
*/
const dotenv = require("dotenv").config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const database = require('./config/database');
const cors = require('cors')

//Importing all routes
//const route1 = require('./routes/route1');
//app.use('/api/v1', route1);

//Inititalize the app and add middleware
app.use(express.json()); //parse json bodies in the request object
app.set('view engine', 'pug'); // Setup the pug
app.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(session({ secret: 'super-secret' })); // Session setup
app.use(cors())



//Global Error Handler, IMPT function params MUST start with err 
app.use((err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);

    res.status(500).json({
        message: "Something went really wrong",
    });
});

//App listening on port
const PORT = process.env.PORT;
app.listen(PORT, () =>
    console.log(`TMS listening at ${PORT}`)
);

/*
promise example

Promise Maker
function getFunction(){
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            if (error) {
            //Promise fails
            reject('error')
            }
            else {
            //Promise fulfilled
            resolve(data)
            }
        })
    })
}

Promise Receiver
getFunction().then(function(data) {
    console.log(data)
})
*/