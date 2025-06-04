import { Button, Form, Input, Modal, Switch, message } from 'antd';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import PhoneNumberInput from '../../components/PhoneNumberInput/PhoneNumberInput';
import { UserContext } from '../../context/userContext';
import styles from './Login.module.css'

export default function RegistrationModal() {
	const [inputs, setInputs] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [phone, setPhone] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [partner777, setPartner777] = useState(false);
	const showModal = () => setIsModalOpen(true);
	const modalCancel = () => setIsModalOpen(false)
	;

	const { login, setLogin, partner, setPartner } = useContext(UserContext);

	const handleOk = async () => {
		if (Object.values(inputs).some(value => value === '')) {
			message.error('Заполните все поля');
			return;
		}

		const registrData = {
			name: inputs.name,
			email: inputs.email,
			password: inputs.password,
			numberPhone: phone.startsWith('+') ? phone : `+${phone}`,
		};

		try {
			const response = await axios.post(
				'http://localhost:3000/reg',
				{
					...registrData,
					partner777,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				},
			);
			const { data } = await response;

			if (data.err) {
				message.error(data.err);
			}

			if (!data.err) {
				setPartner(data.partner);
				setLogin(true);
				// navigate('/');
				setIsModalOpen(false);
				message.success(data.success);
			}
		} catch (error) {
			console.error('Ошибка при отправке данных:', error);
		}
	};

	const changeHandler = e => {
		const { name, value } = e.target;
		setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
	};

	const handleInputChange = e => {
		setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handlePhoneChange = value => {
		setPhone(value);
	};

	const onChangeHandler = checked => {
		setPartner777(checked);
	};

	return (
		<div>
			<a className={styles.btn} type='primary' onClick={showModal}>
				Регистрация
			</a>
			<Modal
				title='Заполните форму'
				open={isModalOpen}
				onOk={handleOk}
				onCancel={modalCancel}
				okText='Отправить'
				cancelText='Отмена'
			>
				<Form>
					<Form.Item label='Имя:'>
						<Input onChange={changeHandler} name='name' value={inputs.name} />
					</Form.Item>

					<>
						<Form.Item label='Email'>
							<Input
								onChange={handleInputChange}
								name='email'
								value={inputs.email}
							/>
						</Form.Item>
						<Form.Item label='Пароль'>
							<Input
								type='password'
								onChange={handleInputChange}
								name='password'
								value={inputs.password}
							/>
						</Form.Item>
						<Form.Item label='Телефон:'>
							<PhoneNumberInput value={phone} onChange={handlePhoneChange} />
						</Form.Item>

						<Form.Item label='Партнер:'>
							<Switch defaultChecked={false} onChange={onChangeHandler} />
						</Form.Item>
					</>
					{/* )} */}
				</Form>
			</Modal>
		</div>
	);
}
