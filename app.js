/*
//note: how express handle status 200 ok, 400 error
*/

const express = require('express');
const router= express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const { userlogin, createUser } = require("./controllers/userController");
const dotenv = require("dotenv").config();

//Routes
//Service Access
router.route("/login").post(userlogin)
router.route("/log_out").post()
router.route("/login/checkUser").post()

//Access Control
router.route("/checkgroup").post() //check user is of which usergroup

//Services
router.route("/user").post() 
router.route("/user/create").post(createUser) //admin create new users
router.route("/user/edit").post() //edit users
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

