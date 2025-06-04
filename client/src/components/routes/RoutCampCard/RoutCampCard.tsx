import { Link } from 'react-router-dom';
import styles from './pc.module.css';
import { Card, Carousel, Flex, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function RoutCampCard({ camp }) {
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
      <Card
        className={styles.card}
        hoverable
        styles={{ body: { padding: 0, overflow: 'hidden' } }}
      >
        <Link to={`/camper/${camp.id}`}>
          <Flex justify="space-between" className={styles.flexCard}>
            <div className={styles.carousel}>
              <Carousel
                arrows
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
                      alt="avatar"
                      src={
                        camp.img.includes('http')
                          ? camp.img
                          : `http://localhost:3000/images/${camp.img}`
                      }
                      className={styles.img}
                    />
                  </h3>
                </div>
                {camp.img2 !== null ? (
                  camp.img2.split(',').map((el, i) => (

                      <div key={`imgroutcamp${i}`}>
                        <h3 style={contentStyle}>
                          <img
                            alt="avatar"
                            src={
                              camp.img.includes('http')
                                ? el
                                : `http://localhost:3000/images/${el}`
                            }
                            className={styles.img}
                          />
                        </h3>
                      </div>

                  ))
                ) : (
                  <></>
                )}
              </Carousel>
            </div>

            <Flex
              className={styles.flexText}
              vertical
              align="flex-start"
              justify="flex-start"
            >
              <Title level={5}>{camp.title}</Title>
              <Text>{camp.data.slice(0, 107)}</Text>
            </Flex>

            <div className={styles.line}></div>

            <Flex
              className={styles.flexPrice}
              vertical
              align="flex-start"
              justify="flex-start"
            >
              <Text>Цена за место в сутки:</Text>
              {camp.shelterCount === 0 ? (
                <></>
              ) : (
                <Text type="secondary">
                  Палатка: <Text strong>{camp.shelterPrice} ₽</Text>
                </Text>
              )}
              {camp.campCount === 0 ? (
                <></>
              ) : (
                <Text type="secondary">
                  Автокемпер: <Text strong>{camp.camperPrice} ₽</Text>
                </Text>
              )}
            </Flex>
          </Flex>
        </Link>
      </Card>
    </>
  );
}
