import React, { useEffect, useState } from 'react'
import styles from './pp.module.css'
import { Link, Outlet } from 'react-router-dom'
import { AppstoreOutlined, CalendarOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import axios from 'axios';

type MenuItem = Required<MenuProps>['items'][number];





export default function PartnerPage() {

  
  
  const items: MenuItem[] = [
    {
      label: (<Link to={'calendar'}>Даты бронирований</Link>),
      key: 'booking',
      icon: <CalendarOutlined />,
    
    },
    {
      label: (<Link to={'camper'}>Добавить новый кемпинг</Link>),
      key: 'addCamp',
      icon: <AppstoreOutlined />,
    },
  
  ];
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      <div className={styles.container}>
      <div>
        <Outlet />
      </div>
   
  </div> 
  </> 
  
  )
}

