import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import Button from "../../Components/Button";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";

const Container = styled.div``;

const ExtendedForm = styled(Form)`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 20px;
`;

interface Props {
  keyString: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  loading: boolean;
}

const VerifyPhonePresenter: React.FunctionComponent<Props> = ({
  keyString,
  onChange,
  onSubmit,
  loading,
}) => (
  <Container>
    <Helmet>
      <title>Verify Phone | Number</title>
    </Helmet>
    <Header backTo={"/phone-login"} title={"Verify Phone Number"} />
    <ExtendedForm submitFn={onSubmit}>
      <ExtendedInput
        value={keyString}
        placeholder={"Enter Verification Code"}
        onChange={onChange}
        name={"key"}
      />
      <Button
        disabled={loading}
        value={loading ? "Verifying" : "Submit"}
        onClick={null}
      />
    </ExtendedForm>
  </Container>
);

VerifyPhonePresenter.propTypes = {
  keyString: PropTypes.string.isRequired,
  onChange: PropTypes.any.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default VerifyPhonePresenter;
