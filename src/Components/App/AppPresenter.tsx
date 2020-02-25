import PropTypes from "prop-types";
import React from "react";

interface Props {
  isLoggedIn: boolean;
}

const AppPresenter: React.FunctionComponent<Props> = ({ isLoggedIn }) =>
  isLoggedIn ? <span>"you are in"</span> : <span>"you are out"</span>;

AppPresenter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default AppPresenter;
