/*
//note: how express handle status 200 ok, 400 error
*/

const express = require('express');
const router= express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const { userlogin, createUser, Checkgroup, log_out, userUpdate, userEdit} = require("./controllers/userController");
const dotenv = require("dotenv").config();

//Routes
//Service Access
router.route("/login").post(userlogin)
router.route("/log_out").get(log_out)
router.route("/login/checkUser").post()

//Access Control
router.route("/checkgroup").post(Checkgroup) //check user have access rights

//Services
router.route("/user").post() 
router.route("/user/register").post(createUser) //admin create new users
router.route("/user/edit").post(userEdit) // admin edit users
router.route("/user/update").post(userUpdate)// self update user details
router.route("/user/getall").post() //show all users
router.route("/group/getall").post() 
router.route("/group/create").post() //create groups

//Inititalize the app and add middleware
app.use(express.json()); //parse json bodies in the request object
app.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(cors());
app.use(router);

//App listening on port
const PORT = process.env.PORT;
app.listen(PORT, () =>
    console.log(`TMS started at ${PORT}`)
);

