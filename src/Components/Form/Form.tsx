import PropTypes from "prop-types";
import React from "react";

interface Props {
  submitFn: any;
  className?: string;
  children: any;
}

const Form: React.FunctionComponent<Props> = ({
  submitFn,
  className,
  children,
}) => (
  <form
    className={className}
    onSubmit={(e) => {
      e.preventDefault();
      submitFn();
    }}
  >
    {children}
  </form>
);

Form.propTypes = {
  submitFn: PropTypes.any.isRequired,
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
};

export default Form;
