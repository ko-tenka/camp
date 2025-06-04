const regRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { User } = require('../db/models');

function validatePhoneNumber(numberPhon) {
	const number = parsePhoneNumberFromString(numberPhon);
	return number && number.isValid();
}

regRouter.post('/', async (req, res) => {
	try {
		const { name, email, password, partner777, numberPhone } = req.body;
		console.log(numberPhone);
		if (!validatePhoneNumber(numberPhone)) {
			return res.json({ err: 'Некорректный формат номера телефона' });
		}

		const user = await User.findOne({ where: { email } });

		if (password.length < 8) {
			return res.json({ err: 'Введите пароль более 8 символов.' });
		}

		if (!/(?=.*[A-Z])/.test(password)) {
			return res.json({
				err: 'Пароль должен содержать одну заглавную латинскую букву',
			});
		}

		if (!/(?=.*[a-z])/.test(password)) {
			return res.json({
				err: 'Пароль должен содержать хотя бы одну строчную букву',
			});
		}

		if (!/(?=.*\d)/.test(password)) {
			return res.json({ err: 'Пароль должен содержать хотя бы одну цифру' });
		}

		if (!/(?=.*[!@#$%^&*()_+{}|:<>?\-=[\];',./`~])/.test(password)) {
			return res.json({
				err: 'Пароль должен содержать хотя бы один специальный символ',
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.json({ err: 'Пожалуйста, введите корректный email!' });
		}

		if (user) {
			return res.json({
				err: 'Пользователь с таким email Уже зарегистрирован!',
			});
		}
		const hash = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			name,
			email,
			password: hash,
			partner: partner777,
			numberPhone,
		});
		req.session.createdAt = newUser.createdAt;
		req.session.email = newUser.email;
		req.session.userId = newUser.id;
		req.session.name = newUser.name;
		req.session.partner = newUser.partner;
		req.session.save(() => {
			res.json({
				success: 'Поздрявляем, Вы успешно зарегистрировались!',
				partner: newUser.partner,
			});
		});
	} catch (err) {
		res
			.status(500)
			.json({ err: 'Ошибка в registr.rout', details: err.message });
	}
});

module.exports = regRouter;
