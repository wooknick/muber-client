import PropTypes from "prop-types";
import React from "react";
import { MutationFunction } from "react-apollo";
import { Helmet } from "react-helmet";
import Sidebar from "react-sidebar";
import styled from "styled-components";
import AddressBar from "../../Components/AddressBar";
import Button from "../../Components/Button";
import Menu from "../../Components/Menu";
import RidePopUp from "../../Components/RidePopUp";
import {
  userProfile,
  requestRide,
  requestRideVariables,
  getRides,
  acceptRideVariables,
  acceptRide,
} from "../../types/api";

const Container = styled.div``;

const MenuButton = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  height: auto;
  width: 80%;
`;

const RequestButton = styled(ExtendedButton)`
  bottom: 125px;
`;

interface Props {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  loading: boolean;
  data?: userProfile;
  mapRef: any;
  toAddress: string;
  onAddressSubmit: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  price?: number;
  requestRideFn?: MutationFunction<requestRide, requestRideVariables>;
  acceptRideFn?: MutationFunction<acceptRide, acceptRideVariables>;
  nearbyRide?: getRides;
}

const HomePresenter: React.FunctionComponent<Props> = ({
  isMenuOpen,
  toggleMenu,
  loading,
  mapRef,
  toAddress,
  onInputChange,
  onAddressSubmit,
  price,
  data,
  requestRideFn,
  acceptRideFn,
  nearbyRide,
}: Props) => {
  const user = data?.GetMyProfile?.user;
  const ride = nearbyRide?.GetNearbyRide.ride;
  return (
    <Container>
      <Helmet>
        <title>Home | Number</title>
      </Helmet>
      <Sidebar
        sidebar={<Menu />}
        open={isMenuOpen}
        onSetOpen={toggleMenu}
        styles={{
          sidebar: {
            backgroundColor: "white",
            width: "80%",
            zIndex: "10",
          },
        }}
      >
        {!loading && <MenuButton onClick={toggleMenu}>|||</MenuButton>}
        {user && !user.isDriving && (
          <>
            <AddressBar
              name={"toAddress"}
              onChange={onInputChange}
              value={toAddress}
              onBlur={() => ""}
            />
            <ExtendedButton
              onClick={onAddressSubmit}
              disabled={toAddress === ""}
              value={price ? "Change address" : "Pick Address"}
            />
          </>
        )}
        {price && (
          <RequestButton
            onClick={requestRideFn}
            disabled={toAddress === ""}
            value={`Request Ride ($${price})`}
          />
        )}
        {ride && (
          <RidePopUp
            id={ride.id}
            pickUpAddress={ride.pickUpAddress}
            dropOffAddress={ride.dropOffAddress}
            price={ride.price}
            distance={ride.distance}
            passengerName={ride.passenger.fullName || ""}
            passengerPhoto={ride.passenger.profilePhoto || ""}
            acceptRideFn={acceptRideFn}
          />
        )}
        <Map ref={mapRef} />
      </Sidebar>
    </Container>
  );
};

HomePresenter.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default HomePresenter;
