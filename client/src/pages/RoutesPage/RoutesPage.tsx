import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import MapYandex from '../../components/routes/Map/Map';

import styles from './rp.module.css';
import { fetchBook, fetchRoutById } from '../../redux/thunkActions';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Modal, Radio, Spin, Form, message } from 'antd';
import CalendarRange from '../../components/routes/CalendarRange/CalendarRange';
import RoutCampCard from '../../components/routes/RoutCampCard/RoutCampCard';
import axios from 'axios';
import OneDayPlace from '../../components/OneDayPlace/OneDayPlace';
import { UserContext } from '../../context/userContext';
import { RadioChangeEvent } from 'antd/lib';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PhoneNumberInput from '../../components/PhoneNumberInput/PhoneNumberInput';
import Password from 'antd/es/input/Password';

export default function RoutesPage() {
  dayjs.extend(customParseFormat);
  const dateFormat = 'DD/MM/YYYY';
  const { id } = useParams();
  const [rout, setRout] = useState([]);
  const [loading, setLoadind] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { shelterCount, setShelterCount, login, setLogin } = useContext(UserContext);
  const { camperCount, setCamperCount } = useContext(UserContext);
  const { bookingDate, setBookingDate } = useContext(UserContext);
  const [price, setPrice] = useState(0)
  const [sheltePrice, setShelterPrice] = useState([])
  const [camperPrice, setSCamperPrice] = useState([])
  const [camperArrId, setCamperArrId] = useState([]);
  const [freePlace, setFreePlace] = useState(true);
   const [phone, setPhone] = useState('');
  const dispatch = useAppDispatch();
  const { daysCount, setDaysCount } = useContext(UserContext);

  const [inputs, setInputs] = useState({
		name: '',
		famale: '',
		guest: '',
		campNumber: '',
		parkNumber: '',
		email: '',
		password: '',
	});

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | RadioChangeEvent>
  ) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };
  useEffect(() => {
    async function load() {
      const response = await axios.get(`http://localhost:3000/rout/${id}`)
      if (response.data) {
        let arrId = []
        setLoadind(false);
        setRout(response.data);
        for (let r = 0; r < response.data.length; r++) {
          for (let x = 0; x < response.data[r].length; x++) {
            if (response.data[r][x].Camper !== null) {
              setCamperArrId((pre)=>[...pre, response.data[r][x].Camper.id])
              arrId.push(response.data[r][x].Camper.id)
			  setShelterPrice((prev)=>[...prev, response.data[r][x].Camper.shelterPrice])
			  setSCamperPrice((prev)=>[...prev, response.data[r][x].Camper.camperPrice])
             }
            }
			
          }
		  
            setTimeout(async ()=>{
              const parsDateStart2 = `${bookingDate[0].$y}-${bookingDate[0].$M + 1}-${
                bookingDate[0].$D
              }`;
              const currentDay = new Date(parsDateStart2);
              const startDate = `${
                currentDay.getDate() < 10
                  ? '0' + currentDay.getDate().toString()
                  : currentDay.getDate()
              }/${
                currentDay.getMonth() + 1 < 10
                  ? '0' + (currentDay.getMonth() + 1).toString()
                  : (currentDay.getMonth() + 1).toString()
              }/${currentDay.getFullYear()}`;
              const endDate = new Date(
                currentDay.setDate(
                  currentDay.getDate() + Number(response.data[0][0].Route.days)
                )
              );
              const parseEndDate = `${
                endDate.getDate() < 10
                  ? '0' + endDate.getDate().toString()
                  : endDate.getDate()
              }/${
                endDate.getMonth() + 1 < 10
                  ? '0' + (endDate.getMonth() + 1).toString()
                  : (endDate.getMonth() + 1).toString()
              }/${endDate.getFullYear()}`;
              
              setDaysCount(Number(response.data[0][0].Route.days));
              setBookingDate([
                dayjs(startDate.toString(), dateFormat),
                dayjs(parseEndDate.toString(), dateFormat),
              ]);
        
        
        
        
          const parsDateStart = `${bookingDate[0].$y}-${(bookingDate[0].$M + 1)}-${bookingDate[0].$D}`;
          
          const parsDateEnd = `${endDate.getFullYear()}-${(endDate.getMonth() + 1) < 10 ? '0' + (endDate.getMonth() + 1).toString(): (endDate.getMonth() + 1).toString()}-${endDate.getDate() < 10? '0' + endDate.getDate().toString(): endDate.getDate()}`;
          const res = await axios.post(`http://localhost:3000/allbooking`, {
            camperArrId: arrId,
            parsDateStart,
            parsDateEnd,
            shelterCount,
            camperCount,
          });
          res.data.forEach((el) => {
            if (el.shelter === 'мест нет' || el.camper === 'мест нет') {
              setFreePlace(false);
            } else if (el.shelter === 'мест нет' && el.camper === 'мест нет') {
              setFreePlace(false);
            } else {
              setFreePlace(true);
            }
		});
		
	},0)
	
}
}

load();





}, []);



  

  const currentCampHandler = async () => {
    setLoadind(true);
    const parsDateStart = `${bookingDate[0].$y}-${bookingDate[0].$M + 1}-${
      bookingDate[0].$D
    }`;
    const parsDateEnd = `${bookingDate[1].$y}-${bookingDate[1].$M + 1}-${
      bookingDate[1].$D
    }`;
    const res = await axios.post(`http://localhost:3000/allbooking`, {
      camperArrId,
      parsDateStart,
      parsDateEnd,
      shelterCount,
      camperCount,
    });

    setLoadind(false);
    res.data.forEach((el) => {
      if (el.shelter === 'мест нет' || el.camper === 'мест нет') {
        setFreePlace(false);
      } else if (el.shelter === 'мест нет' && el.camper === 'мест нет') {
        setFreePlace(false);
      } else {
        setFreePlace(true);
      }
    });
  };

  const handleCancel = () => setIsModalOpen(false);

  const handleOk = async () => {
    setIsModalOpen(false);
	
	if (login) {
		for (let i = 0; i < rout.length; i++) {
		  for (let x = 0; x < rout[i].length; x++) {
			if (rout[i][x].Camper !== null) {
			  const id = rout[i][x].Camper.id;
			  const daDay = new Date(bookingDate[0].format('YYYY-MM-DD'));
			  const currentDay = new Date(daDay.setDate(daDay.getDate() + i));
			  const startDate = `${currentDay.getFullYear()}-${
				currentDay.getMonth() + 1 < 10
				  ? '0' + (currentDay.getMonth() + 1).toString()
				  : (currentDay.getMonth() + 1).toString()
			  }-${
				currentDay.getDate() < 10
				  ? '0' + currentDay.getDate().toString()
				  : currentDay.getDate()
			  }`;
	
			  const nextDay = new Date(bookingDate[0].format('YYYY-MM-DD'));
			  const endDate = new Date(nextDay.setDate(nextDay.getDate() + i + 1));
			  const parseEndDate = `${endDate.getFullYear()}-${
				endDate.getMonth() + 1 < 10
				  ? '0' + (endDate.getMonth() + 1).toString()
				  : (endDate.getMonth() + 1).toString()
			  }-${
				endDate.getDate() < 10
				  ? '0' + endDate.getDate().toString()
				  : endDate.getDate()
			  }`;
			  const bookData = {
							id,
							name: inputs.name,
							famale: inputs.famale,
							guest: inputs.guest,
							startDate: bookingDate ? startDate : null,
							endDate: bookingDate ? parseEndDate : null,
							shelterCount,
							camperCount,
							email: inputs.email,
							password: inputs.password,
							numberPhone: phone.startsWith('+') ? phone : `+${phone}`,
						};
			  dispatch(fetchBook(bookData));
			  setInputs({
							name: '',
							famale: '',
							guest: '',
							campNumber: '',
							parkNumber: '',
							email: '',
							password: '',
						});

			}
		  }
		}
		message.success('Поздравляем, Вы успешно забронировали места!');

	} else {
		try {
			const response = await axios.post(
				'http://localhost:3000/reg',
				{
					name: inputs.name,
					email: inputs.email,
					password: inputs.password,
					numberPhone: phone.startsWith('+') ? phone : `+${phone}`,
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
				setTimeout(()=>{
					for (let i = 0; i < rout.length; i++) {
						for (let x = 0; x < rout[i].length; x++) {
						  if (rout[i][x].Camper !== null) {
							const id = rout[i][x].Camper.id;
							const daDay = new Date(bookingDate[0].format('YYYY-MM-DD'));
							const currentDay = new Date(daDay.setDate(daDay.getDate() + i));
							const startDate = `${currentDay.getFullYear()}-${
							  currentDay.getMonth() + 1 < 10
								? '0' + (currentDay.getMonth() + 1).toString()
								: (currentDay.getMonth() + 1).toString()
							}-${
							  currentDay.getDate() < 10
								? '0' + currentDay.getDate().toString()
								: currentDay.getDate()
							}`;
				  
							const nextDay = new Date(bookingDate[0].format('YYYY-MM-DD'));
							const endDate = new Date(nextDay.setDate(nextDay.getDate() + i + 1));
							const parseEndDate = `${endDate.getFullYear()}-${
							  endDate.getMonth() + 1 < 10
								? '0' + (endDate.getMonth() + 1).toString()
								: (endDate.getMonth() + 1).toString()
							}-${
							  endDate.getDate() < 10
								? '0' + endDate.getDate().toString()
								: endDate.getDate()
							}`;
							const bookData = {
										  id,
										  name: inputs.name,
										  famale: inputs.famale,
										  guest: inputs.guest,
										  startDate: bookingDate ? startDate : null,
										  endDate: bookingDate ? parseEndDate : null,
										  shelterCount,
										  camperCount,
										  email: inputs.email,
										  password: inputs.password,
										  numberPhone: phone.startsWith('+') ? phone : `+${phone}`,
									  };
							dispatch(fetchBook(bookData));
							setInputs({
										  name: '',
										  famale: '',
										  guest: '',
										  campNumber: '',
										  parkNumber: '',
										  email: '',
										  password: '',
									  });
						  }
						}
					  }
					  message.success('Поздравляем, Вы успешно забронировали места!');

				}, 200)
			}

		} catch (error) {
			console.log(error);
		}
		
	}

  };

  function bookingHanler() {
	setPrice(shelterCount*sheltePrice.reduce((a,b)=>a+b)+camperCount*camperPrice.reduce((a,b)=>a+b))
    setIsModalOpen(true);
  }

   const handlePhoneChange = (value: string) => {
			setPhone(value);
		};

  return (
		<>
			{rout.length ? (
				<>
					<div className={styles.calendar}>
						<div className={styles.elements}>Даты поездки:</div>
						<CalendarRange className={styles.elements} />
						<div className={styles.elements}>
							<img
								className='bus'
								src='/camping.png'
								alt='Количество палаточных мест'
							/>
							<InputNumber
								size='large'
								min={0}
								max={10}
								defaultValue={shelterCount}
								onChange={e => setShelterCount(e)}
							/>
						</div>
						<div className={styles.elements}>
							<img
								className='bus'
								src='/bus.png'
								alt='Колличество пакровочных мест'
							/>
							<InputNumber
								size='large'
								min={0}
								max={10}
								defaultValue={camperCount}
								onChange={e => setCamperCount(e)}
							/>
						</div>
						<Button
							className={styles.elements}
							type='primary'
							size='large'
							onClick={currentCampHandler}
						>
							Найти место
						</Button>
					</div>

					{freePlace ? (
						<>
							<div className={styles.flex}>
								<div className={styles.map}>
									{loading ? (
										<Spin
											indicator={
												<LoadingOutlined style={{ fontSize: 24 }} spin />
											}
										/>
									) : (
										<MapYandex rout={rout} />
									)}
								</div>
								<div className={styles.cards}>
									{loading ? (
										<Spin
											indicator={
												<LoadingOutlined style={{ fontSize: 24 }} spin />
											}
										/>
									) : (
										<>
											<div className={styles.divbtn}>
												<Button
													type='primary'
													size='large'
													onClick={bookingHanler}
													className={styles.btn}
												>
													Забронировать на выбранные даты
												</Button>
												{rout.map((day, i) => (
													<OneDayPlace key={`day${i}`} day={day} />
												))}
											</div>
										</>
									)}
								</div>
							</div>

							<Modal
								title='Бронирование'
								open={isModalOpen}
								onOk={handleOk}
								onCancel={handleCancel}
							>
								<Form>
									<Form.Item label='Имя:'>
										<Input
											onChange={changeHandler}
											name='name'
											value={inputs.name}
										/>
									</Form.Item>

									<Form.Item label='Фамилия:'>
										<Input
											onChange={changeHandler}
											name='famale'
											value={inputs.famale}
										/>
									</Form.Item>
									
									{!login && (
										<>
											<Form.Item label='Email'>
												<Input
													onChange={changeHandler}
													name='email'
													value={inputs.email}
												/>
											</Form.Item>
											<Form.Item label='Пароль'>
												<Input
													type='password'
													onChange={changeHandler}
													name='password'
													value={inputs.password}
												/>
											</Form.Item>
											<Form.Item label='Телефон:'>
												<PhoneNumberInput
													value={phone}
													onChange={handlePhoneChange}
												/>
											</Form.Item>
											<p>Общая стоимость: {price}</p>
										</>
									)}
									{/* <Form.Item label="Количество гостей:">
                    <Radio.Group
                      onChange={changeHandler}
                      name="guest"
                      value={inputs.guest}
                    >
                      <Radio value="1">1</Radio>
                      <Radio value="2">2</Radio>
                    </Radio.Group>
                  </Form.Item> */}
								</Form>
							</Modal>
						</>
					) : (
						<div>
							На ваши даты свободных мест нет, посмотрите другие маршруты
						</div>
					)}
				</>
			) : (
				<>
					<div>Такого маршрута нет</div>
				</>
			)}
		</>
	);
}
