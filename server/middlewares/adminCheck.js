module.exports = async (req, res, next) => {
  const { email } = req.session;
  if (email === 'admin@mail.com') {
    next();
  } else {
    
    res.redirect('/');
  }
};