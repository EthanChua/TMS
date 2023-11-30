const mysql = require('mysql2');
//const validator = require('validator'); // for email validate

const userSchema = new mysql.Schema({
  userName: {
    type : String,
    required : [true, 'Enter User Name']
  },
  email : {
    type: String
  },
  role : {
    type : String,
    enum : {
      values : ['user', 'admin'],
      message : 'Please select corret role'
    },
    default : 'user' 
  },
  password : {
    type : String,
    required : [true, 'Please enter password'],
    minlength : [8, 'pw must be at least 8 character'],
    select: false
  },
  createdAt : {
    type : Date,
    default : Date.now
  }
});

module.exports= mysql.model('User', userSchema);