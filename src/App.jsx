// client/src/App.jsx
import RoutingMap from './RoutingMap';

function App() {
  const source = { lat: 22.5726, lng: 88.3639 }; // Kolkata
  const destination = { lat: 22.5858, lng: 88.3588 }; // Nearby point

  return (
    <div>
      <RoutingMap source={source} destination={destination} />
    </div>
  );
}

export default App;
