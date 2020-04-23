import PropTypes from "prop-types";
import React from "react";
import { MutationFunction } from "react-apollo";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../../Components/Header";
import Place from "../../Components/Place";
import routes from "../../routes";
import { getPlaces, userProfile } from "../../types/api";

const Container = styled.div`
  padding: 0px 40px;
`;

const Image = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
`;

const GridLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 10px;
  margin-bottom: 10px;
`;

const Keys = styled.div``;

const Key = styled.span`
  display: block;
  margin-bottom: 5px;
`;

const FakeLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const SLink = styled(Link)`
  display: block;
  text-decoration: underline;
  margin: 20px 0px;
`;

interface Props {
  logUserOut: MutationFunction;
  userData?: userProfile;
  userDataLoading: boolean;
  placesData?: getPlaces;
  placesDataLoading: boolean;
}

const SettingsPresenter: React.FunctionComponent<Props> = ({
  logUserOut,
  userData: { GetMyProfile: { user = null } = {} } = {},
  userDataLoading,
  placesData: { GetMyPlaces: { places = null } = {} } = {},
  placesDataLoading,
}) => (
  <>
    <Helmet>
      <title>Settings | Nuber</title>
    </Helmet>
    <Header title={"Account Settings"} backTo={"/"} />
    <Container>
      <GridLink to={routes.editAccount}>
        {!userDataLoading &&
          user &&
          user.profilePhoto &&
          user.email &&
          user.fullName && (
            <>
              <Image src={user.profilePhoto} />
              <Keys>
                <Key>{user.fullName}</Key>
                <Key>{user.email}</Key>
              </Keys>
            </>
          )}
      </GridLink>
      {!placesDataLoading &&
        places &&
        places?.map((place) => (
          <Place
            key={place?.id}
            id={place?.id || 0}
            fav={place?.isFav || false}
            name={place?.name || ""}
            address={place?.address || ""}
          />
        ))}
      <SLink to={routes.places}>Go to Places</SLink>
      <FakeLink onClick={logUserOut as any}>Log Out</FakeLink>
    </Container>
  </>
);

SettingsPresenter.propTypes = {
  logUserOut: PropTypes.func.isRequired,
  userData: PropTypes.any,
  userDataLoading: PropTypes.bool.isRequired,
  placesData: PropTypes.any,
  placesDataLoading: PropTypes.bool.isRequired,
};

export default SettingsPresenter;
