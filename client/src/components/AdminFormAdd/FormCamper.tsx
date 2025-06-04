import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/userContext';
import { useAppDispatch } from '../../redux/hook';
import { fetchAdminCamper } from '../../redux/thunkActions';
import styles from './Place.module.css'
import { Badge, Button, Checkbox, Col, Form, Input, Radio, Row, Select, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import UploadImgCamper from '../UploadImgCamper/UploadImgCamper';
import UploadImgCamperAll from '../UploadImgCamper/UploadImgCamperAll';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const format = 'HH:mm';



export default function FormCamper() {

  const [image, setImage] = useState(false)
  
	const [inputsCamper, setInputsCamper] = useState({
		title: '',
		shelterCount: 0,
		camperCount: 0,
    eCoordinates: '',
    wCoordinates: '',
		data: '',
		timeOpen: '',
		timeClosed: '',
		camperPrice: 0,
		shelterPrice: 0,
		place_type: '',
		seasonality: '',
		reservoir: '',
		entertainment: '',
		communication: '',
		sanitation: '',
		location: '',
		pay_by_card: '',
   
  });
  const navigate = useNavigate();
   useEffect(() => {

    return async ()=> {
      await axios.get(`http://localhost:3000/camper/parthner/clearblank`, {withCredentials: true})
    }
  }, []);
	
		const dispatch = useAppDispatch()

	const changeHandler = (e) => {
    setInputsCamper((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
  };
  
 

	const addHandler = async () => {
	const emptyFields = Object.keys(inputsCamper).filter(key => typeof inputsCamper[key] === 'string' && inputsCamper[key].trim() === '');
		if (emptyFields.length > 0) {
      message.error('Пожалуйста, заполните все поля')
			return;
    } else if (!image) {
      message.error('Пожалуйста добавьте титульную фотографию')
			return;
    }
    
		dispatch(fetchAdminCamper(inputsCamper))
    message.success('Кемпинг успешно добавлен!')
    setTimeout(()=>{
      navigate('/campings');
    }, 1000)
     
	}
		const timeChangeHandler = (time, timeString, field) => {
		setInputsCamper((prev) => ({ ...prev, [field]: timeString }));
  };
  
  
	const optionsPlaceType = [
    { value: 'кемпинг', label: <span>Кемпинг</span> },
		{ value: 'стоянка', label: <span>Стоянка</span> },
		{ value: 'дикое место', label: <span>Дикое место</span> },
		{ value: 'ферма', label: <span>Ферма</span> },
	];
	
	const optionsSeasinality = [
    { value: 'всесезонный', label: <span>Всесезонный</span> },
		{ value: 'зимний', label: <span>Зимний</span> },
		{ value: 'летний', label: <span>Летний</span> },
		{ value: 'весна-осень', label: <span>Весна-осень</span> },
  ];


	const typeChangeHandler = (value) => {
		setInputsCamper((prev) => ({ ...prev, place_type: value }));
		setInputsCamper((prev) => ({ ...prev, seasonality: value }));
  };


  const radioChangeHandler = (e) => {
	setInputsCamper((prev) => ({ ...prev, reservoir: e.target.value }));
  };
  

  const onChangeEntertainment = (checkedValues) => {
	setInputsCamper((prev) => ({ ...prev, entertainment: checkedValues.join(', ') }));
  };

  const onChangeCommunication = (checkedValues) => {
	setInputsCamper((prev) => ({ ...prev, communication: checkedValues.join(', ') }));
  };

  const onChangeSanitation = (checkedValues) => {
	setInputsCamper((prev) => ({ ...prev, sanitation: checkedValues.join(', ') }));
  };

  const onChangePayCard = (checkedValues) => {
	setInputsCamper((prev) => ({ ...prev, pay_by_card: checkedValues.join(', ') }));
  };

  



	return (
		<div className={styles.formContainer}>
		<br />
			<h1>Добавить кемпинг</h1>
			<br />

      <Form className={styles.form}>

				<Form.Item label="Название места">
				<Input	onChange={changeHandler}	value={inputsCamper.title}	name='title'	type='text' placeholder=''/>
			</Form.Item>
				<Form.Item label="Кол-во авто-кемпинг мест">
				<Input onChange={changeHandler} value={inputsCamper.shelterCount}	name='shelterCount'	type='text'	placeholder=''	/>
				</Form.Item>
				<Form.Item label="Кол-во палатка мест">
				<Input	onChange={changeHandler}	value={inputsCamper.camperCount}	name='camperCount'	type='text'	placeholder=''	/>
				</Form.Item>
				<Form.Item label="eCoordinates">
				<Input	onChange={changeHandler}	value={inputsCamper.eCoordinates}	name='eCoordinates'	type='text'	placeholder=''	/>
				</Form.Item>
				<Form.Item label="wCoordinates">
				<Input	onChange={changeHandler}	value={inputsCamper.wCoordinates}	name='wCoordinates'	type='text'	placeholder=''/>
		</Form.Item>
			<Form.Item label="Время работы">
                    <div className={styles.timePickerContainer}>
                        <TimePicker
                            onChange={(time, timeString) => timeChangeHandler(time, timeString, 'timeOpen')}
                            value={inputsCamper.timeOpen ? dayjs(inputsCamper.timeOpen, format) : null}
                            format={format}
                            placeholder="Открытие"
                        />
                        <TimePicker
                            onChange={(time, timeString) => timeChangeHandler(time, timeString, 'timeClosed')}
                            value={inputsCamper.timeClosed ? dayjs(inputsCamper.timeClosed, format) : null}
                            format={format}
                            placeholder="Закрытие"
                        />
                    </div>
                </Form.Item>
			
		{/* <Form.Item label="Минимальное кол-во дней:">
			<Input onChange={changeHandler}	value={inputsCamper.rate}	name='rate'	type='text'	placeholder='' />
		</Form.Item> */}
        


					{/* <Form.Item label="Изображения">
				<Input	onChange={changeHandler}	value={inputsCamper.img}	name='img'	type='text'	placeholder=''/>
        </Form.Item> */}
        
          

        
						<Form.Item label="Цена авто места в сутки">
				<Input	onChange={changeHandler}	value={inputsCamper.camperPrice}	name='camperPrice'	type='text'		placeholder=''/>
				</Form.Item>
				<Form.Item label="Цена кемпинг места в сутки">
				<Input	onChange={changeHandler}		value={inputsCamper.shelterPrice}	name='shelterPrice'	type='text'	placeholder=''/>
			</Form.Item>
			<Form.Item label="Описание">
				<TextArea style={{ maxHeight: 100, minHeight: 45 }} rows={4} placeholder="" onChange={changeHandler} value={inputsCamper.data} name='data' type='text'	maxLength={500} />
				</Form.Item> 

				<Form.Item label="Тип места" >
					<Select   options={optionsPlaceType} onChange={typeChangeHandler}  />
				</Form.Item> 
				
		<Form.Item label="Сезонность" >
					<Select   options={optionsSeasinality} onChange={typeChangeHandler}  />
				</Form.Item> 

		<Form.Item label="Водоем">
          <Radio.Group onChange={radioChangeHandler}>
            <Radio value="река"> река </Radio>
            <Radio value="озеро"> озеро </Radio>
			<Radio value="нет"> нет </Radio>
          </Radio.Group>
        </Form.Item>



  <Checkbox.Group style={{ width: '120%' }} onChange={onChangeEntertainment}>Развлечения:
    <Row>
      <Col span={8}>
        <Checkbox value="рыбалка">рыбалка</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="баня">баня</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="бассейн">бассейн</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="лазанье по деревьям">лазанье по деревьям</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="детская площадка">детская площадка</Checkbox>
      </Col>
	<Col span={8}>
        <Checkbox value="сплав">сплав</Checkbox>
      </Col>
	<Col span={8}>
        <Checkbox value="дискотека">дискотека</Checkbox>
      </Col>
	<Col span={8}>
        <Checkbox value="бар">бар</Checkbox>
      </Col>
    </Row>
  </Checkbox.Group>

<br />

  <Checkbox.Group style={{ width: '100%' }} onChange={onChangeCommunication}>Коммуникации:
    <Row>
      <Col span={5}>
        <Checkbox value="wi-fi">wi-fi</Checkbox>
      </Col>
      <Col span={5}>
        <Checkbox value="свет">свет</Checkbox>
      </Col>
      <Col span={5}>
        <Checkbox value="связь">связь</Checkbox>
      </Col>
      <Col span={5}>
        <Checkbox value="водопровод">водопровод</Checkbox>
      </Col>
    </Row>
  </Checkbox.Group>

<br />
				
<Checkbox.Group style={{ width: '100%' }} onChange={onChangeSanitation}>Условия:
    <Row>
      <Col span={4}>
        <Checkbox value="туалет">туалет</Checkbox>
      </Col>
      <Col span={4}>
        <Checkbox value="душ">душ</Checkbox>
      </Col>
      <Col span={4}>
        <Checkbox value="фен">фен</Checkbox>
      </Col>
      <Col span={4}>
        <Checkbox value="баня">баня</Checkbox>
      </Col>
	  <Col span={4}>
        <Checkbox value="сауна">сауна</Checkbox>
      </Col>
    </Row>
  </Checkbox.Group>

<br />


    <Form.Item label="местоположение:">
		<Input	onChange={changeHandler}	value={inputsCamper.location}	name='location'	type='text' placeholder=''/>
	</Form.Item>

	<br />

	<Checkbox.Group style={{ width: '80%' }} onChange={onChangePayCard}>Способ оплаты:
    <Row>
      <Col span={8}>
        <Checkbox value="картой">картой</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="переводом">переводом</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="наличными">наличными</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="СБП">СБП</Checkbox>
      </Col>
	<Col span={8}>
        <Checkbox value="QR-кодом">QR-кодом</Checkbox>
      </Col>
    </Row>
  </Checkbox.Group>

  <br /> 
        <span>Выберите фото для титульной фотографии:</span>
  <div><UploadImgCamper setImage={setImage} /></div>
  <br /> 
  <span>Выберите фото для дополнительных фотографий:</span>
  <div><UploadImgCamperAll/></div>
  <br /> 
	<Form.Item >
        <Button onClick={addHandler}  type="primary">Отправить</Button>
      </Form.Item>
		</Form>
			</div>
		
	)
}
