import React from "react";
import { graphql } from "react-apollo";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { reset } from "styled-reset";
import theme from "../../theme";
import AppPresenter from "./AppPresenter";
import { IS_LOGGED_IN } from "./AppQuries";

const GlobalStyle = createGlobalStyle`
  ${reset}
`;
const AppContainer = ({ data }: { data?: any }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
  </ThemeProvider>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
