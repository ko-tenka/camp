import React, { useEffect, useContext, useState } from 'react';
import styles from './Settings.module.css';
import { KeyOutlined, MailOutlined } from '@ant-design/icons';
import { Modal, Input, Button, message } from 'antd';
import { UserContext } from '../../context/userContext';

const ProfileSettings = () => {
	const { email, setEmail } = useContext(UserContext);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		if (newPassword === confirmPassword) {
			setIsModalVisible(false);
		} else {
			message.error('Пароли не совпадают');
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<div className={styles.userSettings}>
			<p className={styles.header}>Мои данные</p>
			<div className={styles.userEmail}>
				<p className={styles.email}>Почта</p>
				<p className={styles.emailInput}>{email}</p>
				<MailOutlined className={styles.outlined1} />
			</div>
			<a className={styles.userPass} onClick={showModal}>
				<p className={styles.password}>Пароль</p>
				<p className={styles.passInput}>Нажмите для изменения</p>
				<KeyOutlined className={styles.outlined} />
			</a>
			<Modal
				title='Изменение пароля'
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Input.Password
					placeholder='Новый пароль'
					value={newPassword}
					onChange={e => setNewPassword(e.target.value)}
				/>
				<Input.Password
					placeholder='Подтвердите новый пароль'
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
					style={{ marginTop: 10 }}
				/>
			</Modal>
		</div>
	);
};

export default ProfileSettings;
