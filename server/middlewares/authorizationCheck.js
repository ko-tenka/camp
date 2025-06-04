module.exports = async (req, res, next) => {
  const { email } = req.session;
  if (email) {
    next();
  } else {
    
    res.redirect('/login');
  }
};