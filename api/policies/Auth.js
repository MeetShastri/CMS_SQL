
module.exports = function(req, res, next) {
  console.log('Middleware running');
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'abcde');
    console.log(decoded);
    return next();
  } catch (error) {
    return res.json({
      message: 'Invalid token',
      error:error.message});
  }
};

