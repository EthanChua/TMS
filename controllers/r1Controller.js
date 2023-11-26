
// Get all jobs => /api/v1/route1
exports.getR1= (req, res, next) => {
  res.status(200).json({
    success : true,
    message : 'This route will display all jobs in future.'
  });
}