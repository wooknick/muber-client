import React from "react";
import { useMutation, useQuery } from "react-apollo";
import { GET_PLACES, USER_PROFILE } from "../../sharedQueries";
import { LOG_USER_OUT } from "../../sharedQueries.local";
import { getPlaces, userProfile } from "../../types/api";
import SettingsPresenter from "./SettingsPresenter";

const SettingsContainer = () => {
  const [LogUserOutMutation] = useMutation(LOG_USER_OUT);
  const { data: userData, loading: userDataLoading } = useQuery<userProfile>(
    USER_PROFILE
  );
  const { data: placesData, loading: placesDataLoading } = useQuery<getPlaces>(
    GET_PLACES
  );

  return (
    <SettingsPresenter
      userData={userData}
      userDataLoading={userDataLoading}
      placesData={placesData}
      placesDataLoading={placesDataLoading}
      logUserOut={LogUserOutMutation}
    />
  );
};

export default SettingsContainer;
