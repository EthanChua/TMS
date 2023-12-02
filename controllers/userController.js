const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Login function
exports.userlogin = async (req, res, next)=> {
    const { username, password } = req.body;

    try {
      if (username != null && password != null) {
        const query = 'SELECT * FROM accounts WHERE username=? AND isActive=1';
        const [rows, fields] = await pool.query(query, [username]);
        let logged_User;
        
            if (rows.length > 0) {
              logged_User = {
                username: username,
                password: rows[0].password
              };
            }

            if (checkPassword = await bcrypt.compare(password,logged_User.password)) {
              return res.json({
                success: true,
                message: "Successful log in",
                data: { username }
              });

            } else {
              return res.json({
                success: false,
                message: "wrong username or password"});
            }
              //console.log(logged_User);
        } else {
          return res.json({
            success: false,
            message: "Username or Password field is empty"});
        }
    }
    catch (e){ return res.json({error: e})};
};

//Logout function
exports.log_out = async (req, res) => {
  //remove cookie
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  //return log out sucess response
  res.status(200).json({
    success: true,
    message: 'logged out'
  })
}

//Create User function, @TODO JWT, cookies
exports.createUser = async (req, res, next)=> {
  const { username, password, email= null, roles= 'user', isActive= 1} = req.body;
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?]{8,10}$/;

  try{
      if (username !=null && password!= null){
        if(regex.test(password)){
          const query = 'INSERT INTO accounts (username, password, email, roles, isActive) values (?, ?, ?, ?, ?)';
          
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

//admin edit User function * not done
exports.userEdit = async (req, res, next)=> {
  const { username, password, email, roles,  } = req.body;
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?]{8,10}$/;

  try {

  } catch (e){return res.json({error: e})};
};

//User edit User function
exports.userUpdate = async (req, res, next)=> {
  const { username, email, password} = req.body;
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
      return res.status(200).json ({
        success: true,
        message: "Profile updated"
      })
    } else {
      return res.json ({
        success: false,
        message: "nothing to update"
      })
    }
  } catch (e) { return res.json({error: e}) }
};

//Display all user into admin dashboard
exports.showAllUser = async (req, res, next)=> {

};

//Checkgroup API
exports.Checkgroup = async (req, res, next)=> {
  try{
    const authorized = await Checkgroup(req.body.username, req.body.usergroup)

    return res.json({
      usergroup: authorized
    })
  } catch (e) { return res.json({error: e}) }
};

//functions @TODO: solve admin is in a all usergroup issue
async function Checkgroup(userid, groupname) {
  
  const query=`SELECT roles FROM accounts WHERE username = ? AND roles LIKE ?`;
  const result = await pool.query(query, [userid, `%${groupname}%`]);
  console.log(result[0]);
  return result[0].length >0 ;
};

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
}

//const getJwtToken = ()

//cookies can't store anything else only username, only can have 1 instance
/* template
exports.aUserEdit = async (req, res, next)=> {
  const { username } = req.body;
  
  try {

  } catch (e){return res.json({error: e})};
};
*/



