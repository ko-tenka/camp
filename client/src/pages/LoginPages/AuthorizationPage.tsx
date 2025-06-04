
// import { useContext, useState } from 'react';
// import styles from './Login.module.css';
// import { useNavigate } from 'react-router-dom';

// import axios from 'axios';
// import { UserContext } from '../../context/userContext';

// export function AuthorizationPage() {

//   const [inputs, setInputs] = useState({ email: '', password: '' }); 
//   const [errRegMassage, setErrRegMassage] = useState(''); 
//   const { login, setLogin } = useContext(UserContext);

//     const navigate = useNavigate();  


  
//   const addHandler = async (e) => {
//     e.preventDefault();
  
//     if (Object.values(inputs).some(value => value === '')) {
//     setErrRegMassage('Заполни все поля')
//     return; 
//   }

//      try {
//     const response = await axios.post('http://localhost:3000/login', inputs, { withCredentials: true });
//     const data = response.data;

//     if (data.err) {
//       setErrRegMassage(data.err);
//     } else {
//       setLogin(true);
//       navigate('/');
      
//     }
//   } catch (error) {
//     console.error('Ошибка при выполнении запроса:', error);
//     setErrRegMassage('Произошла ошибка при авторизации');
//   }
  
//   };



//   const handleInputChange = (e) => {
      
//    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// };

//     return (
//        <div className={styles.container}>
//         <form className={styles.form} onSubmit={addHandler}>
//           {errRegMassage.length > 0? <p>{errRegMassage}</p> : <p></p>}
//           <h3 className={styles.headerReg}>Вход</h3>
      
      
//           <div className={styles.formGroup}>
//             <input name="email" type="text" className={styles.formInput}  placeholder=' ' value={inputs.email} onChange={handleInputChange}/>
//             <label htmlFor="email" className={styles.formLabel} >
//               Логин
//             </label>
//           </div>
//           <div className={styles.formGroup}>
//             <input name="password" type="password" className={styles.formInput} placeholder=' ' value={inputs.password } onChange={handleInputChange}/>
//             <label htmlFor="password" className={styles.formLabel}>
//               Пароль
//             </label>
//           </div>
					
//             <button type="submit" className={styles.formButton}>
//             Войти
//           </button>
       
//         </form>
//       </div>
//     );
// }



