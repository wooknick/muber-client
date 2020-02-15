import React from "react";
import { graphql } from "react-apollo";
import { IS_LOGGED_IN } from "./AppQuries";

const AppContainer = ({ data }: { data?: any }) => (
  <div>{JSON.stringify(data)}</div>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
