import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

const NormalRoute = ({ component, path, exact, ...rest }) => (
  <Route
    path={path}
    exact={exact}
    render={props =>
      React.createElement(component, {
        ...props,
        ...rest
      })
    }
  />
);

NormalRoute.defaultProps = {
  path: "",
  exact: false,
  afterLoginPath: null
};

NormalRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool
};

export default NormalRoute;
