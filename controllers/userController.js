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

//Create User function, @TODO JWT, cookies
exports.createUser = async (req, res, next)=> {
  const { username, password, email= null, roles= null, isActive= 1} = req.body;
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
exports.aUserEdit = async (req, res, next)=> {
  const { username } = req.body;
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"~\\|,.<>\/?]{8,10}$/;

  try {
    if (username != null) {
      const query = 'SELECT * FROM accounts WHERE username=?';
      const [rows, fields] = await pool.query(query, [username]);
      let selectedUser;
      
          if (rows.length > 0) {
            selectedUser = {
              username: username,
              password: rows[0].password
            };
          } 
    } else {
        return res.json({
        success: false,
        message: "Username is empty"});
    }

  } catch (e){return res.json({error: e})};
};

//User edit User function
exports.uUserEdit = async (req, res, next)=> {
  //query to update user, 
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
  } catch (e) {

  }
 
};

//functions
const Checkgroup = async (userid, groupname) => {
 const query=`SELECT roles FROM accounts WHERE username ? AND roles LIKE ?`;
 const values = [userid, `%${groupname}%`]

 const result = await pool.query(query, [values]);
 return result.length >0 ;
};

//const getJwtToken = ()

//cookies can't store anything else only username, only can have 1 instance
/* template
exports.aUserEdit = async (req, res, next)=> {
  const { username } = req.body;
  
  try {

  } catch (e){return res.json({error: e})};
};
*/



