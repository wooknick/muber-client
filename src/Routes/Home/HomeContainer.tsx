import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { USER_PROFILE } from "../../sharedQueries";
import { userProfile } from "../../types/api";
import HomePresenter from "./HomePresenter";

const HomeContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { loading } = useQuery<userProfile>(USER_PROFILE);

  const toggleMenu = () => {
    setIsMenuOpen((v) => !v);
  };

  return (
    <HomePresenter
      loading={loading}
      isMenuOpen={isMenuOpen}
      toggleMenu={toggleMenu}
    />
  );
};

export default HomeContainer;
