import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import orsRouter from './orsRouter';

function RoutingMap({ source, destination, apiKey }) {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([source.lat, source.lng], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    }

    if (routingControlRef.current) {
      routingControlRef.current.setWaypoints([
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat, destination.lng)
      ]);
    } else {
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(source.lat, source.lng),
          L.latLng(destination.lat, destination.lng)
        ],
        router: orsRouter(apiKey),
        lineOptions: {
          styles: [{ color: 'blue', weight: 5 }]
        },
        createMarker: function(i, wp) {
          return L.marker(wp.latLng, {
            icon: L.icon({
              iconUrl: i === 0
                ? 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png'
                : 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
              iconSize: [32, 32]
            })
          });
        }
      }).addTo(mapRef.current);
    }
  }, [source, destination, apiKey]);

  return <div id="map" style={{ height: '100vh', width: '100%' }} />;
}

export default RoutingMap;