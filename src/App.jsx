import React, { useState } from 'react';
import RoutingMap from './RoutingMap';

function App() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  const handleDestinationSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(e.target.destLat.value);
    const lng = parseFloat(e.target.destLng.value);
    setDestination({ lat, lng });
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Live Tracking Map</h2>

      <form onSubmit={handleDestinationSubmit} style={{ textAlign: 'center', marginBottom: '10px' }}>
        <input type="text" name="destLat" placeholder="Destination Latitude" required />
        <input type="text" name="destLng" placeholder="Destination Longitude" required />
        <button type="submit">Set Destination</button>
      </form>

      {destination && <RoutingMap destination={destination} setSource={setSource} />}
    </div>
  );
}

export default App;
