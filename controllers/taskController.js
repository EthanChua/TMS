/*
//@NOTE
//@TODO add error handling to all API
//@TODO implement add audit trail a) userID b) current State (before & after) c) date & timestamp
//@TODO Date Formatting
//@TO Check if can remove plan
*/

const pool = require('../config/database')
const nodemailer=require('nodemailer')

//Create App @TODO Date Formatting
exports.createApp = async (req, res, next)=> {
 const query = "INSERT into application (App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_permit_Open, App_permit_toDOList, App_permit_Doing, App_permit_Done, App_permit_Create) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
 const {App_Acronym, App_Description, App_Rnumber, App_startdate, App_enddate, App_permit_Open, App_permit_toDoList, App_permit_Doing, App_permit_Done, App_permit_Create} = req.body;
  try {

    if(!App_Acronym || !App_Rnumber)
    {
      return res.status(400).json({
        success: false,
        message:"Acronym or R number is missing"
      })
    }

    result = await pool.query(query, [App_Acronym, App_Description, App_Rnumber, App_startdate, App_enddate, App_permit_Open, App_permit_toDoList, App_permit_Doing, App_permit_Done, App_permit_Create])

    if(result[0].affectedRows>0)
    return res.status(200).json({
      success: true,
      message: "Application Created!"
    })

    
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Application creation failed"
    })
  }
};

//Display all App in list
exports.showAllApp= async (req, res, next) => {
  const query ="SELECT * FROM application"

  try{
      const result = await pool.query(query)

      return res.status(200).json({success:true, message:"Apps loaded", data: result[0]})

  } catch (e) {
    return res.status(500).json({success: false, message: e})
  }

};

//Display Single App info
exports.showApp= async (req, res, next) => {
const App_Acronym = req.params.App_Acronym;

try{
  const query="SELECT * FROM application WHERE App_Acronym=?"
  const result= await pool.query(query, App_Acronym)


  if(result[0].length===0)
  {
    return res.status(400).json({
      success:false,
      message:"App not found"
    })
} 
return res.status(200).json({
  success:true,
  message:"App found",
  data: result[0][0]
})
} catch (e) {return res.status(500).json({success: false, message: e})}
};

//Edit Applications @@ Change where we get acronym from
exports.editApp= async (req, res, next) => {
let querystr ="UPDATE application SET "
let values =[]

//Build query string for update
//edit description
if(req.body.App_Description){
  querystr += "App_Description =?, "
  values.push(req.body.App_Description)
} else if (!req.body.App_Description) {
  querystr += "App_Description =?, "
  values.push(null)
}
//edit startdate
if(req.body.App_startDate){
  querystr += "App_startDate =?, "
  values.push(req.body.App_startDate)
} else if (!req.body.App_startDate) {
  querystr += "App_startDate =?, "
  values.push(null)
}
//edit enddate
if(req.body.App_endDate){
  querystr += "App_endDate =?, "
  values.push(req.body.App_endDate)
} else if (!req.body.App_endDate) {
  querystr += "App_endDate =?, "
  values.push(null)
}
//edit permit Open
if(req.body.App_permit_Open){
  querystr += "App_permit_Open =?, "
  values.push(req.body.App_permit_Open)
} else if (!req.body.App_permit_Open) {
  querystr += "App_permit_Open =?, "
  values.push(null)
}

//edit permit todo
if(req.body.App_permit_toDoList){
  querystr += "App_permit_toDoList =?, "
  values.push(req.body.App_permit_toDoList)
} else if (!req.body.App_permit_toDoList) {
  querystr += "App_permit_toDoList =?, "
  values.push(null)
}

//edit permit doing
if(req.body.App_permit_Doing){
  querystr += "App_permit_Doing =?, "
  values.push(req.body.App_permit_Doing)
} else if (!req.body.App_permit_Doing) {
  querystr += "App_permit_Doing =?, "
  values.push(null)
}
//edit permit done
if(req.body.App_permit_Done){
  querystr += "App_permit_Done =?, "
  values.push(req.body.App_permit_Done)
} else if (!req.body.App_permit_Done) {
  querystr += "App_permit_Done =?, "
  values.push(null)
}
//edit permit create
if(req.body.App_permit_Create){
  querystr += "App_permit_Create =?, "
  values.push(req.body.App_permit_Create)
} else if (!req.body.App_permit_Create) {
  querystr += "App_permit_Create =?, "
  values.push(null)
}

querystr = querystr.slice(0, -2)
querystr += " WHERE App_Acronym = ?"
values.push(req.body.App_Acronym)

try{
  const result = await pool.query(querystr, values)

  if(result[0].affectedRows === 0){
    return res.status(500).json({
      success: false,
      message: "App update failed"
    })
  }
  res.status(200).json({
    success: true,
    message:"Application details updated"
  })
}catch (e){return res.status(500).json({success: false, message: e})}
};

