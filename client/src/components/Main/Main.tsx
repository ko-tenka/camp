import { SetStateAction, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { fetchCamper, fetchRoute } from '../../redux/thunkActions';
import ShotList from '../ShotList/ShotList';
import { Link, Route } from 'react-router-dom';
import RouteList from '../RouteList/RouteList';
import styles from './main.module.css';
import { Button, Calendar, InputNumber, Spin } from 'antd';
import CalendarRange from '../routes/CalendarRange/CalendarRange';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

export default function Camping(): JSX.Element {
  const [selectedType, setSelectedType] = useState('');
  const [routeRoutes, setRouteRoutes] = useState<Route[]>([]);
  const { shelterCount, setShelterCount } = useContext(UserContext);
  const { camperCount, setCamperCount } = useContext(UserContext);
  const { bookingDate, setBookingDate } = useContext(UserContext);


  

  const dispatch = useAppDispatch();
  useEffect(() => {
    const parsDateStart = `${bookingDate[0].$y}-${bookingDate[0].$M + 1}-${
      bookingDate[0].$D
    }`;
    const parsDateEnd = `${bookingDate[1].$y}-${bookingDate[1].$M + 1}-${
      bookingDate[1].$D
    }`;
    const sendObj = { parsDateStart, parsDateEnd, shelterCount, camperCount };
    void dispatch(fetchCamper());
    void dispatch(fetchRoute(sendObj));
  }, []);

  const campers = useAppSelector((store) => store.camperSlice.todoList);
  const route = useAppSelector((store) => store.routeSlice.todoList);
  const loading = useAppSelector((store) => store.routeSlice.isLoading);

  const routesToShow = route.slice(0, 8);
  const campersToShow = campers.slice(0, 5);

  const currentCampHandler = async () => {
    const parsDateStart = `${bookingDate[0].$y}-${bookingDate[0].$M + 1}-${
      bookingDate[0].$D
    }`;
    const parsDateEnd = `${bookingDate[1].$y}-${bookingDate[1].$M + 1}-${
      bookingDate[1].$D
    }`;
    const sendObj = { parsDateStart, parsDateEnd, shelterCount, camperCount };
    if (selectedType.length) {
      const response = await axios.post(
        `http://localhost:3000/allbooking/main`,
        sendObj
      );
      if (response.data.length > 0) {
        if (selectedType === 'tentCamping') {
          const filteredRoutes = response.data.filter(
            (r) => r[0].rout.type === 'палатки'
          );
          const freeSpaceFilter = filteredRoutes.filter((arr) => {
            if (arr.length > 1) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].shelter === 'мест нет') {
                  return false;
                }
              }
            }
            return true;
          });
          setRouteRoutes(freeSpaceFilter);
        } else if (selectedType === 'vanCamping') {
          const filteredRoutes = response.data.filter(
            (r) => r[0].rout.type === 'автодом'
          );
          const freeSpaceFilter = filteredRoutes.filter((arr) => {
            if (arr.length > 1) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].camper === 'мест нет') {
                  return false;
                }
              }
            }
            return true;
          });
          setRouteRoutes(freeSpaceFilter);
        }
      } else {
        setRouteRoutes([]);
      }
    } else {
      void dispatch(fetchRoute(sendObj));
    }
  };

  const handleTypeClick = (type: SetStateAction<string>) => {
    setSelectedType(type);

    if (type === 'tentCamping') {
      const filteredRoutes = route.filter((r) => r[0].rout.type === 'палатки');
      setRouteRoutes(filteredRoutes);
    } else if (type === 'vanCamping') {
      const filteredRoutes = route.filter((r) => r[0].rout.type === 'автодом');
      setRouteRoutes(filteredRoutes);
    }
  };

  return (
    <div className={styles.body}>


<div className={styles.calendar}>
        <div className={styles.elements}>Даты поездки:</div>
        <CalendarRange className={styles.elements} />
        <div className={styles.elements}>
        <img className='bus' src="/camping.png" alt="Количество палаточных мест" />
        <InputNumber size="large" min={0} max={10} value={shelterCount} onChange={(e)=>setShelterCount(e)}/>
        </div>
        <div className={styles.elements}>
        <img className='bus' src="/bus.png" alt="Колличество пакровочных мест" />
        <InputNumber size="large" min={0} max={10} value={camperCount} onChange={(e)=>setCamperCount(e)}/>
        </div>
        <Button className={styles.elements} type="primary" size="large" onClick={currentCampHandler}>
            Найти место
        </Button>
      </div>

      <div>
        <div className={styles.cards}>
          <div
            onClick={() => {
              handleTypeClick('tentCamping')
              setCamperCount(0)
            }}
            alt="Шатровый кемпинг"
            className={styles.tentCamp}
          >
            <h3>"Шатровый кемпинг"</h3>
          </div>
          <div
            onClick={() => {
              handleTypeClick('vanCamping')
              setShelterCount(0)
            }}
            alt="Кемпинг в автодоме"
            className={styles.vanCamp}
          >
            <h3>"Кемпинг в автодоме" </h3>
          </div>
        </div>
      </div>
  <div className={styles.naviDiv}><h1>Маршруты</h1></div>
      {loading ? (
        <>
          {selectedType ? (
            <div>
              <div className={styles.cards}>
                {routeRoutes.map((route, i) => (
                  <RouteList key={`campingsrout${i}`} route={route[0]} />
                ))}
                <Link to="routegear" style={{ textDecoration: 'none' }}>
                  <div className={styles.allRouters}>
                    <h3>все маршруты</h3>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.cards}>
              {routesToShow.map((route, i) => (
                  <RouteList key={`rot${i}`} route={route[0]} />
              ))}
              <Link to="routegear" style={{ textDecoration: 'none' }}>
                <div className={styles.allRouters}>
                  <h3>все маршруты</h3>
                </div>
              </Link>
            </div>
          )}
        </>
      ) : (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      )}
       <div className={styles.naviDiv}><h1>Кемпинги</h1></div>
      <div className={styles.cardsCamping} >
        {campersToShow.map((camp, i) => (
          <ShotList key={`cmp${i}`} camp={camp}/>
        ))}
        <Link to="campings" style={{ textDecoration: 'none' }}>
          <div className={styles.allCamp}>
             <h1>Все кемпинги</h1> 
          </div>
        </Link>
      </div>
    </div>
  );
}

function setCampingTypes(arg0: (prev: any) => any) {
  throw new Error('Function not implemented.');
}
