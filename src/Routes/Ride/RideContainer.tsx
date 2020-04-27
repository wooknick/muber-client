import { SubscribeToMoreOptions } from "apollo-boost";
import React from "react";
import { useMutation, useQuery } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { USER_PROFILE } from "../../sharedQueries";
import RidePresenter from "./RidePresenter";
import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from "./RideQueries";
import {
  getRide,
  getRideVariables,
  userProfile,
  updateRide,
  updateRideVariables,
} from "../../types/api";

interface MatchParams {
  rideId: string;
}

type Props = RouteComponentProps<MatchParams>;

const RideContainer: React.FunctionComponent<Props> = ({
  match,
  history,
}: Props) => {
  if (!match.params.rideId) {
    history.push("/");
  }

  const { data, loading, subscribeToMore } = useQuery<
    getRide,
    getRideVariables
  >(GET_RIDE, {
    variables: {
      rideId: Number(match.params.rideId),
    },
  });
  const subscribeOptions: SubscribeToMoreOptions = {
    document: RIDE_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) {
        return prev;
      }
      const {
        data: {
          RideStatusSubscription: { status },
        },
      } = subscriptionData;
      if (status === "FINISHED") {
        window.location.href = "/";
      }
    },
  };

  subscribeToMore(subscribeOptions);

  const { data: userData } = useQuery<userProfile>(USER_PROFILE);

  const [rideUpdateMutation] = useMutation<updateRide, updateRideVariables>(
    UPDATE_RIDE_STATUS,
    {
      refetchQueries: [
        { query: GET_RIDE, variables: { rideId: Number(match.params.rideId) } },
      ],
    }
  );

  return (
    <RidePresenter
      data={data}
      userData={userData}
      loading={loading}
      updateRideFn={rideUpdateMutation}
    />
  );
};

export default RideContainer;
