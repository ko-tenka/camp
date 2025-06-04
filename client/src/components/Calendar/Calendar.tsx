import React, { useState, useEffect, ChangeEvent, useContext } from 'react';
import './Calendar.css';
import { DatePicker, Space, Modal, Form, Input, Radio, Button, ConfigProvider } from 'antd';
import { SearchOutlined, CaretUpFilled, CaretDownFilled } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hook';
import { fetchBookById, fetchBook } from '../../redux/thunkActions';
import locale from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { UserContext } from '../../context/userContext';
import PhoneNumberInput from '../PhoneNumberInput/PhoneNumberInput';

const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';

const disabled7DaysDate = (current: Moment, { from }: { from?: Moment }) => {
  if (from) {
    return Math.abs(current.diff(from, 'days')) >= 500;
  }
  return false;
};

const Calendar: React.FC<{ camper: { timeOpen: moment.Moment; timeClosed: moment.Moment; camperPrice: number } }> = ({ camper }) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  dayjs.extend(customParseFormat);
  dayjs.locale('ru');

  useEffect(() => {
    if (id) {
      void dispatch(fetchBookById(id));
    }
  }, [dispatch, id]);

  const { bookingDate, setBookingDate } = useContext(UserContext);
  const { shelterCount, setShelterCount } = useContext(UserContext);
  const { camperCount, setCamperCount, login, daysCount, setDaysCount, setLogin } =
		useContext(UserContext);
  const [selectedDates, setSelectedDates] = useState<[moment.Moment, moment.Moment] | null>(bookingDate);
  const [message, setMessage] = useState<string>('');
  const [inputs, setInputs] = useState({ name: '', famale: '', guest: '', campNumber: '', parkNumber: '', email: '', password: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState(0)
  // const {shelterCount, setShelterCount} = useContext(UserContext)
  // const {camperCount, setCamperCount} = useContext(UserContext)



  const showModal = () => setIsModalOpen(true);

  const handleOk = async () => {
    setIsModalOpen(false);
    const bookData = {
			id,
			name: inputs.name,
			famale: inputs.famale,
			guest: inputs.guest,
			startDate: selectedDates ? selectedDates[0].format('YYYY-MM-DD') : null,
			endDate: selectedDates ? selectedDates[1].format('YYYY-MM-DD') : null,
			shelterCount,
			camperCount,
			email: inputs.email,
			password: inputs.password,
			numberPhone: phone,
		};
    console.log('Сохранение бронирования', bookData);
    // await dispatch(fetchBook(bookData));
    const result = await dispatch(fetchBook(bookData));
    console.log('Тут что-то приходит вообще в result Calendar?', result)
    if(result.payload.err === 'Неверный пароль!'){
      setMessage(`Такой email уже существует
      Пароль не верный`);
      setIsModalOpen(true);
    } else {
      setMessage(`Бронь успешна, подробности бронирования на вашей почте.`);
      setLogin(true)
    }
    setInputs({ name: '', famale: '', guest: '', campNumber: '', parkNumber: '', email: '', password: '' });
  };

  const handleCancel = () => setIsModalOpen(false);

  const changeHandler = (e: ChangeEvent<HTMLInputElement | RadioChangeEvent>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleDateChange = (dates: [moment.Moment, moment.Moment] | null) => {
    console.log('Dates changed:', dates);
    const parsDateStart = `${dates[0].$y}-${dates[0].$M+1}-${dates[0].$D}`
    const parsDateEnd = `${dates[1].$y}-${dates[1].$M+1}-${dates[1].$D}`
    const currentDay = new Date(parsDateStart)
    const endDate = new Date(parsDateEnd)
    const dayAr = (endDate-currentDay)/1000/60/60/24
    setDaysCount(Number(dayAr))
    setSelectedDates(dates);
    setBookingDate(dates);
  };

  const checkAvailability = () => {
    // console.log('Check availability button clicked!');
    // console.log('Selected dates:', selectedDates);
	setPrice((shelterCount*camper.shelterPrice + camperCount*camper.camperPrice)*daysCount)

    if (!selectedDates) {
      console.log('No dates selected');
      setMessage('Пожалуйста, выберите даты.');
      return;
    }

    const [start, end] = selectedDates;
    console.log('Start date:', start, 'End date:', end);
    const parsDateStart = `${start.year()}-${start.month() + 1}-${start.date()}`;
    const parsDateEnd = `${end.year()}-${end.month() + 1}-${end.date()}`;
    const url = `http://localhost:3000/booking/${id}?start=${parsDateStart}&end=${parsDateEnd}&shelter=${shelterCount}&camper=${camperCount}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response data:', data);
        if (data.shelter === 'места есть' && data.camper === 'места есть') {
          setMessage('Места доступны на выбранные даты.');
          setIsModalOpen(true);
        } else {
          setMessage('Места недоступны на выбранные даты.');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setMessage('Произошла ошибка при проверке доступности мест.');
      });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handlePhoneChange = (value: string) => {
		setPhone(value);
 };
  return (
		<Space direction='vertical' className='calendarConteiner'>
			<h3 className='title'>Забронировать:</h3>
			<ConfigProvider locale={locale}>
				<RangePicker
					size='large'
					format={dateFormat}
					disabledDate={disabled7DaysDate}
					value={selectedDates}
					onChange={handleDateChange}
				/>
			</ConfigProvider>

			<div className='count'>
				<div className='card'>
					<div>
						<img
							className='bus'
							src='/camping.png'
							alt='Количество палаточных мест'
						/>
						{shelterCount}
					</div>
					<div className='strelk'>
						<button
							className='btnstr'
							onClick={() =>
								setShelterCount(prev =>
									shelterCount < 10 ? prev + 1 : shelterCount,
								)
							}
						>
							<CaretUpFilled />
						</button>
						<button
							className='btnstr'
							onClick={() =>
								setShelterCount(prev =>
									shelterCount > 0 ? prev - 1 : shelterCount,
								)
							}
						>
							<CaretDownFilled />
						</button>
					</div>
				</div>

				<div className='card'>
					<div>
						<img
							className='bus'
							src='/bus.png'
							alt='Количество парковочных мест'
						/>
						{camperCount}
					</div>
					<div className='strelk'>
						<button
							className='btnstr'
							onClick={() =>
								setCamperCount(prev =>
									camperCount < 10 ? prev + 1 : camperCount,
								)
							}
						>
							<CaretUpFilled />
						</button>
						<button
							className='btnstr'
							onClick={() =>
								setCamperCount(prev =>
									camperCount > 0 ? prev - 1 : camperCount,
								)
							}
						>
							<CaretDownFilled />
						</button>
					</div>
				</div>
			</div>

			{message && <p>{message}</p>}

			<Button
				type='primary'
				icon={<SearchOutlined />}
				onClick={checkAvailability}
			>
				Проверить даты
			</Button>

			<Modal
				title='Бронирование'
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form>
					<Form.Item label='Имя:'>
						<Input onChange={changeHandler} name='name' value={inputs.name} />
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
						</>
					)}
				</Form>

				{message && <p>{message}</p>}

				{selectedDates && (
					<div>
						<p className='startDate'>
							<strong>Заезд:</strong> {selectedDates[0].format('DD-MM-YYYY')} г.
						</p>
						<p className='endDate'>
							<strong>Выезд:</strong> {selectedDates[1].format('DD-MM-YYYY')} г.
						</p>
					</div>
				)}

				<p>
					<strong>Общая стоимость:</strong>{' '}
					{price}
				</p>
			</Modal>
		</Space>
	);
};


export default Calendar;

