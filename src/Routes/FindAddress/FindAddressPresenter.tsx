import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import AddressBar from "../../Components/AddressBar";

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
  address: string;
  onInputBlur: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FindAddressPresenter: React.FunctionComponent<Props> = ({
  mapRef,
  address,
  onInputChange,
  onInputBlur,
}) => (
  <div>
    <Helmet>
      <title>Find Address | Nuber</title>
    </Helmet>
    <AddressBar
      onBlur={onInputBlur}
      onChange={onInputChange}
      name={"address"}
      value={address}
    />
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
  address: PropTypes.string.isRequired,
  onInputBlur: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default FindAddressPresenter;
