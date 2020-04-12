import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyPhone, verifyPhoneVariables } from "../../@types/api";
import { LOG_USER_IN } from "../../sharedQueries.local";
import VerifyPhonePresenter from "./VerifyPhonePresenter";
import { VERIFY_PHONE } from "./VerifyPhoneQueries";

type LocationState = {
  phoneNumber: string;
};
const VerifyPhoneContainer: React.FunctionComponent<RouteComponentProps<
  {},
  StaticContext,
  LocationState
>> = ({
  location,
  history,
}: RouteComponentProps<{}, StaticContext, LocationState>) => {
  const [key, setKey] = useState("");
  const [verifyPhoneMutation, { loading }] = useMutation<
    verifyPhone,
    verifyPhoneVariables
  >(VERIFY_PHONE, {
    variables: {
      key,
      phoneNumber: location.state.phoneNumber,
    },
  });
  const [logUserInMutation] = useMutation(LOG_USER_IN);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {
      target: { value },
    } = event;
    setKey(value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async () => {
    try {
      const { data } = await verifyPhoneMutation();
      const CompletePhoneVerification = data?.CompletePhoneVerification;
      if (CompletePhoneVerification?.ok) {
        toast.success("You're verifed, loggin in now");
        logUserInMutation({
          variables: {
            token: CompletePhoneVerification?.token,
          },
        });
      } else {
        toast.error(CompletePhoneVerification?.error);
      }
    } catch {
      toast.error("Cant Verify");
    }
  };

  if (!location.state) {
    history.push("/");
  }

  return (
    <VerifyPhonePresenter
      onSubmit={onSubmit}
      onChange={onInputChange}
      keyString={key}
      loading={loading}
    />
  );
};

export default VerifyPhoneContainer;
