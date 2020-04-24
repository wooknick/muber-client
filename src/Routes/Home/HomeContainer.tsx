import { GoogleAPI } from "google-maps-react";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { USER_PROFILE } from "../../sharedQueries";
import { userProfile } from "../../types/api";
import HomePresenter from "./HomePresenter";

interface Props extends RouteComponentProps {
  google: GoogleAPI;
}

const HomeContainer: React.FunctionComponent<Props> = ({ google }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const mapRef = useRef();
  const map = useRef<google.maps.Map>();
  const userMarker = useRef<google.maps.Marker>();
  const watchId = useRef(0);

  const { loading } = useQuery<userProfile>(USER_PROFILE);

  const toggleMenu = () => {
    setIsMenuOpen((v) => !v);
  };

  const handleGeoError = () => {
    console.log("No location");
  };

  const handleGeoWatchError = () => {
    console.log("Error watching you");
  };

  const handleGeoWatchSuccess = (position: Position) => {
    console.log(position);
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
        minZoom: 8,
        zoom: 15,
      };

      const newMap = new maps.Map(mapNode, mapConfig);
      map.current = newMap;
      const userMarkerOptions: google.maps.MarkerOptions = {
        icon: {
          path: maps.SymbolPath.CIRCLE,
          scale: 7,
        },
        position: {
          lat,
          lng,
        },
      };
      const newUserMarker = new maps.Marker(userMarkerOptions);
      newUserMarker.setMap(map.current);
      userMarker.current = newUserMarker;

      const watchOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 1000,
      };

      const id = navigator.geolocation.watchPosition(
        handleGeoWatchSuccess,
        handleGeoWatchError,
        watchOptions
      );
      watchId.current = id;
    }
  };

  const handleGeoSuccess = (positon: Position) => {
    const {
      coords: { latitude, longitude },
    } = positon;
    setLat(latitude);
    setLng(longitude);
    loadMap(latitude, longitude);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
    return () => {
      navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  return (
    <HomePresenter
      loading={loading}
      isMenuOpen={isMenuOpen}
      toggleMenu={toggleMenu}
      mapRef={mapRef}
    />
  );
};

export default HomeContainer;
