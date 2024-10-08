import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type Props = {
  latitude: number;
  longitude: number;
};
const MapComponent = ({ latitude, longitude }: Props) => {
  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const defaultCenter = {
    lat: latitude,
    lng: longitude,
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: true,
    rotateControl: false,
    fullscreenControl: false,
  };

  return (
    <div className="mt-5 overflow-hidden rounded-xl">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={15}
          center={defaultCenter}
          options={mapOptions}
        >
          <Marker position={defaultCenter}></Marker>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
