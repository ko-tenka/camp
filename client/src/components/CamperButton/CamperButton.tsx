import { Link } from 'react-router-dom';
import styles from './pc.module.css';
import { Card, Carousel, Flex, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { memo } from 'react';

const { Text, Title } = Typography;

function CamperButton({ camp }) {
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
      
        <Flex justify="space-between" className={styles.flexCard}>
          <div className={styles.carousel}>
                  <img
                    alt="avatar"
                    src={camp.img.includes('http') ?(camp.img)  :(`http://localhost:3000/images/${camp.img}`) }
                    className={styles.img}
                  />
          </div>
          <Flex
            className={styles.flexText}
            vertical
            align="flex-start"
            justify="flex-start"
          >
            <Title level={5}>{camp.title}</Title>
          </Flex>

        </Flex>

    </Card>
  );
}

export default memo(CamperButton);