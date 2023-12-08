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
};



 /*
  try{
    if(!req.body.token) {
      return res.json({
        unauth:"login"
      })
    }

    const token = req.body.token

    const payload = jwt.verify(token,process.env.JWT_SECRET)
    console.log("current username", payload.username)

    var query = `SELECT * FROM users WHERE username =? and isActive =1`
    const values =[payload.username]

    const result = await pool.query(query, [values])

    
    if (result.length<1){
      return res.json({
        unauth:"login"
      })
    }

    const user = result[0]
    req.user=user.username
    */