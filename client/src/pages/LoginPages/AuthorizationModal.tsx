
import { Button, Form, Input, Modal, Switch, message } from 'antd';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import styles from './Login.module.css';

export default function AuthorizationModal() {
	const [inputs, setInputs] = useState({
		email: '',
		password: '',
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => setIsModalOpen(true);
	const modalCancel = () => setIsModalOpen(false);

	const { login, setLogin } = useContext(UserContext);

	const handleOk = async () => {
		if (Object.values(inputs).some(value => value === '')) {
			message.error('Заполните все поля');
			return;
		}

		const registrData = {
			
			email: inputs.email,
			password: inputs.password,

		};

		try {
			const response = await axios.post(
				'http://localhost:3000/login',
				{
					...registrData,
					
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
				setLogin(true);
				// navigate('/');
				setIsModalOpen(false);
				message.success(data.success);
			}
		} catch (error) {
			console.error('Произошла ошибка при авторизации: ', error);
		}
	};


	const handleInputChange = e => {
		setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};




	return (
		<div>
			<a className={styles.btn} type='primary' onClick={showModal}>
				Войти
			</a>
			<Modal
				title='Войдите'
				open={isModalOpen}
				onOk={handleOk}
				onCancel={modalCancel}
				okText='Войти' 
				cancelText='Отмена'
			>
				<Form>
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
					</>
					{/* )} */}
				</Form>
			</Modal>
		</div>
	);
}
