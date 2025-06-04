import PlaceCard from "../PlaceCard/PlaceCard";
import style from './OneDayPlace.module.css';
import { Typography } from 'antd';

export default function OneDayPlace({day}){
    const { Title } = Typography;

    return (
        <>
        <div className={style.border}>
        <Title level={2}>День {day[0].day}</Title>
        {day.map((place, i)=><PlaceCard key={`pla${i}`} place={place}/>)}
        </div>
        </>
    )
}