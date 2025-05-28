import React, { useEffect, useState } from 'react';
import RoutingMap from './RoutingMap';

function App() {
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState({ lat: 22.5726, lng: 88.3639 }); // Example: Kolkata

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setSource({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    alert('Please enable location on your device.');
                    console.error('Geolocation error:', error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }, []);

    return (
        <div>
            {source && destination && <RoutingMap source={source} destination={destination} />}
        </div>
    );
}

export default App;