import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../../Components/Header";
import Place from "../../Components/Place";
import routes from "../../routes";
import { getPlaces } from "../../types/api";

const Container = styled.div`
  padding: 0 40px;
`;

const SLink = styled(Link)`
  text-decoration: underline;
`;

interface Props {
  data?: getPlaces;
  loading: boolean;
}

const PlacesPresenter: React.FunctionComponent<Props> = ({
  data: { GetMyPlaces: { places = null } = {} } = {},
  loading,
}) => (
  <>
    <Helmet>
      <title>Places | Number</title>
    </Helmet>
    <Header title={"Places"} backTo={"/"} />
    <Container>
      {!loading && places && places.length === 0 && "You have no places"}
      {!loading &&
        places &&
        places.map((place) => (
          <Place
            key={place?.id}
            fav={place?.isFav || false}
            name={place?.name || ""}
            address={place?.address || ""}
          />
        ))}
      <SLink to={routes.addPlace}>Place add some places!</SLink>
    </Container>
  </>
);

PlacesPresenter.propTypes = {
  data: PropTypes.any,
  loading: PropTypes.bool.isRequired,
};

export default PlacesPresenter;
