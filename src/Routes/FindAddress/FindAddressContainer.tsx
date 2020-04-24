import { GoogleAPI } from "google-maps-react";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { geoCode, reverseGeoCode } from "../../mapHelpers";
import routes from "../../routes";
import FindAddressPresenter from "./FindAddressPresenter";

interface Props extends RouteComponentProps {
  google: GoogleAPI;
}

const FindAddressContainer: React.FunctionComponent<Props> = ({
  google,
  history,
}: Props) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [address, setAddress] = useState("");
  const mapRef = useRef();
  const map = useRef<google.maps.Map>();

  const onPickPlace = () => {
    history.push({
      pathname: routes.addPlace,
      state: {
        address,
        lat,
        lng,
      },
    });
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === "address") {
      setAddress(value);
    }
  };

  const onInputBlur = async () => {
    const result = await geoCode(address);
    if (result !== false) {
      const {
        lat: newLat,
        lng: newLng,
        formatted_address: formatedAddress,
      } = result;
      setLat(newLat);
      setLng(newLng);
      setAddress(formatedAddress);
      const latLng = new google.maps.LatLng(newLat, newLng);
      if (map && map.current) {
        map.current.panTo(latLng);
      }
    }
  };

  const reverseGeoCodeAddress = async (latitude: number, longitude: number) => {
    const reversedAddress = await reverseGeoCode(latitude, longitude);
    if (reversedAddress) {
      setAddress(reversedAddress);
    }
  };

  useEffect(() => {
    const handleDragEnd = () => {
      const newCenter = map?.current?.getCenter();
      const newLat = newCenter?.lat() || 0;
      const newLng = newCenter?.lng() || 0;
      setLat(newLat);
      setLng(newLng);
      reverseGeoCodeAddress(newLat, newLng);
    };

    const loadMap = (latitude, longitude) => {
      const { maps } = google;
      const mapNode = mapRef.current;
      if (mapNode) {
        const mapConfig: google.maps.MapOptions = {
          center: {
            lat: latitude,
            lng: longitude,
          },
          disableDefaultUI: true,
          zoom: 15,
          minZoom: 8,
        };
        const newMap = new maps.Map(mapNode, mapConfig);
        newMap.addListener("dragend", handleDragEnd);
        map.current = newMap;
      }
    };

    const handleGeoError = () => {
      // eslint-disable-next-line
      console.log("No location");
    };

    const handleGeoSuccess = (positon: Position) => {
      const {
        coords: { latitude, longitude },
      } = positon;
      setLat(latitude);
      setLng(longitude);
      loadMap(latitude, longitude);
      reverseGeoCodeAddress(latitude, longitude);
    };

    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  }, [google]);

  return (
    <FindAddressPresenter
      mapRef={mapRef}
      address={address}
      onInputChange={onInputChange}
      onInputBlur={onInputBlur}
      onPickPlace={onPickPlace}
    />
  );
};

FindAddressContainer.propTypes = {
  google: PropTypes.any.isRequired,
};

export default FindAddressContainer;
