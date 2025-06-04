import { YMaps, Map, Placemark, Polyline, useYMaps } from '@pbe/react-yandex-maps';

export default function MapYandex({ rout }) {
  let wCenter
  let eCenter
  const campPoints = []
  let arrCoordinates = [];
  const placePoints = []
  if (rout) {
    let wArr = []
    let eArr = []
    for (let z= 0; z<rout.length; z++) {
      for (let x = 0; x<rout[z].length; x++){
        campPoints.push(rout[z][x].Camper)
        placePoints.push(rout[z][x].Place)
        wArr.push(rout[z][x].Place.wCoordinates)
        eArr.push(rout[z][x].Place.eCoordinates)
        arrCoordinates.push([Number(rout[z][x].Place.wCoordinates),Number(rout[z][x].Place.eCoordinates)])
      } 
    }
    wCenter = wArr.reduce((a, b) => a + Number(b), 0) / wArr.length;
    eCenter = eArr.reduce((a, b) => a + Number(b), 0) / eArr.length;
  } else {
    wCenter = 50
    eCenter = 50 
   arrCoordinates = [[50,50], [51,51]];
  }
  
  
  return (

      <YMaps>
      <Map
        defaultState={{
          center: [wCenter, eCenter],
          zoom: 5,
          controls: ['zoomControl'],
        }}
        width="100%"
        height="100%"
        modules={['control.ZoomControl', 'control.FullscreenControl']}
      >
        {placePoints.map((place, i) => (
          <Placemark
            key={`place${i}`}
            geometry={[place.wCoordinates, place.eCoordinates]}
            options={{ preset: 'islands#blueMountainIcon' }}
            properties={{
              hintContent: `${place.title}`,
              // balloonContent: `<div>${place.data}</div>`,
            }}
            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
          />
        ))}
        <Polyline
          geometry={arrCoordinates}
          options={{
            balloonCloseButton: false,
            strokeColor: '#1E90FF',
            strokeWidth: 5,
            strokeOpacity: 0.5,
          }}
        />
      </Map>
    </YMaps>
    
  );
}
