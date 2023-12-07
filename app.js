/*
//note: how express handle status 200 ok, 400 error
*/

const express = require('express');
const router= express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const { userlogin, createUser, Checkgroup, log_out, userUpdate, userEdit, createGroup, showAllUser, getGroups, getUser} = require("./controllers/userController");
const {validUser, authorizedGroups, adminProtect} = require("./controllers/authController");
const dotenv = require("dotenv").config();

//Routes

//Access Control Route
router.route("/Checkgroup").post(Checkgroup) //check user have access rights

//All user route
router.route("/login").post(userlogin)
router.route("/log_out").get(log_out)
router.route("/user").get(validUser,getUser) 
router.route("/userUpdate").post(validUser,userUpdate)// self update user details
//router.route("/login/checkUser").post()

//Admins Routes
router.route("/createUser").post(validUser, authorizedGroups("admin"), createUser) //admin create new users
router.route("/creategroup").post(validUser, authorizedGroups("admin"), createGroup) //create groups
router.route("/showUsers").get(validUser, authorizedGroups("admin"), showAllUser) //show all users
router.route("/showGroups").get(validUser, authorizedGroups("admin"),getGroups) //show all groups

//Protected Routes
router.route("/editUsers").post(validUser, authorizedGroups("admin"), adminProtect, userEdit) // admin edit users

//Inititalize the app and add middleware
app.use(express.json()); //parse json bodies in the request object
app.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(cors());
app.use(router); //test later if needed

//App listening on port
const PORT = process.env.PORT;
app.listen(PORT, () =>
    console.log(`TMS started at ${PORT}`)
);

