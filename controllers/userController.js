/*
//@note: spacebar check, include notify user no spacebar
//@TODO: implement group_list, refactor functions, put in correct error messages
//@TODO: implement errorhandling
*/
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Login function @TODO @TOCHECK
exports.userlogin = async (req, res, next)=> {
    const { username, password } = req.body;

    try {
      if (username != null && password != null) { //factor in blank fields revise
        const query = 'SELECT * FROM accounts WHERE username=? AND isActive=1';
        const result = await pool.query(query, [username]);
        let user;
        
            if (result.length > 0) {
              user = result[0][0];
            }

            if (password === user.password) { // *IMPT* in final <checkPassword = await bcrypt.compare(password,user.password)>
              return sendToken(user,200, res);
            } else {
              return res.json({
                success: false,
                message: "Invalid username or password"});
            }
        } else {
          return res.json({
            success: false,
            message: "Username or Password field is empty"});
        }
        
    }
    catch (e){ return res.json({error: e.stack})};
};

//Logout function @DONE
exports.log_out = async (req, res) => {
  //remove cookie
  res.clearCookie ('token').end();
  
}

//Create User function, @TODO @TOCHECK
exports.createUser = async (req, res, next)=> {
  const { username, password, email= null, roles= null, isActive= 1} = req.body;
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?]{8,10}$/;

  try{
      if (username !=null && password!= null){
        if(regex.test(password)){
          const query = "INSERT INTO accounts (username, password, email, `roles`, isActive) values (?, ?, ?, ?, ?)";
          
          const hashP= await bcrypt.hash(password, 10);
          result = await pool.query(query, [username, hashP, email, roles, isActive]);
            
          return res.json({
            success: true,
            message: "Account created"
          });
        }
        else {
            res.json({error: 'Password does not meet criteria!'});
        }
    } else {
      return res.json({error: 'Either Username or Password is missing'})
    }
  } catch (e){return res.json({error: e})};
};

//admin edit User function @TOCHECK
exports.userEdit = async (req, res, next)=> {
  const { username, password, email, roles, isActive } = req.body;
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?]{8,10}$/;
  let emailChanged, passwordChanged, rolesChanged, statusChanged;

  try {
    // Check is user exist
    const checkUserExist = "SELECT * FROM accounts WHERE username= ?"; 
    const [row, fields] = await pool.query(checkUserExist,[username]);
    
    if (row.length===(0)){
      return res.json({
        success: false,
        message:"user not found"
      })
    }
    //email change
    if(email != null && email != ""){
      emailChanged = await changeEmail(username, email);
    }
    //password change
    if(password != null && password !=""){
      if(regex.test(password)){
        const hashedPassword = await bcrypt.hash(password, 10);
        passwordChanged = await changePassword(username, hashedPassword);
      } else {
        return res.json ({
          success: false,
          message: "Error: Password must be 8-10 characters long, with at least 1 letter, 1 alphabet and 1 special character "
        })
      }
    }
    //roles change, groupname, grouplist to implement
    if(roles != null && roles != ""){
      const query= `UPDATE accounts SET roles = ? WHERE username =?`;
      try{
        const result = await pool.query(query, [roles, username]);
        rolesChanged= result[0].affectedRows;
        } catch (e) {return res.json({error: e})}
    }

    // change user status
    if(isActive != null && isActive !=""){
      const query= `UPDATE accounts SET isActive = ? WHERE username =?`;
      try{
        if(isActive === "1" || isActive === "0"){
          const result = await pool.query(query, [isActive, username]);
          statusChanged= result[0].affectedRows;
        } else {return res.status(400).json({success: false, message:"invalid status"})}
      } catch (e) {return res.json({error: e})}
    }

     //Notify user if changes updated
     if(emailChanged || passwordChanged || rolesChanged || statusChanged){
      return res.status(200).json ({
        success: true,
        message: "Profile updated"
      })
    } else {
      return res.json ({
        success: false,
        message: "Update Failed"
      })
    }
  } catch (e){return res.status(500).json({success: false, message: e});}
};

//to get user info
exports.getUser = async (req, res, next)=> {
  const {username} = req.user.username;

  try{
    const query="SELECT username, email, roles FROM accounts WHERE username =?";
    const result = await pool.query(query, [username])

    return res.status(200).json({
      success:true,
      message: "user details found",
      data: result[0][0]
    });
  } catch(e) {
    return res.status(500).json({
      success:false,
      message: e
    })
  }
};