//Create Plan @TODO date formatting
exports.createPlan = async (req, res, next)=> {
  const query = "INSERT into plan (Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym) values (?, ?, ?, ?)";
  const {Plan_MVP_name, Plan_startDate=null, Plan_endDate=null, Plan_app_Acronym} = req.body; //@Note: when done app_Acronym get from frontend 
 
     if(!Plan_MVP_name)
     {
       return res.status(400).json({
         success: false,
         message:"Plan Name is Missing"
       })
     }

     if (!Plan_app_Acronym) {
      return res.status(400).json({
        success : false,
        message : 'App Acronym must be provided',
      })
    }

    try{
     result = await pool.query(query, [Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym])
 
     if(result[0].affectedRows>0)
     return res.status(200).json({
       success: true,
       message: `Plan '${Plan_MVP_name}'  Created!`
     })
 
   } catch (e) {
    if(e.errno ===1062){
     return res.status(400).json({success: false, message:`Plan name exist, please rename`})
    }
   }
  
};

//Display all Plan in list
exports.showAllPlan= async (req, res, next)=> {
  const App_Acronym = req.params.App_Acronym
  const query ="SELECT * FROM plan WHERE `Plan_app_Acronym` = ?"

  try{
      const result = await pool.query(query, App_Acronym)

      return res.status(200).json({success:true, message:"Plans loaded", data: result[0]})

  } catch (e) {
    return res.status(500).json({success: false, message: e})
  }

};

//Display single plan details
exports.showPlan= async (req, res, next)=> {
  const {nameMVP} = req.body

  try{
    const query="SELECT * FROM plan WHERE Plan_MVP_name=?"
    const result= await pool.query(query, [nameMVP])
  
    if(result[0].length===0)
    {
      return res.status(400).json({
        success:false,
        message:"Plan not found"
      })
  } 
  return res.status(200).json({
    success:true,
    message:"Plan found",
    data: result[0][0]
  })
  } catch (e) {return res.status(500).json({success: false, message: e})}
};

//Edit plans
exports.editPlan= async(req, res, next)=> {
  let querystr ="UPDATE plan SET "
  let values =[]
  let {Plan_MVP_name, Plan_app_Acronym, Plan_startDate, Plan_endDate} = req.body

  if (!Plan_MVP_name || !Plan_app_Acronym) {
   return res.status(400).json({
      success : false,
      message : 'Plan Name and App Acronym must be provided',
    })
  }


  //Build query string for update
  //edit Plan Start date
  if(Plan_startDate){
    querystr += "Plan_startDate =?, "
    values.push(Plan_startDate)
  } else if (!Plan_startDate) {
    querystr += "Plan_startDate =?, "
    values.push(null)
  }

  //edit Plan End date
  if(Plan_endDate){
    querystr += "Plan_endDate =?, "
    values.push(Plan_endDate)
  } else if (!Plan_endDate) {
    querystr += "Plan_endDate =?, "
    values.push(null)
  }

  //select the row
  querystr = querystr.slice(0, -2)
  querystr += " WHERE Plan_MVP_name = ? AND Plan_app_Acronym = ?"
  values.push(Plan_MVP_name, Plan_app_Acronym)

try{
  const result = await pool.query(querystr, values)

  if(result[0].affectedRows === 0){
    return res.status(500).json({
      success: false,
      message: "Plan update failed"
    })
  }
  res.status(200).json({
    success: true,
    message:`Plan ${Plan_MVP_name} details updated`
  })
}catch (e){ 
  console.log(e) 
  return res.status(500).json({success: false, message: e})}
};

