import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import FindAddressPresenter from "./FindAddressPresenter";

interface Props {
  google: any;
}

const FindAddressContainer: React.FunctionComponent<Props> = ({ google }) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const mapRef = useRef();
  let map: google.maps.Map;

  const handleDragEnd = () => {
    const newCenter = map.getCenter();
    const newLat = newCenter.lat();
    const newLng = newCenter.lng();
    setLat(newLat);
    setLng(newLng);
  };

  const loadMap = (latitude, longitude) => {
    const { maps } = google;
    const mapNode = mapRef.current;
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat: latitude,
        lng: longitude,
      },
      disableDefaultUI: true,
      zoom: 11,
    };
    map = new maps.Map(mapNode, mapConfig);
    map.addListener("dragend", handleDragEnd);
  };

  const handleGeoError = () => {
    // eslint-disable-next-line
    console.log("No location");
  };

  const handleGeoSucces = (positon: Position) => {
    const {
      coords: { latitude, longitude },
    } = positon;
    setLat(latitude);
    setLng(longitude);
    loadMap(latitude, longitude);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError);
  }, []);

  return <FindAddressPresenter mapRef={mapRef} />;
};

FindAddressContainer.propTypes = {
  google: PropTypes.any.isRequired,
};

export default FindAddressContainer;
