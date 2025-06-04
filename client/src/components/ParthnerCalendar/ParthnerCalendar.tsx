import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './ParthnerCalendar.module.css';
import { Button, Space, Spin } from 'antd';
import { ru } from 'date-fns/locale';
import { LoadingOutlined } from '@ant-design/icons';
import CamperButton from '../CamperButton/CamperButton';
import { format } from 'date-fns';
import { fetchDeleteCard } from '../../redux/thunkActions';
import { useAppDispatch } from '../../redux/hook';

export default function ParthnerCalendar() {
    // const {id} = useParams()
    const [campings, setCampings] = useState([])
    const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({})
   const [selectedCamp, setSelectedCamp] = useState(null);
  const [bookings, setBookings] = useState([])
  const [user, setUser] = useState([])
  
  const dispatch = useAppDispatch();
  
      useEffect(() => {
				axios
					.get(`http://localhost:3000/camper/parthner/campers`, {
						withCredentials: true,
					})
					.then(res => {
						setCampings(res.data);
						setLoading(false);
					})
					.catch(error => {
						console.error('Ошибка при загрузке кемпингов', error);
						setLoading(false);
					});
			}, []);
  
  
   const handleCampClick = (camp) => {
     setSelectedCamp(camp);
   
			axios
				.get(`http://localhost:3000/book/partner/${camp.id}`)
        .then(res => {

					setBookings(res.data.book);
					setUser(res.data.user);
				
				})
				.catch(error => {
					console.error('Ошибка при загрузке бронирований', error);
				});
		};


  	const handleDelete =  (id) => {
      dispatch(fetchDeleteCard(id));
      const filterArray = bookings.filter(el => el.id !== id);
			setBookings(filterArray);
      
  };
  
 

  return (
		<>
			<div className={styles.flex}>
				<div className={styles.left}>
					{loading ? (
						<Spin
							indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
						/>
					) : (
						<>
							<div>Выберите ваш кемпинг:</div>

							{campings && campings.map(camp => (
								<div key={camp.id} onClick={() => handleCampClick(camp)}>
									<CamperButton camp={camp} />
								</div>
							))}
							{/* {campings.map((camp, i) => (
								<>
									<div onClick={() => setDates(campings[i])}>
										<CamperButton key={`pat${camp.id}`} camp={camp} />
									</div>
								</>
							))} */}
						</>
					)}
				</div>
        <div className={styles.right}>
          
					{selectedCamp ? (
						<>
							<div>{selectedCamp.title}</div>
							<p>ID отеля: {selectedCamp.id}</p>
							<h3>Бронирования:</h3>

              <div className={styles.cards}>
                {bookings === null ? (<p>Нет бронирований</p>)
                  :
                  (bookings.map(booking => (
										<Space
											className={styles.card}
											key={booking.id}
											direction='vertical'
										>
											<p>Имя: {booking.name}</p>
											<p>фамилия: {booking.famale}</p>
											<p>телефон: {user.numberPhone}</p>
											<div>
												{format(
													new Date(booking.dateCheckIn),
													'Время прибытия: dd MMMM',
													{ locale: ru },
												)}
											</div>
											<div>
												{format(
													new Date(booking.dateDeparture),
													'Время убытия: dd MMMM ',
													{ locale: ru },
												)}
											</div>

											<p>Количество мест: {booking.camperCount}</p>
											<Button
												onClick={() => handleDelete(booking.id)}
												type='primary'
												danger
											>
												Отменить запись
											</Button>
										</Space>
									)))}
								
							</div>
						</>
					) : (
						<p>Выберите кемпинг, чтобы увидеть бронирования</p>
					)}
					<div>{dates.title} </div>
				</div>
			</div>
		</>
	);
}
