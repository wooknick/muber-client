import React from "react";
import { MutationFunction } from "react-apollo";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../Components/Button";
import defaultAvatar from "../../images/defaultAvatar.png";
import {
  getRide,
  userProfile,
  updateRide,
  updateRideVariables,
} from "../../types/api";

enum StatusOptions {
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  FINISHED = "FINISHED",
  ONROUTE = "ONROUTE",
  REQUESTING = "REQUESTING",
}

const Container = styled.div`
  padding: 40px;
`;

const Title = styled.h4`
  font-weight: 800;
  margin-top: 30px;
  margin-bottom: 10px;
  &:first-child {
    margin-top: 0;
  }
`;

const Data = styled.span`
  color: ${(props) => props.theme.colors.blueColor};
`;

const Img = styled.img`
  border-radius: 50%;
  margin-right: 20px;
  max-width: 50px;
  height: 50px;
`;

const Passenger = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Buttons = styled.div`
  margin: 30px 0px;
`;

const ExtendedButton = styled(Button)`
  margin-bottom: 30px;
`;

interface Props {
  data?: getRide;
  userData?: userProfile;
  loading: boolean;
  updateRideFn: MutationFunction<updateRide, updateRideVariables>;
}

const RidePresenter: React.FunctionComponent<Props> = ({
  data,
  userData,
  updateRideFn,
}: Props) => {
  console.log(data);
  const ride = data?.GetRide.ride;
  const user = userData?.GetMyProfile.user;

  return (
    <Container>
      {ride && user && (
        <>
          <Title>Passenger</Title>
          <Passenger>
            <Img src={ride.passenger.profilePhoto || defaultAvatar} />
            <Data>{ride.passenger.fullName}</Data>
          </Passenger>
          {ride.driver && (
            <>
              <Title>Driver</Title>
              <Passenger>
                <Img src={ride.driver.profilePhoto || defaultAvatar} />
                <Data>{ride.driver.fullName}</Data>
              </Passenger>
            </>
          )}
          <Title>From</Title>
          <Data>{ride.pickUpAddress}</Data>
          <Title>To</Title>
          <Data>{ride.dropOffAddress}</Data>
          <Title>Price</Title>
          <Data>{ride.price}</Data>
          <Title>Distance</Title>
          <Data>{ride.distance}</Data>
          <Title>Duration</Title>
          <Data>{ride.duration}</Data>
          <Title>Status</Title>
          <Data>{ride.status}</Data>
          <Buttons>
            {ride.driver &&
              ride.driver.id === user.id &&
              ride.status === "ACCEPTED" && (
                <ExtendedButton
                  value={"Picked Up"}
                  onClick={() =>
                    updateRideFn({
                      variables: {
                        rideId: ride.id,
                        status: StatusOptions.ONROUTE,
                      },
                    })
                  }
                />
              )}
            {ride.driver &&
              ride.driver.id === user.id &&
              ride.status === "ONROUTE" && (
                <ExtendedButton
                  value={"Finished"}
                  onClick={() =>
                    updateRideFn({
                      variables: {
                        rideId: ride.id,
                        status: StatusOptions.FINISHED,
                      },
                    })
                  }
                />
              )}
            {ride.status !== "REQUESTING" && (
              <Link to={`/chat/${ride.chatId}`}>
                <ExtendedButton value={"Chat"} onClick={null} />
              </Link>
            )}
          </Buttons>
        </>
      )}
    </Container>
  );
};

export default RidePresenter;
