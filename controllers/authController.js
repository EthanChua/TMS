const jwt = require("jsonwebtoken");
const pool= require("../config/database");
const { Checkgroup } = require("./userController");

exports.authorizedGroups= (...roles) => {
  return (req, res, next) => {
    let authorised = 0;

    //User can have multiple groups delimited by ,{group},{group}. We need to split them into an array
    if (req.user.roles) {
        req.user.roles = req.user.roles.split(",");
        //if any of the user's groups is included in the roles array, then the user is authorized
        authorised = req.user.roles.some(r => roles.includes(r));

    }
    
    if (!authorised) {
        res.status(403).json({
            success : false,
            message : 'Error: User is not authorized for this',
        })
        return;
    }
    next();
  }
}

exports.validUser = async (req, res, next) => {
  try{
    let token;
    let decoded;

    try{
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    return res.status(400).json({
      success: false,
      message:"Not logged in"
    })
  }
   
  const query ="SELECT * FROM accounts WHERE username =?"
  const result =await pool.query(query, [decoded.username])

  req.user = result [0][0];

  if (req.user.isActive ===0)
  {
    return res.status(400).json({
      success: false,
      message: "invalid user"
    })
  };

  next();
} catch (e) {
  return res.status(500).json({
    success:false,
    message: e
  })
}

}

exports.userPermits = async (req, res, next) => {

let permittedGroup;

const task =req.task;

console.log(req.app)

if(task) {
    switch (task.Task_State) {
      case "Open":
        permittedGroup = req.app.App_permit_Open;
        break;
      case "ToDo":
        permittedGroup = req.app.App_permit_toDoList;
        break;
      case "Doing":
        permittedGroup = req.app.App_permit_Doing;
        break;
      case "Done":
        permittedGroup = req.app.App_permit_Done;
        break;
    }
  } else {
    permittedGroup = req.app.App_permit_Create;
  }

  // Return error if no permitted group specified or user does not have permitted group
  if (!permittedGroup || !req.user.roles.includes(`,${permittedGroup},`)) { //@TOCHECK: if roles is wrong
    
        res.status(403).json({
            success : false,
            message : `Error: User '${req.user.username}' is not authorised`,
        })
        return;
    } else {
        next();
    }
}

exports.getTaskAppInfo = async (req, res, next) => {
  try {
    if (req.body.Task_id) {
        // Get current task_id requested
        const Task_id = req.body.Task_id

        //Check if the required parameter is not provided
        if (!Task_id) {
            res.status(400).json({
            success : false,
            message : 'Error: Task ID must be provided',
            })
            return;
        }

        // Get task current state from DB
        let getTaskQuery = "SELECT * FROM task WHERE `Task_id`=?"
        let getTask = await pool.query(getTaskQuery, Task_id) //potential error
        // Put current task details in request
        req.task = getTask[0][0];

        
        // Get application information from DB
        let getAppQuery ="SELECT * FROM application WHERE `App_Acronym`=?"
        let getApp = await pool.query(getAppQuery, req.task.Task_app_Acronym) //potential error
        
        // Put current app details in request
        req.app = getApp[0][0];
    } 

    if (req.body.Task_app_Acronym) {
        // Get application information from DB
        let getAppQuery ="SELECT * FROM application WHERE `App_Acronym`=?"
        let getApp = await pool.query(getAppQuery, req.body.Task_app_Acronym) //potential error
        // Put current app details in request
        req.app = getApp[0][0];
    }
} catch(e) {
    res.status(500).json({
        success : false,
        message : 'Error: Cannot get task/application',
    })
    return;
}

next();
}