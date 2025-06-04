import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import MapYandex from '../Map/Map';
import PlaceCard from '../RoutCampCard/RoutCampCard';
import styles from './rp.module.css';
import { fetchCamper } from '../../../redux/thunkActions';

export default function RoutesPage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(fetchCamper());
  }, [dispatch]);

  const campers = useAppSelector((store) => store.camperSlice.todoList);


  return (
    <div className={styles.flex}>
      <div className={styles.cards}>
        {campers.map((camp) => (
          <PlaceCard camp={camp} />
        ))}
      </div>
      <div className={styles.map}>
        <MapYandex campers={campers} />
      </div>
    </div>
  );
}
