const express = require('express');

const logoutRouter = express.Router()

logoutRouter.get('/', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('cookieName');
    res.end();
  });
});

module.exports = logoutRouter;