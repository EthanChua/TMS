/*
//@NOTE
//@TODO add error handling to all API
//@TODO implement add audit trail a) userID b) current State (before & after) c) date & timestamp // to call date time Date()
*/

const pool = require('../config/database');

//Create App
exports.createApp = async (req, res, next)=> {
 const query = "INSERT into application (App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_permit_Open, App_permit_toDOList, App_permit_Doing, App_permit_Done, App_permit_Create) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
 const {acronym, description, rnumber, startdate, enddate, permitOpen, permitTODO, permitDoing, permitDone, permitCreate} = req.body;
  try {

    if(!acronym || !rnumber)
    {
      return res.status(400).json({
        success: false,
        message:"Acronym or R number is missing"
      })
    }

    result = await pool.query(query, [acronym, description, rnumber, startdate, enddate, permitOpen, permitTODO, permitDoing, permitDone, permitCreate])

    if(result[0].affectedRows>0)
    return res.status(200).json({
      success: true,
      message: "Application Created!"
    })

    
  } catch (e) {
    console.log(e, "create application failed")
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
const {acronym} = req.body

try{
  const query="SELECT * FROM application WHERE App_Acronym=?"
  const result= await pool.query(query, [acronym])

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

//Edit Applications //change where we get acronym from
exports.editApp= async (req, res, next) => {
let querystr ="UPDATE application SET "
let values =[]

//Build query string for update
//edit description
if(req.body.description){
  querystr += "App_Description =?, "
  values.push(req.body.description)
} else if (req.body.description === undefined) {
  querystr += "App_Description =?, "
  values.push(null)
}
//edit startdate
if(req.body.startdate){
  querystr += "App_startDate =?, "
  values.push(req.body.startdate)
} else if (req.body.startdate === undefined) {
  querystr += "App_startDate =?, "
  values.push(null)
}
//edit enddate
if(req.body.enddate){
  querystr += "App_endDate =?, "
  values.push(req.body.enddate)
} else if (req.body.enddate=== undefined) {
  querystr += "App_endDate =?, "
  values.push(null)
}
//edit permit Open
if(req.body.permitOpen){
  querystr += "App_permit_Open =?, "
  values.push(req.body.permitOpen)
} else if (req.body.permitOpen === undefined) {
  querystr += "App_permit_Open =?, "
  values.push(null)
}

//edit permit todo
if(req.body.permitTODO){
  querystr += "App_permit_toDoList =?, "
  values.push(req.body.permitTODO)
} else if (req.body.permitTODO === undefined) {
  querystr += "App_permit_toDoList =?, "
  values.push(null)
}

//edit permit doing
if(req.body.permitDoing){
  querystr += "App_permit_Doing =?, "
  values.push(req.body.permitDoing)
} else if (req.body.permitDoing === undefined) {
  querystr += "App_permit_Doing =?, "
  values.push(null)
}
//edit permit done
if(req.body.permitDone){
  querystr += "App_permit_Done =?, "
  values.push(req.body.permitDone)
} else if (req.body.permitDone === undefined) {
  querystr += "App_permit_Done =?, "
  values.push(null)
}
//edit permit create
if(req.body.permitCreate){
  querystr += "App_permit_Create =?, "
  values.push(req.body.permitCreate)
} else if (req.body.permitCreate === undefined) {
  querystr += "App_permit_Create =?, "
  values.push(null)
}

querystr = querystr.slice(0, -2)
querystr += " WHERE App_Acronym = ?"
values.push(req.body.acronym)

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

//Create Plan
exports.createPlan = async (req, res, next)=> {
  const query = "INSERT into plan (Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym) values (?, ?, ?, ?)";
  const {nameMVP, startdate, enddate, app_Acronym} = req.body; //@Note: when done app_Acronym get from frontend 
   try {
 
     if(!nameMVP)
     {
       return res.status(400).json({
         success: false,
         message:"MVP Name is Missing"
       })
     }
 
     result = await pool.query(query, [nameMVP, startdate, enddate, app_Acronym])
 
     if(result[0].affectedRows>0)
     return res.status(200).json({
       success: true,
       message: "Plan Created!"
     })
 
     
   } catch (e) {
     return res.status(400).json({success: false, message:e})
   }
};

//Display all Plan in list
exports.showAllPlan= async (req, res, next)=> {
  const query ="SELECT * FROM plan"

  try{
      const result = await pool.query(query)

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
  
  //Build query string for update
  //edit Plan Start date
  if(req.body.startdate){
    querystr += "Plan_startDate =?, "
    values.push(req.body.startdate)
  } else if (req.body.startdate === undefined) {
    querystr += "Plan_startDate =?, "
    values.push(null)
  }
  //edit Plan End date
  if(req.body.enddate){
    querystr += "Plan_endDate =?, "
    values.push(req.body.enddate)
  } else if (req.body.enddate === undefined) {
    querystr += "Plan_endDate =?, "
    values.push(null)
  }

  //select the row
  querystr = querystr.slice(0, -2)
  querystr += " WHERE Plan_MVP_name = ?"
  values.push(req.body.nameMVP)

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
    message:"Plan details updated"
  })
}catch (e){return res.status(500).json({success: false, message: e})}
};

//Create Task @TODO: internal logic to get values
exports.createTask= async(req, res, next)=> {
  const query = "INSERT into task (Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const {taskName, taskDescription, taskPlan, taskCreator, appAcronym} = req.body; //@TODO: get App_Acronym from frontend, taskCreator from session user
  let taskAppAcronym= appAcronym, taskState="Open", taskID, taskCreateDate, taskOwner=taskCreator
 
   try {
     if(!taskName || !taskCreator)
     {
       return res.status(400).json({
         success: false,
         message:"One or more of these fields are missing: Task Name, Task Creator"
       })
     }

     //Get App_Acronym and R Number to get Task ID
     let getRnumber = "SELECT * FROM application WHERE App_Acronym =?"
     const [row, fields] = await pool.query(getRnumber, appAcronym)
     
     taskID = appAcronym + "_" + row[0].App_Rnumber
     console.log(taskID)

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
     let auditMessage = "Task " + taskID + " created by " + taskCreator + " as Open on " + auditDateTime //Task creator to get from session
     result = await pool.query(query, [taskName, taskDescription, auditMessage, taskID, taskPlan, taskAppAcronym, taskState, taskCreator, taskOwner, taskCreateDate])
 
     if(result[0].affectedRows>0) {
      //to increament R number in application table
      let newRNumber=parseInt(row[0].App_Rnumber)
      newRNumber++
      console.log(newRNumber, "New R Number")
      let setNewRNumber = "UPDATE application SET App_Rnumber=? WHERE App_Acronym=?"
      const setNewRNumberResult = await pool.query(setNewRNumber, [newRNumber,appAcronym])

      return res.status(200).json({
       success: true,
       message: auditMessage
     })
    }
   } catch (e) {
     console.log(e, "create application failed")
     return res.status(400).json({
       success: false,
       message: e
     })
   }
};

//Show All Task
exports.showAllTask= async(req,res, next)=> {
  const query ="SELECT * FROM task"

  try{
      const result = await pool.query(query)

      return res.status(200).json({success:true, message:"Tasks loaded", data: result[0]})

  } catch (e) {
    return res.status(500).json({success: false, message: e})
  }
};

//Show Task Details
exports.showTask= async(req, res, next)=> {
  const {taskID} = req.body

  try{
    const query="SELECT * FROM task WHERE Task_id=?"
    const result= await pool.query(query, [taskID])
  
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
    data: result[0][0]
  })
  } catch (e) {return res.status(500).json({success: false, message: e})}
};

