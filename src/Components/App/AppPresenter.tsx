import PropTypes from "prop-types";
import React from "react";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
  } from "react-router-dom";
import routes from "../../routes";
import AddPlace from "../../Routes/AddPlace";
import EditAccount from "../../Routes/EditAccount";
import FindAddress from "../../Routes/FindAddress";
import Home from "../../Routes/Home";
import Login from "../../Routes/Login";
import PhoneLogin from "../../Routes/PhoneLogin";
import Places from "../../Routes/Places";
import Ride from "../../Routes/Ride";
import Settings from "../../Routes/Settings";
import SocialLogin from "../../Routes/SocialLogin";
import VerifyPhone from "../../Routes/VerifyPhone";

interface Props {
  isLoggedIn: boolean;
}

const AppPresenter: React.FunctionComponent<Props> = ({ isLoggedIn }) => (
  <BrowserRouter>
    {isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}
  </BrowserRouter>
);

const LoggedOutRoutes: React.FunctionComponent = () => (
  <Switch>
    <Route path={routes.home} exact={true} component={Login} />
    <Route path={routes.phoneLogin} component={PhoneLogin} />
    <Route path={routes.verifyPhone} component={VerifyPhone} />
    <Route path={routes.socialLogin} component={SocialLogin} />
    <Redirect from={"*"} to={"/"} />
  </Switch>
);
const LoggedInRoutes: React.FunctionComponent = () => (
  <Switch>
    <Route path={routes.home} exact={true} component={Home} />
    <Route path={routes.ride} component={Ride} />
    <Route path={routes.editAccount} component={EditAccount} />
    <Route path={routes.settings} component={Settings} />
    <Route path={routes.places} component={Places} />
    <Route path={routes.addPlace} component={AddPlace} />
    <Route path={routes.findAddress} component={FindAddress} />
    <Redirect from={"*"} to={"/"} />
  </Switch>
);

AppPresenter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default AppPresenter;
