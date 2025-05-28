import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const sourceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const RoutingMap = ({ source, destination }) => {
    const mapRef = useRef(null);
    const sourceMarkerRef = useRef(null);
    const destMarkerRef = useRef(null);
    const routeLineRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([source.lat, source.lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }

        if (!sourceMarkerRef.current) {
            sourceMarkerRef.current = L.marker([source.lat, source.lng], { icon: sourceIcon }).addTo(mapRef.current);
        } else {
            sourceMarkerRef.current.setLatLng([source.lat, source.lng]);
        }

        if (!destMarkerRef.current) {
            destMarkerRef.current = L.marker([destination.lat, destination.lng], { icon: destinationIcon }).addTo(mapRef.current);
        } else {
            destMarkerRef.current.setLatLng([destination.lat, destination.lng]);
        }

        const fetchRoute = async () => {
            const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=YOUR_OPENROUTESERVICE_API_KEY`;
            const body = {
                coordinates: [
                    [source.lng, source.lat],
                    [destination.lng, destination.lat]
                ]
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer 5b3ce3597851110001cf62485584895f6a884feba38a6133a4f59376'
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            const coords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);

            if (routeLineRef.current) {
                mapRef.current.removeLayer(routeLineRef.current);
            }

            routeLineRef.current = L.polyline(coords, { color: 'blue' }).addTo(mapRef.current);
        };

        fetchRoute();

        const checkArrival = () => {
            const dist = mapRef.current.distance(
                L.latLng(source.lat, source.lng),
                L.latLng(destination.lat, destination.lng)
            );
            if (dist < 30) alert('You have reached your destination!');
        };

        checkArrival();
    }, [source, destination]);

    return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default RoutingMap