import L from 'leaflet';

export default function orsRouter(apiKey) {
  return {
    route: function(waypoints, callback, context) {
      const coordinates = waypoints.map(wp => [wp.latLng.lng, wp.latLng.lat]);

      fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinates })
      })
        .then(response => response.json())
        .then(data => {
          const route = {
            name: 'Route',
            coordinates: data.features[0].geometry.coordinates.map(c => L.latLng(c[1], c[0])),
            instructions: [],
            summary: {
              totalDistance: data.features[0].properties.summary.distance,
              totalTime: data.features[0].properties.summary.duration
            }
          };
          callback.call(context, null, [route]);
        })
        .catch(err => callback.call(context, err));
    }
  };
}