import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  transform: scale(0.8);
`;

interface Props {
  backTo: string;
  className?: string;
}

const BackArrow: React.FunctionComponent<Props> = ({ backTo, className }) => (
  <Container className={className}>
    <Link to={backTo}>
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z" />
      </svg>
    </Link>
  </Container>
);

BackArrow.propTypes = {
  backTo: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default BackArrow;
