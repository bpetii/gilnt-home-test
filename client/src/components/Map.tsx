import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import {round} from './utils';
import {fetchHmax} from '../api/fetchHmax';

const Map = () => {
  const [maxWaveHeight, setMaxWaveHeight] = useState(null);
  const [unit, setUnit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);

  /* useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setSelectedPosition([latitude, longitude])
    });
  }, []);  */

  useEffect(() => {
    if (selectedPosition?.[0] && selectedPosition[0]) {
      fetchHmax(selectedPosition)
        .then(data => {
          const {value, unit} = data;
          setMaxWaveHeight(value);
          setUnit(unit)
          setError(null); // Reset error state on successful fetch
        })
        .catch(err => {
          console.error('Error fetching data:', err);
          setError('Failed to fetch data'); // Set error state
          setMaxWaveHeight(null);
          setUnit(null)
        });
    }
  }, [selectedPosition]);


  const Markers = () => {
    useMapEvents({
      click(e) {                                
        setSelectedPosition([
          e.latlng.lat,
          e.latlng.lng
        ]);                
      },            
    })

    return (
      selectedPosition ? 
        <Marker           
        key={`${selectedPosition[0]} - ${selectedPosition[1]}`}
        position={selectedPosition}
        >
          <Popup>
            {error && 'Error: ' + error}
            {maxWaveHeight !== null && `Max Wave Height: ${round(maxWaveHeight)}|${unit}` }
          </Popup>
        </Marker>
      : null
    )    
  }

  return (
    <MapContainer center={selectedPosition} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Markers />
    </MapContainer>
  );
};

export default Map;