//EditTask: either Add or change plan or add Notes without promoting or demoting
exports.editTask=async(req,res,next)=> {
const {username, taskID} = req.body
let planChanged= false, noteAdded= false, querystr ="UPDATE task SET ", values =[], auditMessage

  //edit Task Plan
  if(req.body.taskPlan){
    querystr += "Task_plan =?, "
    values.push(req.body.taskPlan)
    planChanged= true
  } else if (req.body.taskPlan === undefined) {
    querystr += "Task_plan =?, "
    values.push(null)
  }

  if(req.body.userNote){
    querystr += "Task_notes = CONCAT(?, Task_notes), "
    values.push("Note: "+ req.body.userNote + "\n")
    noteAdded= true
  } 


  //edit Task Owner inaccordance with last touch policy
  querystr += "Task_owner =?, "
  values.push(username)
  
  querystr = querystr.slice(0, -2)
  querystr += " WHERE Task_id = ?"
  values.push(taskID)
  
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
    
    if (planChanged && noteAdded){
      auditMessage = `${username} made plan changes and added a note on ${auditDateTime} \n`
    } else if (noteAdded){
      auditMessage = `${username} added a note on ${auditDateTime} \n `
    } else if (planChanged){
      auditMessage = `${username} made plan changes on ${auditDateTime} \n `
    }

    const auditInsert = "UPDATE task SET Task_notes= CONCAT(?, Task_notes) WHERE Task_id=? "
    const auditResult = pool.query(auditInsert, [auditMessage, taskID])
    return res.status(200).json({
      success: true,
      message: auditMessage
      })
    }
    return res.status(500).json({
      success: false,
      message: "Task update failed"
    })
  }catch (e){return res.status(500).json({success: false, message: e})}
};

