import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

function Map({lat, long, label, address}){
    return (
        <MapContainer
        style = {{width: "50%", minWidth: "400px", minHeight: "100%", height: "430px"}}
        center={[lat, long]} 
        zoom={14} 
        scrollWheelZoom={false} 
        >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, long]}>
            <Popup>
                {label}<br />{address}
            </Popup>
        </Marker>
        <RecenterAutomatically lat={lat} long={long} />
    </MapContainer>
    )
}

const RecenterAutomatically = ({lat,long}) => {
    const map = useMap();
     useEffect(() => {
       map.setView([lat, long]);
     }, [map, lat, long]);
     return null;
}

export default Map;
  
