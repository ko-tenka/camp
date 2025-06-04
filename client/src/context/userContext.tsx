import React, { createContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export const UserContext = createContext({
  login: false,
  email: '',
  name: '',
  message: '',
  bookingDate: [],
  userPhoto: '',
  shelterCount: 0,
  camperCount: 0,
  partner: false,
});

export const UserAppContext = ({ children }) => {
  const [shelterCount, setShelterCount] = useState(1)
  const [camperCount, setCamperCount] = useState(1)
  const [login, setLogin] = useState(false); //! Состояние авторизации
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
   const [email, setEmail] = useState('');
  
  
  
  const [user_Id, setUser_Id] = useState(null)
  const [userPhoto, setUserPhoto] = useState(null)
  const [partner, setPartner] = useState(false);
  
  dayjs.extend(customParseFormat);
  const dateFormat = 'DD/MM/YYYY';
  const currentDay = new Date()
  const nextDay = new Date()
  const startDate = `${currentDay.getDate()<10 ? '0'+currentDay.getDate().toString():currentDay.getDate()}/${(currentDay.getMonth()+1)<10 ? '0'+(currentDay.getMonth()+1).toString(): (currentDay.getMonth()+1).toString()}/${currentDay.getFullYear()}`
  const endDate = new Date(nextDay.setDate(nextDay.getDate()+7))
  const parseEndDate = `${endDate.getDate()<10 ? '0'+endDate.getDate().toString():endDate.getDate()}/${(endDate.getMonth()+1)<10 ? '0'+(endDate.getMonth()+1).toString(): (endDate.getMonth()+1).toString()}/${endDate.getFullYear()}`
  const [daysCount, setDaysCount] = useState(Number((endDate-currentDay)/1000/60/60/24))
  

  const [bookingDate, setBookingDate] = useState([dayjs(startDate.toString(), dateFormat), dayjs(parseEndDate.toString(), dateFormat)])
  

  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000);

      return () => clearTimeout(timer); 
    }
  }, [message]);

  return (
		<UserContext.Provider
			value={{
				login,
				setLogin,
				name,
				setName,
				checkAdmin,
				setCheckAdmin,
				message,
				setMessage,
				bookingDate,
				setBookingDate,
				shelterCount,
				setShelterCount,
				camperCount,
				setCamperCount,
				user_Id,
				setUser_Id,
				userPhoto,
				setUserPhoto,
				partner,
				setPartner,
				daysCount,
				setDaysCount,
				email,
				setEmail,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

