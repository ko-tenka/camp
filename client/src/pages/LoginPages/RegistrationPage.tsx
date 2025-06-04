// import { useContext, useState } from 'react';
// import styles from './Login.module.css';

// import { Form, Link, useNavigate } from 'react-router-dom';
// import { UserContext } from '../../context/userContext';
// import { Switch } from 'antd';

// export function RegistrationPage() {
// 	const [inputs, setInputs] = useState({ name: '', email: '', password: '' });
// 	const [errRegMassage, setErrRegMassage] = useState('');
// 	const navigate = useNavigate();
// 	const { login, setLogin, partner, setPartner } = useContext(UserContext);
// 	const [partner777, setPartner777] = useState(false);

// 	const addHandler = async e => {
// 		e.preventDefault();

// 		if (Object.values(inputs).some(value => value === '')) {
// 			setErrRegMassage('Заполни все поля');
// 			return;
// 		}

// 		const res = await fetch('http://localhost:3000/reg', {
// 			method: 'POST',
// 			headers: { 'content-type': 'application/json' },
// 			body: JSON.stringify({ ...inputs, partner777 }),
// 			credentials: 'include',
// 		});
// 		const data = await res.json();

// 		if (data.err) {
// 			setErrRegMassage(data.err);
// 		}
// 		if (!data.err) {
// 			setPartner(data.partner);
// 			setLogin(true);
// 			navigate('/');
// 		}
// 	};

// 	const onChangeHandler = checked => {
// 		setPartner777(checked);
// 	};

// 	const handleInputChange = e => {
// 		setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
// 	};

// 	return (
// 		<div className={styles.container}>
// 			<form className={styles.form} onSubmit={addHandler}>
// 				{errRegMassage ? <p>{errRegMassage}</p> : <p></p>}
// 				<h3 className={styles.headerReg}>Регистрация</h3>

// 				<div className={styles.formGroup}>
// 					<input
// 						name='name'
// 						type='text'
// 						className={styles.formInput}
// 						placeholder=' '
// 						value={inputs.name}
// 						onChange={handleInputChange}
// 					/>
// 					<label htmlFor='name' className={styles.formLabel}>
// 						Имя
// 					</label>
// 				</div>

// 				<div className={styles.formGroup}>
// 					<input
// 						name='email'
// 						type='text'
// 						className={styles.formInput}
// 						placeholder=' '
// 						value={inputs.email}
// 						onChange={handleInputChange}
// 					/>
// 					<label htmlFor='email' className={styles.formLabel}>
// 						Почта
// 					</label>
// 				</div>

// 				<div className={styles.formGroup}>
// 					<input
// 						name='password'
// 						type='password'
// 						className={styles.formInput}
// 						placeholder=' '
// 						value={inputs.password}
// 						onChange={handleInputChange}
// 					/>
// 					<label htmlFor='password' className={styles.formLabel}>
// 						Пароль
// 					</label>
// 				</div>

// 				<div className={styles.formGroup}>
// 					<h3>
// 						Партнер:{' '}
// 						<Switch defaultChecked={false} onChange={onChangeHandler} />
// 					</h3>
// 				</div>

// 				<button type='submit' className={styles.formButton}>
// 					Зарегистрироваться
// 				</button>
// 			</form>
// 		</div>
// 	);
// }
