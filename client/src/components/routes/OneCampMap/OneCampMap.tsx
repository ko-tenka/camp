import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export default function OneCampMap({ camp }) {
    
  return (
    <YMaps>
      <Map
        defaultState={{
          center: [camp.wCoordinates, camp.eCoordinates],
          zoom: 5,
          controls: ['zoomControl'],
        }}
        width="100%"
        height="100%"
        modules={['control.ZoomControl', 'control.FullscreenControl']}
      >


          <>
            <Placemark
              key={`point${camp.id}`}
              geometry={[camp.wCoordinates, camp.eCoordinates]}
              options={{ preset: 'islands#blueMountainIcon' }}
            />

          </>
        

      </Map>
    </YMaps>
  );
}
