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
const pool = require('./config/database');
const cors = require('cors')
const axiosRequest= require('axios');

//Importing all routes
//const auth = require('./routes/auth');
//const route1 = require('./routes/route1');
//app.use('/api/v1', route1);

//app.use('/api/v1', auth);

//Inititalize the app and add middleware
app.use(express.json()); //parse json bodies in the request object
app.set('view engine', 'pug'); // Setup the pug
app.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(session({ secret: 'super-secret' })); // Session setup
app.use(cors());

//  login function
async function login(username, password) {
    try {
      const query = 'SELECT * FROM accounts WHERE username=? AND isActive=1';
      const [rows, fields] = await pool.query(query, [username]);
  
      if (rows.length > 0) {
        const logged_User = {
          username: username,
          password: rows[0].password
        };
        console.log(logged_User);
        return logged_User;

      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
/*
/** Handle login display and form submit 
app.get('/', (req, res) => {
    if (req.session.isLoggedIn === true) {
       return res.redirect('/');
    }
    //res.render('login', { error: false });
});
*/

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let user;

    try {user = await login(username, password)}
    catch (e){ return res.json({error: e})};

    if (user === null) {
        return res.json({error: 'wrong user or password'});
    }

    if (user.password != password) {
        return res.json({error: 'wrong user or password'});
    }
    //console.log("db user:",user);
     return res.json({error: null});
});


//App listening on port
const PORT = process.env.PORT;
app.listen(PORT, () =>
    console.log(`TMS listening at ${PORT}`)
);


// Checkgroup(userid,groupname) // implement as API so can it solve the issue of stale data