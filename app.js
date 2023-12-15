/*
//note: how express handle status 200 ok, 400 error
*/

const express = require('express');
const router= express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const { userlogin, createUser, Checkgroup, log_out, userUpdate, userEdit, createGroup, showAllUser, getGroups, getUser, toggleStatus} = require("./controllers/userController");
const {validUser, authorizedGroups, adminProtect} = require("./controllers/authController");
const { createApp, showAllApp, showApp, editApp, createPlan, showAllPlan, showPlan, editPlan, createTask, showAllTask, showTask, promoteTask, demoteTask, editTask } = require('./controllers/taskController');
const dotenv = require("dotenv").config();

//Routes

//Access Control Route
router.route("/Checkgroup").post(validUser, Checkgroup) //check user have access rights

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
router.route("/editUsers").post(validUser, authorizedGroups("admin"), userEdit) // admin edit users
router.route("/toggleStatus").post(validUser, authorizedGroups("admin"), toggleStatus) // status active or inactive

//Inititalize the app and add middleware
app.use(express.json()); //parse json bodies in the request object
app.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(cors());
app.use(router); //test later if needed

//Task Routes
router.route("/createApp").post(createApp)
router.route("/displayAllApp").get(showAllApp)
router.route("/displayApp").post(showApp)
router.route("/editApp").post(editApp)
router.route("/createPlan").post(createPlan)
router.route("/displayAllPlan").get(showAllPlan)
router.route("/displayPlan").post(showPlan)
router.route("/editPlan").post(editPlan)
router.route("/createTask").post(createTask)
router.route("/displayAllTask").get(showAllTask)
router.route("/displayTask").post(showTask)
router.route("/editTask").post(editTask)
router.route("/taskPromote").post(promoteTask)
router.route("/taskDemote").post(demoteTask)

//App listening on port
const PORT = process.env.PORT;
app.listen(PORT, () =>
    console.log(`TMS started at ${PORT}`)
);

