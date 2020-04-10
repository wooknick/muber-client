import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const Container = styled.input`
  border: none;
  border-bottom: 2px solid ${(props) => props.theme.colors.greyColor};
  font-size: 20px;
  width: 100%;
  padding-bottom: 10px;
  font-weight: 500;
  transition: border-bottom 0.1s linear;
  &:-webkit-autofill {
    box-shadow: 0 0 0px 1000px white inset !important;
  }
  &:focus {
    border-bottom-color: #2c3e50;
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.theme.colors.greyColor};
    font-weight: 300;
  }
`;

interface Props {
  placeholder?: string;
  type?: string;
  required?: boolean;
  value: string;
  name?: string;
  onChange?: any;
}

const Input: React.FunctionComponent<Props> = ({
  placeholder = "",
  type = "text",
  required = true,
  value,
  name = "",
  onChange,
}) => (
  <Container
    onChange={onChange}
    name={name}
    placeholder={placeholder}
    type={type}
    required={required}
    value={value}
  />
);

Input.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.any,
};

export default Input;
