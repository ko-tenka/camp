
import RoutCampCard from "../routes/RoutCampCard/RoutCampCard";
import Place from "./Place/Place";
import style from './PlaceCard.module.css'
import { Space, Typography } from 'antd';

export default function PlaceCard({place}){
    const { Text, Link } = Typography;

    return (
        <>
        {place.Camper === null ? (
            <>
            <Place place={place.Place} />
            </>

        ):(
            <>
            <Place place={place.Place} />
            <div className={style.line}></div>
            <Text type="secondary">отановиться в:</Text>
            <RoutCampCard camp={place.Camper}/>
            </>
        )}
        </>
    )
}