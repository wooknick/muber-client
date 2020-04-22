import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

const Map = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const Center = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 2;
  font-size: 30px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface Props {
  mapRef: any;
}

const FindAddressPresenter: React.FunctionComponent<Props> = ({ mapRef }) => (
  <div>
    <Helmet>
      <title>Find Address | Nuber</title>
    </Helmet>
    <Center>
      <span role="img" aria-label="pin">
        📍
      </span>
    </Center>
    <Map ref={mapRef} />
  </div>
);

FindAddressPresenter.propTypes = {
  mapRef: PropTypes.any.isRequired,
};

export default FindAddressPresenter;
