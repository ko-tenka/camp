import React from 'react'
import footer from '../../assets/footer.jpg'
import  circle  from '../../assets/circle.png'
import telegram from '../../assets/telegram.png'
import facebook from '../../assets/facebook-app-symbol.png'
import vk from '../../assets/vk-social-network-logo.png'
import youtube from '../../assets/youtube.png'
import styles from './Footer.module.css' 

export default function Footer() {
  return (
<div>
  <div className={styles.footer_photo}>
    <img src={footer} alt="Картинка" />
  </div>
  <div className={styles.footer}>
    <div className={styles.footer1}>
    <div className={styles.slovo}>
        <p>Давайте дружить:</p>
    </div>
    <div className={styles.icons}>
      <div className={styles.icon}>
        <img className={styles.circle} src={circle} alt="Круг" />
        <img className={styles.one_icon} src={telegram} alt="Иконка Telegram" />
      </div>
      <div className={styles.icon}>
        <img className={styles.circle} src={circle} alt="Круг" />
        <img className={styles.one_icon} src={facebook} alt="Иконка Facebook" />
      </div>
      <div className={styles.icon}>
        <img className={styles.circle} src={circle} alt="Круг" />
        <img className={styles.one_icon} src={vk} alt="Иконка VK" />
      </div>
      <div className={styles.icon}>
        <img className={styles.circle} src={circle} alt="Круг" />
        <img className={styles.one_icon} src={youtube} alt="Иконка YouTube" />
      </div>
    </div>
  </div>
  <div className={styles.txt}>
        <p> 2023-2024 Гид по лучшим кемпингам, сайт №1 о караванинге и автотуризме в России. Справочник кемпингов с поиском и подбором мест по параметрам, а также каталог компаний, маршруты, исследовательские спецпроекты. На сайте можно выбрать проверенные кемпинги с развитой инфраструктурой для беззаботной поездки с караваном или автодомом всей семьёй или открыть для себя новые и необычные места, куда можно отправиться на отдых.
        </p>
  </div>
  <div className={styles.sviz}>
    <a className={styles.whiteA} href="/">О проекте</a> 
    <p className={styles.palochka}>|</p> 
    <a className={styles.whiteA} href="/">Контакты редакции</a> 
    <p className={styles.palochka}>|</p> 
    <a className={styles.whiteA} href="/">Реклама</a>  
    <p className={styles.palochka}>|</p> 
    <a className={styles.whiteA} href="/">Добавить материал</a>
  </div>
</div>
</div>

  )
}
