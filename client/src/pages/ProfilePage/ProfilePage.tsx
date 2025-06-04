import React, { useEffect } from 'react';
import styles from './ProfilePage.module.css';

import { fetchProfileGetBooking } from '../../redux/thunkActions';

import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import UploadImg from '../../components/UploadImgProfile/UploadImg';
import { Link, Outlet } from 'react-router-dom';
import {
  EditOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

export default function ProfilePage() {
  const bookings = useAppSelector((state) => state.profileSlice.bookings);
  const { name, booking, createdAt } = bookings;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfileGetBooking());
  }, [dispatch]);

  return (
    <div className={styles.containerProfile}>
      <div className={styles.header}>
        <div className={styles.img}>
          <UploadImg />
        </div>

        <div className={styles.nameBox}>
          <div>
            <h1>{name}</h1>
            {createdAt && (
              <div style={{ color: '#717A8F', fontSize: '12px' }}>
                {createdAt &&
                  format(
                    new Date(createdAt),
                    "'Дата регистрации: 'dd MMMM yyyy 'г. в' HH:mm",
                    { locale: ru }
                  )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.navPanel}>
          <Link to="bookingProf" className={styles.cards}>
            <UsergroupAddOutlined className={styles.navIcon} />
            Бронирования
          </Link>
          <Link to="settings" className={styles.cards}>
            <SettingOutlined className={styles.navIcon} />
            Настройки
          </Link>
        </div>

        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
