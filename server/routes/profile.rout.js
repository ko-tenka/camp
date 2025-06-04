const express = require('express');
const { Booking, Camper, User } = require('../db/models');
const fs = require('fs');

const multer  = require('multer');
const { log } = require('console');
const path = require('path')


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "images");
    },
	filename: (req, file, cb) => {
			// new Date().getSeconds() +
        cb(null,  file.originalname );
    }
});

const upload = multer({ storage: storageConfig })

const profileRouter = express.Router();

  profileRouter.get('/booking', async (req, res) => {
		try {			
			const { userId, name, createdAt } = req.session;	
			const booking = await Booking.findAll({
				where: { userId },
				include: Camper,
			});			
			res.json({ booking, name, createdAt })		
	} catch (err) {
		res.json({err: 'Internal Server Error'})
	}
	})

	profileRouter.delete('/booking/:id', async (req, res) => {
  try {
		const { id } = req.params;
    await Booking.destroy({
      where: { id },
    });
    res.json({ success: 'карточка удалена'});
  } catch (err) {
    res.json({ err: 'Ошибка ручки удаления' });
  }
	})

profileRouter.post('/avatar/:id', upload.single('avatar'), async (req, res) => {
	try {			
		const { id } = req.params
		const user = await User.findByPk(id)
		if (req.file) {
			await User.update({ img: req.file.filename },
				{ where: { id } },
			)
			req.session.img = req.file.filename
		}	
		res.json({img: user.img, file:req.file})		
	} catch (err) {
		console.log("Ошибка в ручке post avatar", err);
		}
	})

profileRouter.delete('/avatar/:id/', async (req, res) => {	
	try {
		const { id } = req.params;
		const user = await User.findByPk(id);	
		if (!user) {
			return res.status(404).json({ error: 'Пользователь не найден' });	
		}
		if (user.img) {
			const imagePath = path.join(__dirname, '../images', user.img);		
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		await User.update({ img: null }, { where: { id } });
		req.session.img = null
		res.json({ success: 'Изображение пользователя удалено' });
	} catch (err) {
		res.status(500).json({ err: 'Ошибка удаления изображения пользователя' });
	}
});


module.exports = profileRouter;