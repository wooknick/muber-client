import React from "react";
import { graphql } from "react-apollo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { ThemeProvider } from "styled-components";
import theme from "../../theme";
import AppPresenter from "./AppPresenter";
import { IS_LOGGED_IN } from "./AppQuries";

const AppContainer = ({ data }: { data?: any }) => (
  <>
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </ThemeProvider>
    <ToastContainer draggable={true} position={"bottom-center"} />
  </>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
