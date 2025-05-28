import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';

function RoutingMap({ destination }) {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const [source, setSource] = useState(null);
  const [reached, setReached] = useState(false);

  // Track user location in real-time
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSource({ lat, lng });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Please enable location on your device.');
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Initialize and update map + route
  useEffect(() => {
    if (!source || !destination) return;

    if (!mapRef.current) {
      const map = L.map('map').setView([source.lat, source.lng], 15);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }

    const map = mapRef.current;

    // Remove previous routing control if exists
    if (routingControlRef.current) {
      routingControlRef.current.remove();
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(source.lat, source.lng), L.latLng(destination.lat, destination.lng)],
      routeWhileDragging: false,
      draggableWaypoints: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: function () { return null; },
    }).addTo(map);

    // Check if source is close to destination
    const distance = map.distance(
      L.latLng(source.lat, source.lng),
      L.latLng(destination.lat, destination.lng)
    );

    if (distance < 20 && !reached) {
      setReached(true);
      alert("🎉 You've reached your destination!");
    }
  }, [source, destination]);

  return <div id="map" style={{ height: '100vh', width: '100%' }} />;
}

export default RoutingMap;
