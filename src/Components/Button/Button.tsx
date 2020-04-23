import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const Container = styled.input`
  width: 100%;
  background-color: black;
  color: white;
  text-transform: uppercase;
  padding: 15px 0;
  font-size: 16px;
  border: 0;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  &:active,
  &:focus {
    outline: none;
  }
  &:disabled {
    opacity: 0.8;
  }
`;

interface Props {
  value: string;
  onClick?: any;
  disabled?: boolean;
  className?: string;
}

const Button: React.FunctionComponent<Props> = ({
  value,
  onClick,
  disabled = false,
  className,
}) => (
  <Container
    value={value}
    disabled={disabled}
    onClick={onClick}
    className={className}
    type={"submit"}
  />
);

Button.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.any,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
export default Button;
