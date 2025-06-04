import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import {
  fetchDeleteCard,
  fetchProfileGetBooking,
} from '../../redux/thunkActions';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button, Card, Space, message } from 'antd';
import styles from './ProfileBooking.module.css';
import { CarOutlined, TruckOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCampground } from '@fortawesome/free-solid-svg-icons';

export default function ProfileBooking() {
  const bookings = useAppSelector((state) => state.profileSlice.bookings);
  const { booking } = bookings;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfileGetBooking());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(fetchDeleteCard(id));
  };

  return (
    <div className={styles.cards}>
      {booking ? (
        booking?.map((el) => (
          <div key={el.id} className={styles.card}>
            <Card
              title={el.Camper.title}
              bordered={false}
              style={{ width: 300 }}
            >
              <p>Услуги палатки/парковки:</p>
              <div className={styles.img}>
                <img
                  className="bus"
                  src="/camping.png"
                  alt="Количество палаточных мест"
                />
                <p>{el.shelterCount}</p>

                <img
                  className="bus"
                  src="/bus.png"
                  alt="Количество парковочных мест"
                />
                <p>{el.camperCount}</p>
              </div>

              <br />
              <p>
                Время нахождения:
                {format(new Date(el.dateCheckIn), ' dd MMMM ', { locale: ru })}
                {format(new Date(el.dateDeparture), ' - dd MMMM ', {
                  locale: ru,
                })}
              </p>
              <p>
                Дата Бронирования:{' '}
                {format(new Date(el.updatedAt), 'dd MMMM HH:mm', {
                  locale: ru,
                })}
              </p>
              <Button onClick={() => handleDelete(el.id)} type="primary" danger>
                Отменить запись{' '}
              </Button>
            </Card>
          </div>
        ))
      ) : (
        <div>No bookings available</div>
      )}
    </div>
  );
}
