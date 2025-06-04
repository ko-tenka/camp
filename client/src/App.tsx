import { useContext, useEffect } from 'react';
import NavbarComponent from './components/Navbar/NavbarComponent';
import './App.css';
import axios from 'axios';
import { UserContext } from './context/userContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import AdminPage from './pages/AdminPage/AdminPage';
import FormPlace from './components/AdminFormAdd/FormPlace';
import FormRoute from './components/AdminFormAdd/FormRoute';
import RoutesPage from './pages/RoutesPage/RoutesPage';
import CamperPage from './pages/CamperPage/CamperPage';
import RouterGear from './pages/RouterGear/RouterGear';
import FormCamper from './components/AdminFormAdd/FormCamper';
import AllCapingsPage from './pages/AllCampingsPage/AllCampingsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PartnerPage from './pages/PartnerPage/PartnerPage';
import ParthnerCalendar from './components/ParthnerCalendar/ParthnerCalendar';

import ProfileBooking from './components/ProfileBooking/ProfileBooking';
import ProfileSettings from './components/ProfileSettings/ProfileSettings';

import Footer from './components/Footer/Footer';

function App() {
  const {
		login,
		setLogin,
		checkAdmin,
		setCheckAdmin,
		user_Id,
		setUser_Id,
		userPhoto,
		setUserPhoto,
		partner,
		setPartner,
		email,
		setEmail,
	} = useContext(UserContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/check', {
          withCredentials: true,
        });
        const data = response.data;

        if (data.email === 'admin@mail.com' && data.loggedIn) {
          setCheckAdmin(true);
          setLogin(true);
          setUser_Id(data.userId);
          setUserPhoto(data.img);
					setPartner(data.partner);
					setEmail(data.email)
        } else if (data.loggedIn && data.email !== 'admin@mail.com') {
          setLogin(true);
          setPartner(data.partner);
          setUser_Id(data.userId);
          setUserPhoto(data.img);
					setCheckAdmin(false);
					setEmail(data.email);
        } else {
          setCheckAdmin(false);
          setLogin(false);
          setUser_Id(null);
          setUserPhoto(null);
        }
      } catch (error) {
        console.error('Ошибка при проверке статуса входа:', error);
      }
    };
    checkLoginStatus();
  }, [login]);

  return (
    <>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/camper/:id" element={<CamperPage />} />
        <Route
          path="/admin"
          element={
            !checkAdmin ? <Navigate to="/" replace={true} /> : <AdminPage />
          }
        >
          <Route path="place" element={<FormPlace />} />
          <Route path="route" element={<FormRoute />} />
          <Route path="camper" element={<FormCamper />} />
          <Route path="calendar" element={<ParthnerCalendar />} />
        </Route>
        <Route path="routes/:id" element={<RoutesPage />} />
        <Route path="campings" element={<AllCapingsPage />} />
        <Route path="routegear" element={<RouterGear />} />
        <Route path="profile" element={<ProfilePage />} />

        <Route path="/partner" element={<PartnerPage />}>
          <Route path="camper" element={<FormCamper />} />
          <Route path="calendar" element={<ParthnerCalendar />} />
        </Route>

        <Route path="/profile" element={<ProfilePage />}>
          <Route path="bookingProf" element={<ProfileBooking />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="" element={<Navigate to="bookingProf" />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
