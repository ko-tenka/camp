import { Link, Outlet } from "react-router-dom";
import styles from './Admin.module.css'
import { Menu } from "antd";
import type { MenuProps } from 'antd';
import { useState } from "react";
import { AppstoreOutlined, CalendarOutlined } from "@ant-design/icons";


type MenuItem = Required<MenuProps>['items'][number];

export default function AdminPage() {

  const [current, setCurrent] = useState('mail');
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
    {
      label: (<Link to={'route'}>Добавить новый маршрут</Link>),
      key: 'addRoute',
      icon: <AppstoreOutlined />,
    },
    {
      label: (<Link to={'place'}>Добавить новое место</Link>),
      key: 'addPlace',
      icon: <AppstoreOutlined />,
    },
  ];
	
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
  );
}
