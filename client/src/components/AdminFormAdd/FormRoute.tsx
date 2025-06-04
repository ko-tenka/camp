import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { useAppDispatch } from '../../redux/hook';
import { fetchAdminRoute } from '../../redux/thunkActions';
import { Select, Input, Form, Button } from 'antd';
import styles from './Place.module.css'

const { TextArea } = Input;

export default function FormRoute() {
  const [inputsRoute, setInputsRoute] = useState({
    title: '',
    data: '',
    type: '',
  });

  const { message, setMessage } = useContext(UserContext);

  const dispatch = useAppDispatch();

  const changeHandler = (e) => {
    setInputsRoute((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addHandler = async () => {
    const emptyFields = Object.keys(inputsRoute).filter(
      (key) => typeof inputsRoute[key] === 'string' && inputsRoute[key].trim() === ''
    );

    if (emptyFields.length > 0) {
      setMessage('Пожалуйста, заполните все поля');
      return;
		}
		
		dispatch(fetchAdminRoute(inputsRoute));
	 setMessage('Готово!');
	 
		
  };

  const options = [
    { value: 'Автодом', label: <span>Автодом</span> },
    { value: 'Палатки', label: <span>Палатки</span> },
  ];

  const typeChangeHandler = (value) => {
    setInputsRoute((prev) => ({ ...prev, type: value }));
  };

  return (
    <div className={styles.formContainer}>
      <h1>Добавить маршрут</h1>
		
			<p style={{ color: message === 'Готово!' ? 'rgba(144, 238, 144)' : 'red' }}>{message}</p>

      <strong>Название маршрута:</strong>
      <Input
        onChange={changeHandler}
        value={inputsRoute.title}
        name="title"
        type="text"
        placeholder=""
      />
      
      <strong>Тип(Палатки/Автодом):</strong>
      <Select style={{ width: 500, height:45 }} options={options} onChange={typeChangeHandler} />
		
      <strong>Описание маршрута:</strong>
<TextArea style={{  maxHeight:100, minHeight:45 }} rows={4} placeholder="" onChange={changeHandler}
					value={inputsRoute.data}
					name='data'
					type='text'
				 maxLength={500} />

			

			<Form.Item >
        <Button onClick={addHandler} type="primary">Submit</Button>
      </Form.Item>
    </div>
  );
}
