import styles from './Place.module.css'
import { Space, Typography } from 'antd';

const { Text, Link } = Typography;


export default function Place({place}){
    return (
        <>
      <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardTop} style={{ backgroundImage: `url(${place.img})`}}>
            <h2>{place.title}</h2>
            </div>
            <div className={styles.cardDown}>
            <Text type="secondary">Координаты: {place.wCoordinates}, {place.eCoordinates}</Text>
            <p>{place.data}</p>
            </div>
          </div>
      </div>
        </>
    )
}