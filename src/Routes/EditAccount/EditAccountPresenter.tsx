import Proptypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import Button from "../../Components/Button";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";
import PhotoInput from "../../Components/PhotoInput";
import routes from "../../routes";

const Container = styled.div``;

const ExtendedForm = styled(Form)`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 30px;
`;

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  onSubmit: React.FormEventHandler;
  onInputChange: React.ChangeEventHandler;
  onPhotoChange: React.ChangeEventHandler;
  loading: boolean;
  uploading: boolean;
}

const EditAccountPresenter: React.FunctionComponent<Props> = ({
  firstName,
  lastName,
  email,
  onSubmit,
  profilePhoto,
  onInputChange,
  onPhotoChange,
  loading,
  uploading,
}) => (
  <Container>
    <Helmet>
      <title>Edit Account | Number</title>
    </Helmet>
    <Header title={"Edit Account"} backTo={routes.home} />
    <ExtendedForm submitFn={onSubmit}>
      <PhotoInput
        uploading={uploading}
        fileUrl={profilePhoto}
        onChange={onPhotoChange}
      />
      <ExtendedInput
        onChange={onInputChange}
        type={"text"}
        name={"firstName"}
        value={firstName}
        placeholder={"First name"}
      />
      <ExtendedInput
        onChange={onInputChange}
        type={"text"}
        name={"lastName"}
        value={lastName}
        placeholder={"Last name"}
      />
      <ExtendedInput
        onChange={onInputChange}
        type={"email"}
        name={"email"}
        value={email}
        placeholder={"Email"}
      />
      <Button onClick={null} value={loading ? "Loading" : "Update"} />
    </ExtendedForm>
  </Container>
);

EditAccountPresenter.propTypes = {
  firstName: Proptypes.string.isRequired,
  lastName: Proptypes.string.isRequired,
  email: Proptypes.string.isRequired,
  profilePhoto: Proptypes.string.isRequired,
  onSubmit: Proptypes.func.isRequired,
  onInputChange: Proptypes.func.isRequired,
  onPhotoChange: Proptypes.func.isRequired,
  loading: Proptypes.bool.isRequired,
  uploading: Proptypes.bool.isRequired,
};

export default EditAccountPresenter;
