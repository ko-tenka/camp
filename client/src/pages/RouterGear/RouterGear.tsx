import { useEffect, useState } from "react";
import styles from './rg.module.css';
import { Link } from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function RouterGear(): JSX.Element {
    const [routes, setRoutes] = useState([])
    const [loading, setLoadind] = useState(true)

    useEffect(() => {
        axios.get('http://localhost:3000/routes')
        .then((data)=>{
          setRoutes(data.data)
          setLoadind(false)
        })
        .catch((err)=>console.log(err))
      }, []);



  return (
    <>
    <div className={styles.container}>
      <h1 className={styles.name}>Маршруты для путешествий!</h1>
      <div className={styles.cards}>
        {loading ? (
           <Spin
           indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
         />
        ):(
          <>
           {routes.map((route, i) => (
          <div key={`rtt${i}`}>
          <Link to={`/routes/${route.id}`} style={{textDecoration: 'none'}}>
          <div key={route.id} className={styles.card}>
            <div className={styles.cardTop} style={{ backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0)), url(${route.img})`}}>
            <h2>{route.title}</h2>
            <div className={styles.circleContainer}>
            <div className={styles.circle}>
              <h3>{route.days}</h3>
              <p style={{fontSize: '12px'}}>дней</p>
              </div>
            <div className={styles.circle}>
              <h3>{route.km}</h3>
              <p style={{fontSize: '12px'}}>км</p>
            </div>
          </div>
            </div>
            <div className={styles.cardDown}>
            <p>{route.data}</p>
            </div>
          </div>
          </Link>
          </div>
        ))}
          </>
        )}
       
      </div>
    </div>
    </>
  )
}