//Create Task @TODO: internal logic to get values
exports.createTask= async(req, res, next)=> {
  const query = "INSERT into task (Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  let {Task_name, Task_description=null, Task_app_Acronym} = req.body; //@TODO: get App_Acronym from frontend, taskCreator from session user
  let taskState="Open", taskID, taskCreateDate, username=req.user.username, taskPlan=null;
  

   try {
     if(!Task_name)
     {
       return res.status(400).json({
         success: false,
         message:"Task Name is missing"
       })
     }

     if (!Task_app_Acronym) {
      return res.status(400).json({
        success : false,
        message : 'App Acronym must be provided',
      })  
    }

     //use App_Acronym and R Number to get Task ID
     let getRnumber = "SELECT * FROM application WHERE App_Acronym =?"
     const [row, fields] = await pool.query(getRnumber, Task_app_Acronym)

     if(row[0]){
     taskID = Task_app_Acronym + "_" + row[0].App_Rnumber
     } else {
      res.status(400).json({
        success: false,
        message: "Application not found"
     })
    }

    //get task Owner and Creator
    let Task_creator = username
    let Task_owner = username

     //get date and time format
    let currentDate = new Date()
    let day = currentDate.getDate()
    let month= currentDate.getMonth() +1
    let year= currentDate.getFullYear()
    let hours= currentDate.getHours()
    let minutes= currentDate.getMinutes()

     taskCreateDate=`${day}-${month}-${year}`
     auditDateTime= `Date: ${day}-${month}-${year} Time: ${hours}:${minutes}`
     
     //audit message into Task Note
     let auditMessage = "Task " + taskID + " created by " + Task_creator + " as Open on " + auditDateTime 
     result = await pool.query(query, [Task_name, Task_description, auditMessage, taskID, taskPlan, Task_app_Acronym, taskState, Task_creator, Task_owner, taskCreateDate])
 
     if(result[0].affectedRows>0) {
      //to increament R number in application table
      let newRNumber=parseInt(row[0].App_Rnumber)
      newRNumber++
      let setNewRNumber = "UPDATE application SET App_Rnumber=? WHERE App_Acronym=?"
      const setNewRNumberResult = await pool.query(setNewRNumber, [newRNumber,Task_app_Acronym])

      return res.status(200).json({
       success: true,
       message: auditMessage
     })
    }
   } catch (e) {
    console.log(e)
     return res.status(400).json({
       success: false,
       message: e
     })
   }
};

//Show All Task
exports.showAllTask= async(req,res, next)=> {
  const App_Acronym = req.params.App_Acronym
  const query ="SELECT * FROM task WHERE `Task_app_Acronym` = ?"

  try{
      const result = await pool.query(query, App_Acronym)

      return res.status(200).json({success:true, message:"Tasks loaded", data: result[0]})

  } catch (e) {
    return res.status(500).json({success: false, message: e})
  }
};

//Show Task Details
exports.showTask= async(req, res, next)=> {
  const Task_id = req.params.Task_id

  if (!Task_id) {
   return res.status(400).json({success : false, message : 'Task ID is missing',
    })
  }

  try{
    const query="SELECT * FROM task WHERE Task_id=?"
    const result= await pool.query(query, Task_id)
  
    if(result[0].length===0)
    {
      return res.status(400).json({
        success:false,
        message:"Task not found"
      })
  } 
  return res.status(200).json({
    success:true,
    message:"Task found",
    data: result[0] //maybe remove array
  })
  } catch (e) {
    console.log(e) 
    return res.status(500).json({success: false, message: e})}
};

