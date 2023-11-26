/*
//note* how express handle status 200 ok, 400 error
// use promise instead of callbacks 
// change functions to GET, POST, PATCH, DELETE or CRUD
// Data in JSON format
*/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const database = require('./config/database');

//Setting up config.env file variables
dotenv.config({path: './config/config.env'})

//Importing all routes
const route1 = require('./routes/route1');

app.use('/api/v1', route1);


// Inititalize the app and add middleware
app.set('view engine', 'pug'); // Setup the pug
app.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(session({ secret: 'super-secret' })); // Session setup

// Login function
function login(username, password, callback) {
    const query = 'SELECT * FROM accounts WHERE username=? AND password=?';

    // SQL query to retrieve the user record based on the given username and password
    database.query(query, [username, password], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }

        // Assign the retrieved record into session
        if (result.length > 0) {
            const logged_user = {
                username: username,
                email: result[0].email
            }
            console.log(logged_user);
            callback(null, logged_user);
        } else {
            // Invalid credential
            callback(null, null);
        }
    });
}

/**Part 3*/
// Update email function
function update_email(username, new_email, callback) {
    const query = 'UPDATE accounts set email = ? WHERE username= ?'

    // SQL query to retrieve the user record based on the given username and password
    database.query(query, [new_email, username], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }

        // Assign the retrieved record into session
        if (result.affectedRows > 0) {
            const logged_user = {
                username: username,
                email: new_email
            }
            callback(null, logged_user);
        } else {
            // Invalid credential
            callback(null, null);
        }
    });
}

/** Handle login display and form submit */
app.get('/login', (req, res) => {
    if (req.session.isLoggedIn === true) {
        return res.redirect('/');
    }
    res.render('login', { error: false });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Call login function and pass in the entered username and password
    login(username, password, (err, logged_user) => {
        if (err) {
            console.error('Error:', err);
            return;
        }

        //If the logged_user object is valid, we assign their information into session
        if (logged_user) {
            req.session.isLoggedIn = true;
            req.session.username = logged_user.username;
            req.session.email = logged_user.email;
            res.redirect('/');
        } else {
            res.render('login', { error: 'Username or password is incorrect' });
        }
    });
});

/** Handle logout function */
app.get('/logout', (req, res) => {
    req.session.isLoggedIn = false;
    res.redirect('/');
});

/** Simulated bank functionality */
app.get('/', (req, res) => {
    res.render('index', { isLoggedIn: req.session.isLoggedIn });
});


app.get('/balance', (req, res) => {
    if (req.session.isLoggedIn === true) {
        res.send('Your account balance is $1234.52');
    } else {
        res.redirect('/login?redirect_url=/balance');
    }
});


app.get('/account', (req, res) => {
    if (req.session.isLoggedIn === true) {
        res.send('Your account number is ACL9D42294');
    } else {
        res.redirect('/login?redirect_url=/account');
    }
});


app.get('/contact', (req, res) => {
    res.send('Our address : 321 Main Street, Beverly Hills.');
});


// route to user_details page to display their username and email
app.get('/user_details', (req, res) => {
    if (req.session.isLoggedIn === true) {
        const logged_user = {
            username: req.session.username,
            email: req.session.email
        };
        res.render('user_details', { logged_user: logged_user });
    } else {
        res.redirect('/login?redirect_url=/user_details');
    }
});

// route to update user email page
app.get('/update_user_email', (req, res) => {
    if (req.session.isLoggedIn === true) {
        const logged_user = {
            username: req.session.username,
            email: req.session.email
        };
        res.render('update_user_email', { logged_user: logged_user });
    } else {
        res.redirect('/login?redirect_url=/user_details');
    }
});

// HTTP POST request to update user email
// Will be triggered when user click on "Update" button in the update_user_email.pug page
app.post('/update_user_email', (req, res) => {
    const { new_email } = req.body;
    if (req.session.isLoggedIn === true) {

        // Call update_email function and pass in the username and entered new email
        update_email(req.session.username, new_email, (err, logged_user) => {
            if (err) {
                console.error('Error:', err);
                return;
            }

            if (logged_user) {
                req.session.isLoggedIn = true;
                req.session.username = logged_user.username;
                req.session.email = logged_user.email;
                res.render('update_user_email', { logged_user: logged_user, success: 'Successfully updated email' });
            } else {
                res.render('update_user_email', { error: 'Failed to update user email, please try again later' });
            }
        });
    } else {
        res.redirect('/login?redirect_url=/user_details');
    }
});

/** App listening on port */
const port = process.env.PORT ;
app.listen(port, () => {
    console.log(`MyBank app listening at http://localhost:${port} in ${process.env.NODE_ENV} mode.`);
});