import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet marker icons for production (e.g. Netlify)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function RoutingMap({ destination, setSource }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const routingControlRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    const map = L.map('map').setView([0, 0], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latlng = [latitude, longitude];

        setCurrentLocation({ lat: latitude, lng: longitude });
        setSource({ lat: latitude, lng: longitude });

        map.setView(latlng, 15);

        // Update or create marker
        if (markerRef.current) {
          markerRef.current.setLatLng(latlng);
        } else {
          markerRef.current = L.marker(latlng, {
            icon: L.icon({
              iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              iconSize: [32, 32],
            }),
          }).addTo(map);
        }

        // Draw route if destination exists
        if (destination) {
          if (routingControlRef.current) {
            routingControlRef.current.setWaypoints([latlng, [destination.lat, destination.lng]]);
          } else {
            routingControlRef.current = L.Routing.control({
              waypoints: [latlng, [destination.lat, destination.lng]],
              routeWhileDragging: false,
              draggableWaypoints: false,
              createMarker: function (i, wp) {
                const iconUrl = i === 0
                  ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';

                return L.marker(wp.latLng, {
                  icon: L.icon({
                    iconUrl,
                    iconSize: [32, 32],
                  }),
                });
              },
            }).addTo(map);
          }

          // Check if close to destination
          const distance = map.distance(latlng, [destination.lat, destination.lng]);
          if (distance < 30) {
            alert('🎉 You have reached your destination!');
            navigator.geolocation.clearWatch(watchId);
          }
        }
      },
      (error) => {
        console.error('Geolocation error:', error.message);
        alert('Please enable location on your device.');
      },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      map.remove();
    };
  }, [destination]);
  return <div id="map" style={{ height: '90vh', width: '100%' }} />;
}

export default RoutingMap;
