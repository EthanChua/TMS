/*
//note* how express handle status 200 ok, 400 error
// change functions to GET, POST, PATCH, DELETE or CRUD
// Checkgroup(userid,groupname) // implement as API so can it solve the issue of stale data
*/
const dotenv = require("dotenv").config();
const pool = require('./config/database');
const express = require('express');
const router= express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const axiosRequest= require('axios');
const { userlogin, createUser } = require("./controllers/userController");


//Routes
router.route("/login").post(userlogin)
router.route("/user/create").post(createUser)
/*
router.route("/logout").get(isVerifiedUser,logout)
router.route("/profile")
router.route("profile/edit")
router.route("/admin")
router.route("/admin/edit")
router.route("/admin/group")
router.route("/CheckGroup")
*/

//Inititalize the app and add middleware
app.use(express.json()); //parse json bodies in the request object
app.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(cors());
app.use(router);

/*
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
*/

/*
// Create
async function createUser(username, password, email, roles, isActive){
    try{
        const query = 'INSERT INTO accounts (username, password, email, roles, isActive) values (?, ?, ?, ?, ?)';
        result = await pool.query(query, [username, password, email, roles, isActive]);
        return result;
    } catch(error){
        throw error;
    }
    
}
*/
/*
app.post('/createUser', async (req,res) => {
    const { username, password, email= null, roles= null, isActive= 1} = req.body;
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?]{8,10}$/;

    if (username !=null){
        if(regex.test(password)){
            try{ 
                await createUser(username, password, email, roles, isActive);

                return res.json({
                    success: true,
                    message: "Account created"
                });
            }
            catch (e){return res.json({error: e})};
        }
        else {
            res.json({error: 'Password does not meet criteria!'});
        }
    }
    if (username === null) {
        return res.json({error: 'Username is missing'})
    }
    if (password === null) {
        return res.json({error: 'Password is missing'})
    }
});
*/

/*
function validPassword(password) {
    
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?]{8,10}$/;
    return regex.test(password);
}
*/
/*
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
     return res.json({
        success: true,
        message: "Successful log in",
        data: { username }
    });
});
*/
//app.post('/logout', )
//app.post('/adminEdit',)
//app/post('/userEdit',)

//App listening on port
const PORT = process.env.PORT;
app.listen(PORT, () =>
    console.log(`TMS listening at ${PORT}`)
);


/*
    var letter = /[a-zA-z]/
    var number = /[0-9]/
    var specialChar = /[!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?]/
    */