//Assign Plan @TODO to add if add notes
exports.assignPlan= async(req, res, next)=> {
const username= req.user.username
const Task_id = req.body.Task_id
let querystr ="UPDATE task SET ", values =[], auditMessage, New_notes= req.body.New_notes

if(req.task.Task_state != "Open"){
  return res.status(403).json({
    success: false,
    message: `Task state is ${req.task.Task_state}, cannot assign plan`
  })
}

  if(req.body.Task_plan){
    querystr += "Task_plan =?, "
    values.push(req.body.Task_plan)
  } else if (!req.body.Task_plan) {
    querystr += "Task_plan =?, "
    values.push(null)
  }

  querystr += "Task_owner =?, "
  values.push(username)
  
  querystr = querystr.slice(0, -2)
  querystr += " WHERE Task_id = ?"
  values.push(Task_id)

  try{
    const result = await pool.query(querystr, values)
    if(result[0].affectedRows>0){
      //get Date Time format
      let currentDate = new Date()
      let day = currentDate.getDate()
      let month= currentDate.getMonth() +1
      let year= currentDate.getFullYear()
      let hours= currentDate.getHours()
      let minutes= currentDate.getMinutes()
      auditDateTime= `Date: ${day}-${month}-${year} Time: ${hours}:${minutes}`
      
      //get task state @TODO: to refactor
      const getTaskStateQ = "SELECT * FROM task WHERE Task_id =? "
      const [row, fields]= await pool.query(getTaskStateQ, Task_id)
      const taskState = row[0].Task_state

      getTask_plan= req.body.Task_plan
      if(getTask_plan){
        auditMessage = `${username} assigned a plan ${getTask_plan} to ${Task_id} on ${auditDateTime}, task state was ${taskState} \n `
      } else if (!getTask_plan) {
        auditMessage = `${username} removed plan from ${Task_id} on ${auditDateTime}, task state was ${taskState} \n `
      }
      const auditInsert = "UPDATE task SET Task_notes= CONCAT(?, Task_notes) WHERE Task_id=? "
      const auditResult = pool.query(auditInsert, [auditMessage, Task_id])
      
      return res.status(200).json({
      success: true,
      message: auditMessage
      })
    }

    return res.status(500).json({
      success: false,
      message: "Assign Plan failed"
    })

  } catch (e) {
    console.log(e)
    if(e.errno === 1452){
      return res.status(400).json({success: false, message:`Plan ${getTask_plan} doesn't exist`})
     }
    
    return res.status(500).json({success: false, message: e})}

}


//EditTask:Add Notes without promoting or demoting
exports.editTask=async(req,res,next)=> {
const username= req.user.username
const Task_id= req.body.Task_id
let noteAdded= false, querystr ="UPDATE task SET ", values =[], auditMessage

  if(req.body.New_notes){
    querystr += "Task_notes = CONCAT(?, Task_notes), "
    values.push("Note: "+ req.body.New_notes + "\n")
    noteAdded= true
  } 
  //edit Task Owner inaccordance with last touch policy
  querystr += "Task_owner =?, "
  values.push(username)
  
  querystr = querystr.slice(0, -2)
  querystr += " WHERE Task_id = ?"
  values.push(Task_id)
  try{
    const result = await pool.query(querystr, values)
  
    if(result[0].affectedRows>0){
    //get Date Time format
    let currentDate = new Date()
    let day = currentDate.getDate()
    let month= currentDate.getMonth() +1
    let year= currentDate.getFullYear()
    let hours= currentDate.getHours()
    let minutes= currentDate.getMinutes()
    auditDateTime= `Date: ${day}-${month}-${year} Time: ${hours}:${minutes}`

    //get task state
    const getTaskStateQ = "SELECT * FROM task WHERE Task_id =? "
    const [row, fields]= await pool.query(getTaskStateQ, Task_id)

    const taskState = row[0].Task_state

    auditMessage = `${username} added a note on ${auditDateTime}, task state was ${taskState} \n `

    const auditInsert = "UPDATE task SET Task_notes= CONCAT(?, Task_notes) WHERE Task_id=? "
    const auditResult = pool.query(auditInsert, [auditMessage, Task_id])
    return res.status(200).json({
      success: true,
      message: auditMessage
      })
    }

    return res.status(500).json({
      success: false,
      message: "Task update failed"
    })
  }catch (e){
    console.log(e)
    return res.status(500).json({success: false, message: e})}
};

