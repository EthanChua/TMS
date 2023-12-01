/*
//note* how express handle status 200 ok, 400 error
//
*/

const express = require('express');
const router= express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const { userlogin, createUser } = require("./controllers/userController");
//const axiosRequest= require('axios');
//const dotenv = require("dotenv").config();
//const pool = require('./config/database');

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

//App listening on port
const PORT = process.env.PORT;
app.listen(PORT, () =>
    console.log(`TMS listening at ${PORT}`)
);

