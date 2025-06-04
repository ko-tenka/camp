import { useState } from 'react';
import styles from './slr.module.css';
import { Link } from 'react-router-dom';

export default function ShotList({camp}) {


  return (
        <div className={styles.container}>
        <Link to={`/camper/${camp.id}`} style={{textDecoration: 'none'}}>
   
        <div className={styles.card}>
          {camp.img.includes('http') ? (
            <>
            <div className={styles.cardTop} style={{backgroundImage: `url(${camp.img})`}}/>
            </>
          ):(
            <>
          <div className={styles.cardTop} style={{backgroundImage: `url(http://localhost:3000/images/${camp.img})`}}/>
            </>
          )}

          <div className={styles.cardDown}>
            <h1>{camp.title}</h1>
            {/* <p> {camp.addition}</p> */}
            <p> {camp.location}</p>
          </div>
        </div>
      </Link>
      </div>
  )
}
