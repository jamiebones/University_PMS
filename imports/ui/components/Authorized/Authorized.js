/*eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { Roles } from "meteor/alanning:roles";
import autoBind from "react-autobind";
import { Meteor } from "meteor/meteor";
import { withRouter } from "react-router";
import { withTracker } from "meteor/react-meteor-data";

class Authorized extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authorized: false };
    autoBind(this);
  }

  componentWillMount() {
    if (Meteor.isClient) {
      this.props.setAfterLoginPath(
        `${window.location.pathname}${window.location.search}`
      );
    }
  }

  componentDidMount() {
    this.checkIfAuthorized();
  }

  componentDidUpdate() {
    this.checkIfAuthorized();
  }

  checkIfAuthorized() {
    const {
      loading,
      userId,
      userRoles,
      userIsInRoles,
      pathAfterFailure
    } = this.props;

    if (!userId) this.props.history.push(pathAfterFailure || "/");

    if (!loading && userRoles.length > 0) {
      if (!userIsInRoles) {
        this.props.history.push(pathAfterFailure || "/login");
      } else {
        // Check to see if authorized is still false before setting. This prevents an infinite loop
        // when this is used within componentDidUpdate.
        if (!this.state.authorized) this.setState({ authorized: true }); // eslint-disable-line
      }
    }
  }

  render() {
    const { component: Component, path, exact, ...rest } = this.props;

    return this.state.authorized ? (
      <Route
        path={path}
        exact={exact}
        render={props => <Component {...rest} {...props} />}
      />
    ) : (
      <div />
    );
  }
}

Authorized.defaultProps = {
  group: null,
  userId: null,
  exact: false,
  userRoles: [],
  userIsInRoles: false,
  pathAfterFailure: "/login"
};

Authorized.propTypes = {
  loading: PropTypes.bool.isRequired,
  allowedRoles: PropTypes.array.isRequired,
  allowedgroup: PropTypes.string,
  userId: PropTypes.string,
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  history: PropTypes.object.isRequired,
  userRoles: PropTypes.array,
  userIsInRoles: PropTypes.bool,
  pathAfterFailure: PropTypes.string
};

export default withRouter(
  withTracker(({ allowedRoles, group }) => {
    // eslint-disable-line
    return Meteor.isClient
      ? {
          loading: Meteor.isClient ? !Roles.subscription.ready() : true,
          userId: Meteor.userId(),
          userRoles: Roles.getRolesForUser(Meteor.userId(), group),
          userIsInRoles: Roles.userIsInRole(
            Meteor.userId(),
            allowedRoles,
            group
          )
        }
      : {};
  })(Authorized)
);