//User edit User function @TOCHECK
exports.userUpdate = async (req, res, next)=> {
  const { email, password} = req.body;
  const username = req.user.username;
  const user = req.user
  
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?]{8,10}$/;
  let emailChanged, passwordChanged;

  try{
    if(email != null && email != ""){
      emailChanged = await changeEmail(username, email);
    }

    if(password != null && password !=""){
      if(regex.test(password)){
        const hashedPassword = await bcrypt.hash(password, 10);
        passwordChanged = await changePassword(username, hashedPassword);

      } else {
        return res.json ({
          success: false,
          message: "Error: Password must be 8-10 characters long, with at least 1 letter, 1 alphabet and 1 special character "
        })
      }
    }
    //Notify user if changes updated
    if(emailChanged || passwordChanged){
     return sendToken(user,200, res); //revise
    } else {
      return res.json ({
        success: false,
        message: "Update Failed"
      })
    }
  } catch (e) { 
    return res.status(500).json({
      success: false,
      message: e
    });
    }
};

//Display all user into admin dashboard @DONE
exports.showAllUser = async (req, res, next)=> {

  //const {username} = req.body.username; ERROR here
  try{
    const query = "SELECT username, email, roles, isActive FROM accounts"
    const result = await pool.query(query);
  

    return res.status(200).json({
      success:true,
      message:"user details loaded",
      data: result[0]
    });
    
  } catch(e) {
    res.status(500).json({
      success:false,
      message: e
    });
    return;
  }
};

//Checkgroup API @TOCHECK
exports.Checkgroup = async (req, res, next)=> {
  try{
    const authorized = await Checkgroup(req.body.username, req.body.usergroup)

    return res.json({
      usergroup: authorized
    })
  } catch (e) { return res.json({error: e}) }
};

//Create user groups @DONE
exports.createGroup = async (req, res, next)=> {
  const { groupName } =req.body;
  const groupRegex = /^[0-9a-zA-Z]+$/
  
  if (!groupRegex.test(groupName)) {
    res.status(400).json({
      success:false,
      message:"Group name should not have space, only numbers and alphabets"
    })
    return;
  }

  try{
    const query = "INSERT INTO group_list (groupName) values (?)"
    const result = await pool.query(query, [groupName]);

    if (result[0].affectedRows ===0) {
      res.status(500).json({
        success: false,
        message: "Unable to create user group"
      })
      return;
    };

    return res.status(200).json({
      success:true,
      message: "Group Created"
    })

  } catch(e) {
      if(e.code ==="ER_DUP_ENTRY") {
        res.status(500).json({
          success: false,
          message: `'${groupName}' already exists` 
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: e
      });
      return;
  }
};

exports.getGroups = async (req, res, next) => {
    try{
        const query= "SELECT groupName FROM group_list"
        const result = await pool.query(query)

        return res.status(200).json({
          success: true,
          message:"retrieved group names",
          data: result[0]
        });
      } catch (e) {
      return res.status(500).json({
        success:false,
        message: e
      });
    }
};

//functions @TODO: solve admin is in a all usergroup issue
async function Checkgroup(userid, groupname) {
  
  const query=`SELECT roles FROM accounts WHERE username = ? AND roles LIKE ?`;
  const result = await pool.query(query, [userid, `%${groupname}%`]);
  if(result[0][0]){
    return true;
  } else {
    return false;
  }
};

//changeEmail and Password could combine into api
async function changeEmail(username, email) {
  
  const query= `UPDATE accounts SET email = ? WHERE username =?`;
  try{
  const result = await pool.query(query, [email, username]);
  return result[0].affectedRows;
  } catch (e) {return res.json({error: e})}
};

async function changePassword(username, password) {
  const query= `UPDATE accounts SET password =? WHERE username=?`;
  try{
    const result = await pool.query(query, [password, username]);
    return result[0].affectedRows;
  } catch (e) {return res.json({error: e})}
};

const sendToken = (user, statusCode, res) => {
  //Create JWToken
  console.log(user)
  const token = jwt.sign({username: user.username}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });//getJwtToken(user);

  const options = {
    expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 *1000),
    httpOnly:true
  };
  //ask about cookie parser
  return res 
      .status(statusCode)
      .cookie('token', token, options)
      .json({
          success: true,
          token,
          username: user.username
          //group_list:user.group_list
  })
};

/*
//JWT note the user object
const getJwtToken = user =>{
  return jwt.sign({username: user.username}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
}
*/


//@TODO 
exports.checkLogin = async (req, res, next)=> {
  let decoded;
  let token;
  const query = 'SELECT * FROM accounts WHERE username =?';
    

    if(token === "null" || !token) {
      return false;
    }

    try {
      decoded = jwt.verify(token,process.env.JWT_SECRET);
      
  } catch (err) {
      return false;
  }
      
  const [row, fields] = await pool.query(query, [decoded.username]);
  const user = row[0];
  if (user != undefined || user.isActive === 0)
  {
    return false;
  }
  return true;


};





