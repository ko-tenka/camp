import { Link } from 'react-router-dom';
import styles from './routelist.module.css';

export default function RouteList({route}) {


  return (
    <Link to={`routes/${route.rout.id}`} style={{textDecoration: 'none'}}> 
   <div className={styles.cards}>
       <div className={styles.cardTop} style={{ backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0)), url(${route.rout.img})`}}> 
            <h2>{route.rout.title}</h2>
            <div className={styles.circleContainer}>
            <div className={styles.circle}>
              <h3>{route.rout.days}</h3>
              <p style={{fontSize: '12px'}}>дней</p>
              </div>
            <div className={styles.circle}>
              <h3>{route.rout.km}</h3>
              <p style={{fontSize: '12px'}}>км</p>
          </div>
        </div>
      </div>
    <div className={styles.cardDown}>
    <h2>{route.rout.data}</h2>
    </div>
   </div>
   </Link>
  )
}
