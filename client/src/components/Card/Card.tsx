import './Card.css';
import Calendar from '../Calendar/Calendar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel, Flex, Spin, Typography } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import OneCampMap from '../routes/OneCampMap/OneCampMap';
import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from 'react-scroll';
const { Text, Title } = Typography;

export default function Card(): JSX.Element {
  const { id } = useParams();
  const [camper, setCamper] = useState({});
  const [oneCampLoading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/camper/${id}`)
      .then((store) => {
        setCamper(store.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const contentStyle: React.CSSProperties = {
    margin: 0,
    color: '#fff',
    textAlign: 'center',
    background: '#364d79',
  };
  const SlickButtonFix = ({ currentSlide, slideCount, children, ...props }) => (
    <span {...props}>{children}</span>
  );

  return (
    <>
      <div className="myCard">
        {oneCampLoading ? (
          <>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </>
        ) : (
          <>
            <div className="flexCard">
              <div className="headerFlex">
                <div className="header">
                  {camper.title ? (
                    <h3 className="title">{camper.title}</h3>
                  ) : (
                    <h3>Нет тайтла</h3>
                  )}
                  <div className="str">
                    {camper.rate ? (
                      <h3>⭐️ {camper.rate}</h3>
                    ) : (
                      <h3>⭐️ рейтинг отсутствует</h3>
                    )}

                    <div className="elem">
                      <p>{camper.location}</p>
                    </div>
                    <div className="elem">
                      <Link
                        activeClass="active"
                        to="map1"
                        spy={true}
                        smooth={true}
                        duration={500}
                      >
                        Показать на карте?
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="img_calendar_conteiner">
                <div className="border">
                  <Carousel
                    arrows
                    className="img_c"
                    nextArrow={
                      <SlickButtonFix currentSlide slideCount>
                        <RightOutlined />
                      </SlickButtonFix>
                    }
                    prevArrow={
                      <SlickButtonFix currentSlide slideCount>
                        <LeftOutlined />
                      </SlickButtonFix>
                    }
                    infinite={true}
                  >
                    <div>
                      <h3 style={contentStyle}>
                        <img
                          className="img"
                          alt="avatar"
                          src={
                            camper.img.includes('http')
                              ? camper.img
                              : `http://localhost:3000/images/${camper.img}`
                          }
                        />
                      </h3>
                    </div>

                    {camper.img2 !== null ? (
                      camper.img2.split(',').map((el, i) => (
                        <div key={`imggg${i}`} className="img">
                          <h3 style={contentStyle}>
                            <img
                              className="img"
                              alt="img"
                              src={
                                camper.img.includes('http')
                                  ? el
                                  : `http://localhost:3000/images/${el}`
                              }
                            />
                          </h3>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                  </Carousel>
                </div>

                <div className="dataConteiner">
                  {camper ? (
                    <>
                      <Calendar camper={camper} />
                      <div className="price">
                        <p>Стоимость места в сутки:</p>
                        <br />
                        <Text type="secondary">
                          Палатка: <Text strong>{camper.shelterPrice} ₽</Text>
                        </Text>
                        <Text type="secondary">
                          Место под кемпер:{' '}
                          <Text strong>{camper.camperPrice} ₽</Text>
                        </Text>
                      </div>
                    </>
                  ) : (
                    <h5>Запись не найдена</h5>
                  )}
                </div>
              </div>

              {camper.data ? (
                <>
                  <div className="data">
                    <h3>Описание:</h3>
                    {camper.data}
                  </div>
                </>
              ) : (
                <h3>Нет текста</h3>
              )}

              <div className="pravilo">
                <div className="data">
                  <h3>Основные удобства:</h3>
                  <p>Тип места: {camper.place_type}</p>
                  <p>Сезонность: {camper.seasonality}</p>
                  <p>Способ оплаты: {camper.pay_by_card}</p>
                  <p>Водоемы: {camper.reservoir}</p>
                  <p>Развлечения: {camper.entertainment}</p>
                  <p>Коммуникации: {camper.communication}</p>
                  <p>Условия: {camper.sanitation}</p>
                </div>
              </div>

              <Element name="map1" className="element">
                <div className="map">
                  <OneCampMap camp={camper} />
                </div>
              </Element>
            </div>
          </>
        )}
      </div>
    </>
  );
}
