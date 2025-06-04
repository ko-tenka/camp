const express = require('express');

const checkRouter = express.Router();

checkRouter.get('/', (req, res) => {
  if (req.session && req.session.email) { 
     
    res.json({ loggedIn: true, email: req.session.email, userId: req.session.userId, img: req.session.img, partner: req.session.partner });
  } else {
    res.json({ loggedIn: false });
  }
});



module.exports = checkRouter;