//Promote @TODO: get username from cookie
exports.promoteTask = async(req, res, next) => { 
  const Task_id = req.task.Task_id
  const Task_owner = req.user.username
  //let selectTask ="SELECT Task_state FROM task WHERE Task_id =?" //check if task exist and retrieve task_state
  let {New_notes}=req.body

  try{
    //const [row, fields]= await pool.query(selectTask, taskID)
    //let taskState = row[0].Task_state
    let Task_state = req.task.Task_state
    let newtaskState, sendEmail= false

//Task States: "Open"->"ToDo"->"Doing"->"Done"->"Closed"
    switch (Task_state) {
      case "Open":
        newtaskState = "ToDo"
        break;
      case "ToDo":
        newtaskState = "Doing"
        break;
      case "Doing":
        newtaskState = "Done"
        sendEmail= true
        break;
      case "Done":
        newtaskState = "Close"
        break;
      case "Close":
        return res.json({success: false, message:"Task already closed"})
      default:
        return res.status(403).json({success: false, message:"Task cannot be promoted"})
    }
  
    const promote= "UPDATE task SET Task_state= ?, Task_owner= ? WHERE Task_id=?"
    const result = await pool.query(promote, [newtaskState, Task_owner, Task_id]);

    //get Date Time format
    let currentDate = new Date()
    let day = currentDate.getDate()
    let month= currentDate.getMonth() +1
    let year= currentDate.getFullYear()
    let hours= currentDate.getHours()
    let minutes= currentDate.getMinutes()

    auditDateTime= `Date: ${day}-${month}-${year} Time: ${hours}:${minutes}`

    if(result[0].affectedRows>0) {
    let auditMessage = Task_owner + " promoted " + Task_state + " to " + newtaskState + " on " + auditDateTime + " \n " //@TODO get user from token
    //Attach Note if exist
      if(New_notes !=null && New_notes != ""){
        auditMessage = auditMessage += "Note: "+ New_notes + " \n "
      }
    const auditUpdate = `UPDATE task SET Task_notes = CONCAT(?, Task_notes) WHERE Task_id=?`
    const auditUpdateResult= await pool.query(auditUpdate, [auditMessage, Task_id])
    //sendEmail=false //@TODO Remove when presenting
      if(sendEmail){
        console.log(auditMessage, "Send Email to project lead")
        
        let transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
              user : process.env.SMTP_EMAIL,
              pass : process.env.SMTP_PASSWORD
          }
        })

        let message ={
          from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
          to: process.env.SMTP_TO_EMAIL,
          subject: `Task Done`,
          text: `${Task_id} promoted to Done`
        };
      
      
      transporter.sendMail(message, function(error, info) {
        if (error){
          console.log(error)
        } else {
          console.log("Email Sent to Project Lead")
        }
      });

    }

    return res.status(200).json({
      success: true,
      message: auditMessage
    })
  }
  
} catch (e) {
  console.log("Promote error", e)
  return res.status(400).json({success: false, message: e})}
  
  
};

//Demote 
exports.demoteTask = async(req, res, next) => {
  const Task_id = req.task.Task_id 
  const Task_owner = req.user.username
  //let selectTask ="SELECT Task_state FROM task WHERE Task_id =?" //check if task exist and retrieve task_state
  let {New_notes, Task_plan=null}=req.body

  try{
    //const [row, fields]= await pool.query(selectTask, taskID)
    let Task_state = req.task.Task_state
    let newtaskState
//Task States: "Closed"->"Done"->"Doing"->"To Do"->"Open"
    switch (Task_state) {
      case "Done":
        newtaskState = "Doing"
        break;
      case "Doing":
        newtaskState = "ToDo"
        break;
      case "ToDo":
        return res.json({success: false, message:"Task cannot be demoted to open"})
      case "Close":
        return res.json({success: false, message:"Closed task cannot be demoted"})
      case "Open":
        return res.json({success: false, message:"Task at Open cannot be demoted further"})
    }
  
    const demote= "UPDATE task SET Task_state= ?, Task_owner= ?, Task_plan =? WHERE Task_id=?"
    const result = await pool.query(demote, [newtaskState, Task_owner, Task_plan, Task_id]);

    //get Date Time format
    let currentDate = new Date()
    let day = currentDate.getDate()
    let month= currentDate.getMonth() +1
    let year= currentDate.getFullYear()
    let hours= currentDate.getHours()
    let minutes= currentDate.getMinutes()
    
    auditDateTime= `Date: ${day}-${month}-${year} Time: ${hours}:${minutes}`

    if(result[0].affectedRows>0) {
    let auditMessage = Task_owner + " demoted " + Task_state + " to " + newtaskState + " on " + auditDateTime + "\n " 
      //Attach Note if exist
      if(New_notes !=null && New_notes != ""){
        auditMessage = auditMessage += "Note: "+ New_notes + " \n "
      }
    const auditUpdate = `UPDATE task SET Task_notes = CONCAT(?, Task_notes) WHERE Task_id=?`
    const auditUpdateResult= await pool.query(auditUpdate, [auditMessage, Task_id])
    return res.status(200).json({
      success: true,
      message: auditMessage
    })
  }
} catch (e) {
  console.log("Demote error", e)
  return res.status(400).json({success: false, message: e})}
  
  
};



