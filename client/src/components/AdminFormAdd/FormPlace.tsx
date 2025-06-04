import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/userContext';
import { useAppDispatch } from '../../redux/hook';
import { fetchAdminPlace } from '../../redux/thunkActions';
import styles from './Place.module.css'
import { Button, Form, Input } from 'antd';

const { TextArea } = Input;

export default function FormPlace() {

const [inputsPlace, setInputsPlace] = useState({
	title: '',
	img:'',
    eCoordinates: '',
    wCoordinates: '',
    data: '',
   
});
	
	const { message, setMessage } = useContext(UserContext);

	const dispatch = useAppDispatch()

const changeHandler = (e) => {
    setInputsPlace((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const addHandler = async () => {
		 
const emptyFields = Object.keys(inputsPlace).filter(key => typeof inputsPlace[key] === 'string' && inputsPlace[key].trim() === '');

    if (emptyFields.length > 0) {    
        setMessage('Пожалуйста, заполните все поля');
        return; 
		}
		dispatch(fetchAdminPlace(inputsPlace))
		 setMessage('Готово!');
 
  };

	return (
	 <div className={styles.formContainer}>
		
			<h1>Добавить остановку(Памятники и тд.)</h1>
			<p style={{ color: message === 'Готово!' ? 'rgba(144, 238, 144)' : 'red' }}>{message}</p>
				<strong>Название места:</strong>
				<Input
					onChange={changeHandler}
					value={inputsPlace.title}
					name='title'
					type='text'
					placeholder=''
			/>
			<strong>Фотография:</strong>
				<Input
					onChange={changeHandler}
					value={inputsPlace.img}
					name='img'
					type='text'
					placeholder=''
				/>
				<strong>eCoordinates:</strong>
				<Input
					onChange={changeHandler}
					value={inputsPlace.eCoordinates}
					name='eCoordinates'
					type='text'
					placeholder=''
				/>
					<strong>wCoordinates:</strong>
				<Input
					onChange={changeHandler}
					value={inputsPlace.wCoordinates}
					name='wCoordinates'
					type='text'
					placeholder=''
				/>
					<strong>Описание:</strong>

			<TextArea style={{  maxHeight:100, minHeight:45 }} rows={4} placeholder="" onChange={changeHandler}
					value={inputsPlace.data}
					name='data'
					type='text'
				 maxLength={500} />
				
				<Form.Item >
        <Button onClick={addHandler} type="primary">Submit</Button>
      </Form.Item>
			</div>
		)
}
