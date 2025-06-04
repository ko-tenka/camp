import { Link } from 'react-router-dom';
import styles from './pc.module.css';
import { Card, Carousel, Flex, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function CamperCard({ camp }) {
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
    <Card
      className={styles.card}
      hoverable
      styles={{ body: { padding: 0, overflow: 'hidden' } }}
    >
      <Link to={`/camper/${camp.data.id}`}>
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
                    alt="img"
                    src={camp.data.img.includes('http') ?(camp.data.img)  :(`http://localhost:3000/images/${camp.data.img}`) }
                    className={styles.img}
                  />
                </h3>
                </div>
              {camp.data.img2 ? (camp.data.img2.split(',').map((el, i)=>(

              <div key={`imgroutcamp${i}-${camp.data.id}`}>
                <h3 style={contentStyle}>
                  <img
                    alt="imgs"
                    src={camp.data.img.includes('http') ?  (el) :(`http://localhost:3000/images/${el}`)}
                    className={styles.img}
                  />
                </h3>
                </div>

            ))
          ):(
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
            <Title level={5}>{camp.data.title}</Title>
            <Text>{camp.data.data.slice(0,30)}</Text>
          </Flex>

          <div className={styles.line}></div>

          <Flex
            className={styles.flexPrice}
            vertical
            align="flex-start"
            justify="flex-start"
          >
            <Text>Цена за место в сутки:</Text>
            {camp.data.shelterCount === 0 ? (
              <></>
            ) : (
              <Text type="secondary">
                Палатка: <Text strong>{camp.data.shelterPrice} ₽</Text>
              </Text>
            )}
            {camp.data.camperCount === 0 ? (
              <></>
            ) : (
              <Text type="secondary">
                Автокемпер: <Text strong>{camp.data.camperPrice} ₽</Text>
              </Text>
            )}
          </Flex>
        </Flex>
      </Link>
    </Card>
  );
}
