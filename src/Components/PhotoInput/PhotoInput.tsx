import Proptypes from "prop-types";
import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import styled from "styled-components";
import defaultAvatar from "../../images/defaultAvatar.png";

const Container = styled.div``;

const Image = styled.label`
  cursor: pointer;
  height: 80px;
  width: 80px;
  border: 2px solid black;
  display: block;
  border-radius: 50%;
  margin-bottom: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  overflow: hidden;
  & img {
    width: 80px;
    height: 80px;
  }
`;

const Input = styled.input`
  color: white;
  opacity: 0;
  height: 1px;
  &:focus {
    outline: none;
  }
`;

interface Props {
  uploading: boolean;
  fileUrl: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoInput: React.FunctionComponent<Props> = ({
  uploading,
  fileUrl,
  onChange,
}) => (
  <Container>
    <Input id={"photo"} type="file" accept="image/*" onChange={onChange} />
    <Image htmlFor="photo">
      {uploading && (
        <Loader
          type="ThreeDots"
          color="black"
          height={40}
          width={40}
          timeout={8000} // 3 secs
        />
      )}
      {!uploading && (
        <img alt={"profilePhoto"} src={fileUrl || defaultAvatar} />
      )}
    </Image>
  </Container>
);

PhotoInput.propTypes = {
  uploading: Proptypes.bool.isRequired,
  fileUrl: Proptypes.string.isRequired,
  onChange: Proptypes.func.isRequired,
};

export default PhotoInput;
