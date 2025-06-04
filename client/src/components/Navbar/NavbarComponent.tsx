import React, { useState, useContext, useEffect } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import RegistrationModal from '../../pages/LoginPages/RegistrationModal';
import AuthorizationModal from '../../pages/LoginPages/AuthorizationModal';

const NavbarComponent = () => {
  const { login, setLogin, checkAdmin, setCheckAdmin, partner, setPartner } =
    useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  const logoutHandler = async () => {
    try {
      await axios.get(`http://localhost:3000/logout`, {
        withCredentials: true,
	});
	setLogin(false);
	setPartner(false);
} catch (error) {
	console.log(error);
}
  };

  return (
		<div className={styles.navbar}>
			<div className={styles.navBtn}>
			<Link style={{padding: 0}} to='/'><img className={styles.logo} src='logo.png' alt='logo'/></Link>
				<Link to='/'>Главная</Link>
				<Link to={'/campings'}>Кемпинги</Link>
				<Link to={'/routegear'}>Маршруты</Link>

				{login ? (
					<>
						{checkAdmin && <Link to='/admin'>Admin</Link>}
						<div className={styles.topnavRight}>
							{partner && <Link to={'/partner/calendar'}>Личный кабинет</Link>}
							<Link to={'/profile'}>
								<UserOutlined />
							</Link>
							<Link to={''} onClick={logoutHandler}>
								Выйти
							</Link>
						</div>
					</>
				) : (
					<div className={styles.topnavRight}>
						<div className={styles.auth}>
							<RegistrationModal />
							<AuthorizationModal />
						</div>
					</div>
				)}
			</div>

			<div className={styles.dropdown} style={{ float: 'right' }}>
				<button className={styles.dropbtn} onClick={toggleMenu}>
					Меню
				</button>

				<div className={`${styles.dropdownContent} ${isOpen && styles.open}`}>
					<></>

					<Link to={'/campings'}>Кемпинги</Link>

					{login ? (
						<>
							<Link to={'/campings'}>КЕМПИНГИ</Link>
							<Link onClick={logoutHandler}>Выход</Link>
						</>
					) : (
						<>
							<Link to='reg' onClick={handleMenuItemClick}>
								Зарегистрироваться
							</Link>
							<Link to='login' onClick={handleMenuItemClick}>
								Войти
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default NavbarComponent;
