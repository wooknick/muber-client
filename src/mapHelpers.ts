import axios from "axios";
import { toast } from "react-toastify";

export const geoCode = async (address: string) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_MAPS_KEY}`;
  const { data } = await axios(URL);
  if (!data.error_message) {
    const { results } = data;
    const firstPlace = results[0];
    if (!firstPlace) {
      return false;
    }
    const {
      formatted_address,
      geometry: {
        location: { lat, lng },
      },
    } = firstPlace;
    return { formatted_address, lat, lng };
  }
  toast.error(data.error_message);
  return false;
};

export const reverseGeoCode = async (lat: number, lng: number) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_MAPS_KEY}`;
  const { data } = await axios(URL);
  if (!data.error_message) {
    const { results } = data;
    const firstPlace = results[0];
    if (!firstPlace) {
      return false;
    }
    const address = firstPlace.formatted_address;
    return address;
  }
  toast.error(data.error_message);
  return false;
};
