import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import routes from "../../routes";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneLoginQueries";
import {
  startPhoneVerification,
  startPhoneVerificationVariables,
} from "../../types/api";

const PhoneLoginContainer: React.FunctionComponent<RouteComponentProps> = ({
  history,
}: RouteComponentProps) => {
  const [countryCode, setCountryCode] = useState("+82");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneSignInMutation, { loading }] = useMutation<
    startPhoneVerification,
    startPhoneVerificationVariables
  >(PHONE_SIGN_IN, {
    variables: {
      phoneNumber: `${countryCode}${phoneNumber}`,
    },
  });

  const onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (event) => {
    const {
      target: { name, value },
    } = event;
    if (value.length < 12) {
      if (name === "countryCode") {
        setCountryCode(value);
      } else if (name === "phoneNumber") {
        setPhoneNumber(value);
      }
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const isValid =
      /^0[0-9]{9,10}$/.test(`${phoneNumber}`) &&
      /^\+[1-9]{2,4}$/.test(`${countryCode}`);

    if (isValid) {
      try {
        const { data } = await phoneSignInMutation();
        const StartPhoneVerification = data?.StartPhoneVerification;
        if (StartPhoneVerification?.ok) {
          toast.success("SMS Sent! Redirecting you..");
          setTimeout(() => {
            history.push({
              pathname: routes.verifyPhone,
              state: {
                phoneNumber: `${countryCode}${phoneNumber}`,
              },
            });
          }, 2000);
        } else {
          toast.error(StartPhoneVerification?.error);
        }
      } catch {
        toast.error("Cannot connect to server");
      }
    } else {
      toast.error("Please write a valid phone number");
    }
  };

  return (
    <PhoneLoginPresenter
      countryCode={countryCode}
      phoneNumber={phoneNumber}
      onInputChange={onInputChange}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
};

export default PhoneLoginContainer;
