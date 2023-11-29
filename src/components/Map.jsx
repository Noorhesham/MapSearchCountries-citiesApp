import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'
import { MapContainer,TileLayer,Marker,Popup, useMap, useMapEvent } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import {useGeolocation} from "../hooks/useGeolocation"
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';
const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char-127397).toLowerCase()).join('')
    return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
}

function Map() {
    //click on map=> url changes=>state
    const [mapPosition,setmapPostion]=useState([40,0])
    const {isLoading:isLoadingPosition,position:geolocationsPosition,getPosition}=useGeolocation()
    const {cities,searchcoords}=useCities();
    const [maplat,maplng]=useUrlPosition()
    useEffect(function(){ //responds to the changes in the url lat lng and rerender the state
    if(maplat&&maplng)setmapPostion([maplat,maplng])
    },[maplat,maplng])
    
    useEffect(function(){
        if(geolocationsPosition) setmapPostion([geolocationsPosition.lat,geolocationsPosition.lng])
    },[geolocationsPosition])
    return (
        <div className={styles.mapContainer}>
        {!geolocationsPosition&&<Button type='position' onClick={getPosition}>
            {isLoadingPosition?'Loading....':'Use your position'}
        </Button>}
  <MapContainer center={mapPosition} zoom={12} scrollWheelZoom={true} className={styles.map}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {cities.map(city=><> <Marker position={[city.position.lat,city.position.lng]} key={city.id}>
      <Popup>
       <span>{city.emoji?flagemojiToPNG(city.emoji):''}</span>
       <span>{city.cityName}</span>
      </Popup>
    </Marker></>)}
    <ChangeCentre position={mapPosition}/>
    <DetectClick/>
  </MapContainer>

        </div>
    )
}
function ChangeCentre({position}){
    const map=useMap(); //using current map to set the view of the given position 
    map.setView(position)
    return null;
}
function DetectClick(){
    const navigate=useNavigate() //from react 
    useMapEvent({click:e=>navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)} ) //from leaflet library and the event gives us the coords of the click
}
export default Map
//when we click the lat lng url changes which triggers a new rerender to the states 