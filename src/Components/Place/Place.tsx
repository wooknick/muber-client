import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const Place = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  & i {
    font-size: 12px;
  }
`;

const Container = styled.div`
  margin-left: 10px;
`;

const Name = styled.span`
  display: block;
`;

const Icon = styled.span`
  cursor: pointer;
`;

const Address = styled.span`
  color: ${(props) => props.theme.colors.greyColor};
  font-size: 14px;
`;

interface Props {
  fav: boolean;
  name: string;
  address: string;
}

const PlacePresenter: React.FunctionComponent<Props> = ({
  fav,
  name,
  address,
}) => (
  <Place>
    <Icon>{fav ? "✩" : "★"}</Icon>
    <Container>
      <Name>{name}</Name>
      <Address>{address}</Address>
    </Container>
  </Place>
);

PlacePresenter.propTypes = {
  fav: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};
export default PlacePresenter;
