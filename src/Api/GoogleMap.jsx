import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

const MapComponent = ({location}) => {
  return (
    <LoadScript googleMapsApiKey='AIzaSyAQRIT2tpNRKu9hleY2y7XHil4qxRyFGv8'>
      <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={16}>
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;