import React, { useState, useEffect } from 'react';
import RoutingMap from './RoutingMap';

function App() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setSource({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => alert('Please enable location on your device.')
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(e.target.lat.value);
    const lng = parseFloat(e.target.lng.value);
    setDestination({ lat, lng });
  };

  const orsApiKey = 'YOUR_OPENROUTESERVICE_API_KEY';

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ position: 'absolute', zIndex: 1000, background: 'white', padding: '10px' }}>
        <input type="text" name="lat" placeholder="Destination Latitude" required />
        <input type="text" name="lng" placeholder="Destination Longitude" required />
        <button type="submit">Set Destination</button>
      </form>
      {source && destination && (
        <RoutingMap source={source} destination={destination} apiKey={orsApiKey} />
      )}
    </div>
  );
}

export default App;