//Promote @TODO: get username from cookie
exports.promoteTask = async(req, res, next) => { 
  const {taskID, username} = req.body
  let selectTask ="SELECT Task_state FROM task WHERE Task_id =?" //check if task exist and retrieve task_state

  try{
    const [rows, fields]= await pool.query(selectTask, taskID)
    let taskState = rows[0].Task_state
    let newtaskState, sendEmail= false

//Task States: "Open"->"ToDo"->"Doing"->"Done"->"Closed"
    switch (taskState) {
      case "Open":
        newtaskState = "To Do"
        break;
      case "To Do":
        newtaskState = "Doing"
        break;
      case "Doing":
        newtaskState = "Done"
        sendEmail= true
        break;
      case "Done":
        newtaskState = "Closed"
        break;
      case "Closed":
        return res.json({success: false, message:"Task already closed"})
    }
  
    const promote= "UPDATE task SET Task_state= ?, Task_owner= ? WHERE Task_id=?"
    const result = await pool.query(promote, [newtaskState, username, taskID]);

    //get Date Time format
    let currentDate = new Date()
    let day = currentDate.getDate()
    let month= currentDate.getMonth() +1
    let year= currentDate.getFullYear()
    let hours= currentDate.getHours()
    let minutes= currentDate.getMinutes()

    auditDateTime= `Date: ${day}-${month}-${year} Time: ${hours}:${minutes}`

    if(result[0].affectedRows>0) {
    let auditMessage = username + " promoted " + taskState + " to " + newtaskState + " on " + auditDateTime + " \n " //@TODO get user from token
    //Attach Note if exist
      if(req.body.userNote !=null && req.body.userNote != ""){
        auditMessage = auditMessage += "Note: "+ req.body.userNote + " \n "
      }
    const auditUpdate = `UPDATE task SET Task_notes = CONCAT(?, Task_notes) WHERE Task_id=?`
    const auditUpdateResult= await pool.query(auditUpdate, [auditMessage, taskID])
      if(sendEmail){
        console.log(auditMessage, "Send Email to project lead")
      }
    return res.status(200).json({
      success: true,
      message: auditMessage
    })
  }
} catch (e) {return res.status(400).json({success: false, message: e})}
  
  
};

//Demote @TODO: get username from cookie
exports.demoteTask = async(req, res, next) => {
  const {taskID, username} = req.body
  let selectTask ="SELECT Task_state FROM task WHERE Task_id =?" //check if task exist and retrieve task_state

  try{
    const [rows, fields]= await pool.query(selectTask, taskID)
    let taskState = rows[0].Task_state
    let newtaskState
//Task States: "Closed"->"Done"->"Doing"->"To Do"->"Open"
    switch (taskState) {
      case "Done":
        newtaskState = "Doing"
        break;
      case "Doing":
        newtaskState = "To Do"
        break;
      case "To Do":
        return res.json({success: false, message:"Task cannot be demoted to open"})
      case "Closed":
        return res.json({success: false, message:"Closed task cannot be demoted"})
      case "Open":
        return res.json({success: false, message:"Task at Open cannot be demoted further"})
    }
  
    const demote= "UPDATE task SET Task_state= ?, Task_owner= ? WHERE Task_id=?"
    const result = await pool.query(demote, [newtaskState, username, taskID]);

    //get Date Time format
    let currentDate = new Date()
    let day = currentDate.getDate()
    let month= currentDate.getMonth() +1
    let year= currentDate.getFullYear()
    let hours= currentDate.getHours()
    let minutes= currentDate.getMinutes()
    
    auditDateTime= `Date: ${day}-${month}-${year} Time: ${hours}:${minutes}`

    if(result[0].affectedRows>0) {
    let auditMessage = username + " demoted " + taskState + " to " + newtaskState + " on " + auditDateTime + "\n " //@TODO get user from token
      //Attach Note if exist
      if(req.body.userNote !=null && req.body.userNote != ""){
        auditMessage = auditMessage += "Note: "+ req.body.userNote + " \n "
      }
    const auditUpdate = `UPDATE task SET Task_notes = CONCAT(?, Task_notes) WHERE Task_id=?`
    const auditUpdateResult= await pool.query(auditUpdate, [auditMessage, taskID])
    return res.status(200).json({
      success: true,
      message: auditMessage
    })
  }
} catch (e) {return res.status(400).json({success: false, message: e})}
  
  
};

//Assign Task
//Send email

/*
exports.functionName = async (req, res, next)=> {

  try {} catch (e) {}
};
*/


