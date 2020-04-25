import { GoogleAPI } from "google-maps-react";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { geoCode } from "../../mapHelpers";
import { USER_PROFILE } from "../../sharedQueries";
import HomePresenter from "./HomePresenter";
import { REPORT_LOCATION } from "./HomeQueries";
import {
  userProfile,
  reportMovement,
  reportMovementVariables,
} from "../../types/api";

interface Props extends RouteComponentProps {
  google: GoogleAPI;
}

const HomeContainer: React.FunctionComponent<Props> = ({ google }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [toLat, setToLat] = useState(0);
  const [toLng, setToLng] = useState(0);
  const [toAddress, setToAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const mapRef = useRef();
  const map = useRef<google.maps.Map>();
  const userMarker = useRef<google.maps.Marker>();
  const toMarker = useRef<google.maps.Marker>();
  const directions = useRef<google.maps.DirectionsRenderer>();
  const watchId = useRef(0);

  const { loading } = useQuery<userProfile>(USER_PROFILE);
  const [reportLocationMutation] = useMutation<
    reportMovement,
    reportMovementVariables
  >(REPORT_LOCATION);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === "toAddress") {
      setToAddress(value);
    }
  };

  const onAddressSubmit = async () => {
    const { maps } = google;
    const result = await geoCode(toAddress);
    if (result !== false) {
      const {
        lat: latitude,
        lng: longitude,
        formatted_address: formatedAddress,
      } = result;
      if (toMarker.current) {
        toMarker.current.setMap(null);
      }
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat: latitude,
          lng: longitude,
        },
      };
      const newToMarker = new maps.Marker(toMarkerOptions);
      if (map.current) {
        newToMarker.setMap(map.current);
        toMarker.current = newToMarker;
      }
      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat, lng });
      bounds.extend({ lat: latitude, lng: longitude });
      if (map.current) {
        map.current.fitBounds(bounds);
      }
      setToAddress(formatedAddress);
      setToLat(latitude);
      setToLng(longitude);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((v) => !v);
  };

  // calculate price when distance updated
  useEffect(() => {
    if (distance !== "") {
      const newPrice = parseFloat(
        Number(parseFloat(distance.replace(",", "")) * 3).toFixed(2)
      );
      setPrice(newPrice);
    }
  }, [distance]);

  // calculate destination and draw route when address input updated
  useEffect(() => {
    const handleRouteRequest = (
      result: google.maps.DirectionsResult,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === google.maps.DirectionsStatus.OK) {
        const { routes } = result;
        const {
          distance: { text: newDistance },
          duration: { text: newDuration },
        } = routes[0].legs[0];

        setDistance(newDistance);
        setDuration(newDuration);
        if (directions.current && map.current) {
          directions.current.setDirections(result);
          directions.current.setMap(map.current);
        }
      } else {
        toast.error("There is no route there");
      }
    };

    const createPath = () => {
      if (directions.current) {
        directions.current.setMap(null);
      }
      const renderOptions: google.maps.DirectionsRendererOptions = {
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#000",
        },
      };
      const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
      directions.current = new google.maps.DirectionsRenderer(renderOptions);
      const from = new google.maps.LatLng(lat, lng);
      const to = new google.maps.LatLng(toLat, toLng);
      const directionsOptions: google.maps.DirectionsRequest = {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.TRANSIT,
      };
      directionsService.route(directionsOptions, handleRouteRequest);
    };

    if (lat * lng * toLat * toLng !== 0) {
      createPath();
    }
  }, [lat, lng, toLat, toLng, google]);

  // add google map and marker when startup
  useEffect(() => {
    const handleGeoError = () => {
      // eslint-disable-next-line
      console.log("No location");
    };

    const handleGeoWatchError = () => {
      // eslint-disable-next-line
      console.log("Error watching you");
    };

    const handleGeoWatchSuccess = (position: Position) => {
      // console.log(position);
      const {
        coords: { latitude, longitude },
      } = position;
      if (userMarker.current && map.current) {
        userMarker.current.setPosition({ lat: latitude, lng: longitude });
        map.current.panTo({ lat: latitude, lng: longitude });
        reportLocationMutation({
          variables: {
            lat: parseFloat(latitude.toFixed(10)),
            lng: parseFloat(longitude.toFixed(10)),
          },
        });
      }
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
            lat: latitude,
            lng: longitude,
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

    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
    return () => {
      navigator.geolocation.clearWatch(watchId.current);
    };
  }, [google, reportLocationMutation]);

  return (
    <HomePresenter
      loading={loading}
      isMenuOpen={isMenuOpen}
      toggleMenu={toggleMenu}
      mapRef={mapRef}
      toAddress={toAddress}
      onInputChange={onInputChange}
      onAddressSubmit={onAddressSubmit}
      price={price}
    />
  );
};

export default HomeContainer;
