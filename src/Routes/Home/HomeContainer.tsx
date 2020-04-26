import { SubscribeToMoreOptions } from "apollo-boost";
import { GoogleAPI } from "google-maps-react";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { geoCode, reverseGeoCode } from "../../mapHelpers";
import { USER_PROFILE } from "../../sharedQueries";
import HomePresenter from "./HomePresenter";
import {
  GET_NEARBY_DRIVERS,
  REPORT_LOCATION,
  REQUEST_RIDE,
  GET_NEARBY_RIDE,
  ACCEPT_RIDE,
  SUBSCRIBE_NEARBY_RIDES,
} from "./HomeQueries";
import {
  userProfile,
  reportMovement,
  reportMovementVariables,
  getDrivers,
  getRides,
  requestRide,
  requestRideVariables,
  acceptRide,
  acceptRideVariables,
} from "../../types/api";

interface Props extends RouteComponentProps {
  google: GoogleAPI;
}

const HomeContainer: React.FunctionComponent<Props> = ({ google }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [toLat, setToLat] = useState(0);
  const [toLng, setToLng] = useState(0);
  const [toAddress, setToAddress] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const mapRef = useRef();
  const map = useRef<google.maps.Map>();
  const userMarker = useRef<google.maps.Marker>();
  const toMarker = useRef<google.maps.Marker>();
  const directions = useRef<google.maps.DirectionsRenderer>();
  const watchId = useRef(0);
  const drivers = useRef<google.maps.Marker[]>([]);

  // get user profile query, handler start
  const handleProfileQuery = (data: userProfile) => {
    const { GetMyProfile } = data;
    if (GetMyProfile.user) {
      const {
        user: { isDriving: isDrivingNow },
      } = GetMyProfile;
      setIsDriving(isDrivingNow);
    }
  };
  const { loading: userProfileLoading, data: userProfileData } = useQuery<
    userProfile
  >(USER_PROFILE, {
    onCompleted: handleProfileQuery,
  });
  // get user profile query, handler end

  // get nearby Ride query start
  const rideSubscriptionOptions: SubscribeToMoreOptions = {
    document: SUBSCRIBE_NEARBY_RIDES,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) {
        return prev;
      }
      const newObject = {
        ...prev,
        GetNearbyRide: {
          ...prev.GetNearbyRide,
          ride: subscriptionData.data.NearbyRidesSubscription,
        },
      };
      return newObject;
    },
  };
  const { subscribeToMore, data: nearbyRide } = useQuery<getRides>(
    GET_NEARBY_RIDE,
    {
      skip: !isDriving,
    }
  );
  if (isDriving) {
    subscribeToMore(rideSubscriptionOptions);
  }
  // get nearby Ride Query end

  // get nearby Drivers query, handler start
  const handleNearbyDrivers = (data) => {
    const {
      GetNearbyDrivers: { drivers: driversData, ok },
    } = data;

    if (ok && driversData) {
      driversData.forEach((driver) => {
        if (map.current && drivers.current) {
          const existingDriver:
            | google.maps.Marker
            | undefined = drivers.current.find(
            (driverMarker: google.maps.Marker) => {
              const markerID = driverMarker.get("ID");
              return markerID === driver.id;
            }
          );
          if (existingDriver) {
            existingDriver.setPosition({
              lat: driver.lastLat,
              lng: driver.lastLng,
            });
          } else {
            const markerOptions: google.maps.MarkerOptions = {
              position: {
                lat: driver.lastLat,
                lng: driver.lastLng,
              },
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 5,
              },
            };
            const newMarker: google.maps.Marker = new google.maps.Marker(
              markerOptions
            );
            newMarker.set("ID", driver.id);
            newMarker.setMap(map.current);
            drivers.current.push(newMarker);
          }
        }
      });
    }
  };

  const { loading: getDriversLoading, data: getDriversData } = useQuery<
    getDrivers
  >(GET_NEARBY_DRIVERS, {
    skip: isDriving,
    onCompleted: handleNearbyDrivers,
    pollInterval: 5000,
    fetchPolicy: "cache-and-network",
  });
  // get nearby Drivers query, handler end

  // accept Ride mutation start
  const [acceptRideMutation] = useMutation<acceptRide, acceptRideVariables>(
    ACCEPT_RIDE
  );
  // accept Ride mutation end

  // report Location mutation start
  const [reportLocationMutation] = useMutation<
    reportMovement,
    reportMovementVariables
  >(REPORT_LOCATION);
  // report Location mutation end

  // request Ride mutation, handler start
  const handleRideRequest = (data: requestRide) => {
    const { RequestRide } = data;
    if (RequestRide.ok) {
      toast.success("Drive requested, finding a driver");
    } else {
      toast.error(RequestRide.error);
    }
  };

  const [requestRideMutation] = useMutation<requestRide, requestRideVariables>(
    REQUEST_RIDE,
    {
      variables: {
        pickUpAddress: fromAddress,
        pickUpLat: lat,
        pickUpLng: lng,
        dropOffAddress: toAddress,
        dropOffLat: toLat,
        dropOffLng: toLng,
        price: price || 0,
        distance,
        duration,
      },
      onCompleted: handleRideRequest,
    }
  );
  // request Ride mutation, handler end

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

    const getFromAddress = async (latitude: number, longitude: number) => {
      const address = await reverseGeoCode(latitude, longitude);
      if (address) {
        setFromAddress(address);
      }
    };
    const handleGeoSuccess = (positon: Position) => {
      const {
        coords: { latitude, longitude },
      } = positon;
      setLat(latitude);
      setLng(longitude);
      loadMap(latitude, longitude);
      getFromAddress(latitude, longitude);
    };

    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
    return () => {
      navigator.geolocation.clearWatch(watchId.current);
    };
  }, [google, reportLocationMutation]);

  return (
    <HomePresenter
      loading={userProfileLoading}
      data={userProfileData}
      isMenuOpen={isMenuOpen}
      toggleMenu={toggleMenu}
      mapRef={mapRef}
      toAddress={toAddress}
      onInputChange={onInputChange}
      onAddressSubmit={onAddressSubmit}
      price={price}
      requestRideFn={requestRideMutation}
      nearbyRide={nearbyRide}
      acceptRideFn={acceptRideMutation}
    />
  );
};

export default HomeContainer;
