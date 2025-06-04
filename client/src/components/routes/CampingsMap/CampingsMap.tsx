import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export default function CampingsMap({ campers }) {
  let wCenter
  let eCenter

  if (campers.length>0) {
    wCenter =
      campers.reduce((a, b) => a + Number(b.data.wCoordinates), 0) / campers.length;
    eCenter =
      campers.reduce((a, b) => a + Number(b.data.eCoordinates), 0) / campers.length;

  } else {
    wCenter = 50 
    eCenter = 50 
  }
  
  
  return (
    <YMaps>
      <Map
        defaultState={{
          center: [wCenter, eCenter],
          zoom: 3,
          controls: ['zoomControl'],
        }}
        width="100%"
        height="100%"
        modules={['control.ZoomControl', 'control.FullscreenControl']}
      >
        {campers.length>0 ? (

          <>
          {campers.map((camp, i) => (
            <Placemark
              key={`point${i}`}
              geometry={[camp.data.wCoordinates, camp.data.eCoordinates]}
              options={{ preset: 'islands#blueMountainIcon' }}
              properties={{
                hintContent: `${camp.data.title}`,
                balloonContent: `<div>${camp.data.data}</br><a href="camper/${camp.id}"><button type='button'>Забронировать</button></a></div>`,
              }}
              modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
            />
          ))}
          </>
        
      ):(
        <>

        </>
        )}
      </Map>
    </YMaps>
  );
}
