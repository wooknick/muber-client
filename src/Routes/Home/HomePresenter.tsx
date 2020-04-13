import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";
import Sidebar from "react-sidebar";
import styled from "styled-components";
import Menu from "../../Components/Menu";

const Container = styled.div``;

interface Props {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  loading: boolean;
}

const HomePresenter: React.FunctionComponent<Props> = ({
  isMenuOpen,
  toggleMenu,
  loading,
}) => (
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
      {!loading && <button onClick={toggleMenu}>Open sidebar</button>}
    </Sidebar>
  </Container>
);

HomePresenter.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default HomePresenter;
