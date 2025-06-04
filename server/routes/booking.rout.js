const express = require('express');
const { Booking } = require('../db/models');
const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const router = express.Router();

const transporter = nodemailer.createTransport({
	host: 'smtp.mail.ru',
	port: 465,
	secure: true, // Use true for port 465, false for all other ports
	auth: {
		user: 'emailtest00@mail.ru',
		pass: 'reswEbGKHAeaript8jxe',
	},
});
async function main(email, name, shelterCount, camperCount) {
	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: 'emailtest00@mail.ru', // sender address
		to: email, // list of receivers
		subject: 'Кемпинг ✔', // Subject line
		text: 'Ваше бронирование', // plain text body
		html: `<h2>Ваше бронирование: </h2>
    <h3>${name}, мы рады, что вы выбрали наш сервис для бронирования кемпингов в путешествиях!</h3> 
    <h4>Вы забронировали:</h4>
    <p>Колличество палаток: ${camperCount} </p>
    <p>Колличество паркингов: ${shelterCount} </p>
    <p>Номер вашей брони: 643278</p>
    <img src=${'https://saint-petersburg.ru/i/msg/0390/0851/ph32.jpg'} alt=Фото кемпинга>
    `,
	});
}

router.get('/:id', async (req, res) => {
	console.log('Зашли в ручку');
	try {
		const id = req.params.id;
		const book = await Booking.findAll({ where: { camperId: id } });
		console.log(book);
		res.json(book);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	console.log('Зашли в ручку');
	const {
		id,
		name,
		famale,
		startDate,
		endDate,
		shelterCount,
		camperCount,
		email,
		password,
		numberPhone,
	} = req.body;
	try {
		const { userId } = req.session;
		if (userId) {
			const newBooking = await Booking.create({
				userId,
				camperId: id,
				name,
				famale,
				shelterCount,
				camperCount,
				dateCheckIn: startDate,
				dateDeparture: endDate,
			});
			res.json(newBooking);
		} else {
			const user = await User.findOne({ where: { email } });
			if (!user) {
				const hash = await bcrypt.hash(password, 10);
				const newUser = await User.create({
					name,
					email,
					password: hash,
					partner: false,
					numberPhone,
				});

				req.session.email = newUser.email;
				req.session.userId = newUser.id;
				req.session.name = newUser.name;

				await new Promise(resolve => req.session.save(resolve));

				await Booking.create({
					userId: newUser.id,
					camperId: id,
					name,
					famale,
					shelterCount,
					camperCount,
					partner: false,
					dateCheckIn: startDate,
					dateDeparture: endDate,
				});
				res.json({
					success:
						'Поздравляем, Вы успешно зарегистрировались и забронировали места!',
				});
			} else {
				const checkPassword = await bcrypt.compare(password, user.password);
				if (!checkPassword) {
					return res.json({ err: 'Неверный пароль!' });
				} else {
					req.session.email = user.email;
					req.session.userId = user.id;
					req.session.name = user.name;
					await new Promise(resolve => req.session.save(resolve));

					const newBooking = await Booking.create({
						userId: req.session.userId,
						camperId: id,
						name,
						famale,
						shelterCount,
						camperCount,
						dateCheckIn: startDate,
						dateDeparture: endDate,
					});
					res.json({ success: 'Поздравляем, Вы успешно забронировали места!' });
				}
			}
		}
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ err: 'Ошибка в booking.rout', details: err.message });
	}
});

router.get('/partner/:id', async (req, res) => {
	try {
		const { id } = req.params;


		const book = await Booking.findAll({ where: { camperId: id }, raw: true });

    if (book.length > 0) {
      const user = await User.findOne({
				where: { id: book[0].userId },
        raw: true,
        
      });
    
      res.json({ book: book, user: user });
    } else {
      res.json({ book: null, user: null });
    }
	} catch (err) {
		res
			.status(500)
			.json({ err: 'Ошибка в booking.rout', details: err.message });
	}
});

module.exports = router;
