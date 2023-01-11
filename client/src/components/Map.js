import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

function Map({lat, long, label, address}){
    return (
        <MapContainer
        className="mt-4" 
        style = {{width: "auto", height: "450px"}}
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
     }, [lat, long]);
     return null;
}



        /*
        <MapContainer
            center={[lat, long]}
            zoom={11}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '210px' }}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={lat, long}>
                <Popup>{`${label}`}</Popup>
            </Marker>
        </MapContainer>*/


export default Map;
  
