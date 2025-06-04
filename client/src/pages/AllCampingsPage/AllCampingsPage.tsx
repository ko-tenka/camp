import { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import styles from './allcampings.module.css';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Button, InputNumber } from 'antd';
import CalendarRange from '../../components/routes/CalendarRange/CalendarRange';
import CampingsMap from '../../components/routes/CampingsMap/CampingsMap';
import { UserContext } from '../../context/userContext';
import CamperCard from '../../components/routes/CamperCard/CamperCard';

export default function AllCapingsPage() {
    const {shelterCount, setShelterCount} = useContext(UserContext)
    const {camperCount, setCamperCount} = useContext(UserContext)
    const {bookingDate, setBookingDate} = useContext(UserContext)
    const [campersState, setCampers] = useState([])
    const [loading, setLoadind] = useState(true)
    
    
    useEffect(() => {
        const parsDateStart = `${bookingDate[0].$y}-${bookingDate[0].$M+1}-${bookingDate[0].$D}`
        const parsDateEnd = `${bookingDate[1].$y}-${bookingDate[1].$M+1}-${bookingDate[1].$D}`
        fetch(`http://localhost:3000/allbooking?start=${parsDateStart}&end=${parsDateEnd}&shelter=${shelterCount}&camper=${camperCount}`).then((data)=>data.json())
        .then((data)=>{
          setCampers(data)
          setLoadind(false)
        })
      }, []);

      function currentCampHandler(){
        setLoadind(true)
        const parsDateStart = `${bookingDate[0].$y}-${bookingDate[0].$M+1}-${bookingDate[0].$D}`
        const parsDateEnd = `${bookingDate[1].$y}-${bookingDate[1].$M+1}-${bookingDate[1].$D}`
        fetch(`http://localhost:3000/allbooking?start=${parsDateStart}&end=${parsDateEnd}&shelter=${shelterCount}&camper=${camperCount}`).then((data)=>data.json())
        .then((data)=>{
          if (data.length>0) {
            setCampers(data)
          } else {
            setCampers([])
          }
          setLoadind(false)
        })
      }
    
  
  return (
    <><div className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.elements}>Даты поездки:</div>
        <CalendarRange className={styles.elements} />
        <div className={styles.elements}>
        <img className='bus' src="/camping.png" alt="Количество палаточных мест" />
        <InputNumber size="large" min={0} max={10} defaultValue={shelterCount} onChange={(e)=>setShelterCount(e)}/>
        </div>
        <div className={styles.elements}>
        <img className='bus' src="/bus.png" alt="Колличество пакровочных мест" />
        <InputNumber size="large" min={0} max={10} defaultValue={camperCount} onChange={(e)=>setCamperCount(e)}/>
        </div>
        <Button className={styles.elements} type="primary" size="large" onClick={currentCampHandler}>
            Найти место
          </Button>
      </div>
      <div className={styles.flex}>
        <div className={styles.map}>
          {loading ? (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          ) : (
            <>
            <CampingsMap campers={campersState} />
            </>
          )}
        </div>
        <div className={styles.cards}>
          {loading ? (
            <>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
            </>
          ) : (
            <>
            {campersState.length ? (
                        <>{campersState.map((camp, i) => (
                          <CamperCard key={`cardcamp${i}`} camp={camp} />
                        ))}</>

          ): (
            <div>на ваши даты свободных мест нет</div>
            )}
 
            </>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
