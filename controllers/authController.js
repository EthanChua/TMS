const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.registerUser = catchAsyncErrors( async (req, res, next) =>{
  const {name,email, password, role} = req.body

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  res.status(200).json({
    success : true,
    message : 'User is registered.',
    data: user
  });
});

//login user => /api/v1/login
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
  const {userName, password} = req.body;

  //finding user in database
  const user = await User.findOne({userName}).select('+password');
  if(!user) {
    return next(new ErrorHandler('Invalid Email or password', 401))
  }

  //check if pw is correct

});