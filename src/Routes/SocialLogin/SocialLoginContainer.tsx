import React from "react";
import { useMutation } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { LOG_USER_IN } from "../../sharedQueries.local";
import { facebookConnect, facebookConnectVariables } from "../../types/api";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { FACEBOOK_CONNECT } from "./SocialLoginQueries";

const SocialLoginContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const [facebookConnectMutation] = useMutation<
    facebookConnect,
    facebookConnectVariables
  >(FACEBOOK_CONNECT);
  const [logUserInMutation] = useMutation(LOG_USER_IN);

  const loginCallback = async (response) => {
    const {
      name,
      first_name: firstName,
      last_name: lastName,
      email,
      id: fbId,
      accessToken,
    } = response;

    if (accessToken) {
      toast.success(`Welcome ${name}`);
      try {
        const { data } = await facebookConnectMutation({
          variables: {
            fbId,
            firstName,
            lastName,
            email,
          },
        });
        const FacebookConnect = data?.FacebookConnect;
        if (FacebookConnect?.ok) {
          toast.success("you're verifed, loggin in now");
          logUserInMutation({
            variables: {
              token: FacebookConnect?.token,
            },
          });
        } else {
          toast.error(FacebookConnect?.error);
        }
      } catch {
        toast.error("cant login with fb");
      }
    } else {
      toast.error("cant connect fb");
    }
  };

  return <SocialLoginPresenter loginCallback={loginCallback} />;
};

export default SocialLoginContainer;
