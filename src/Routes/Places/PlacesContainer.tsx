import React from "react";
import { useQuery } from "react-apollo";
import { GET_PLACES } from "../../sharedQueries";
import { getPlaces } from "../../types/api";
import PlacesPresenter from "./PlacesPresenter";

const PlacesContainer = () => {
  const { data, loading } = useQuery<getPlaces>(GET_PLACES);

  return <PlacesPresenter data={data} loading={loading} />;
};
export default PlacesContainer;
