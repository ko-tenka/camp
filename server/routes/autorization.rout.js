const autorizRouter = require('express').Router();
const bcrypt = require('bcrypt');

const { User } = require('../db/models');

autorizRouter.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.json({ err: 'Пользователь с таким Email не зарегистрирован!' });
    } else {
      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        return res.json({ err: 'Не верный пароль!' });
      }
      req.session.createdAt = user.createdAt;
      req.session.email = user.email;
      req.session.userId = user.id
      req.session.name = user.name
      req.session.img = user.img
      req.session.partner = user.partner
      req.session.save(() => {
      
        res.json({ success: 'Успешная авторизация' });
        
      });
    }
  } catch (err) {
    res.json({ err: 'Ошибка при авторизации', details: err.message });
  }
});

module.exports = autorizRouter;
