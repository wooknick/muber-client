import { GoogleApiWrapper } from "google-maps-react";
import FindAddressContainer from "./FindAddressContainer";

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAPS_KEY || "",
})(FindAddressContainer);
