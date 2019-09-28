/* eslint-disable */
import React from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grid } from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import styled from "styled-components";
import { connect } from "react-redux";
import { compose } from "redux";
import { Roles } from "meteor/alanning:roles";
import Navigation from "../../components/Navigation/Navigation";
import Public from "../../components/Public/Public";
import NormalRoute from "../../components/NormalRoute/NormalRoute";
import Index from "../../pages/Index/Index";
import Footer from "../../components/Footer/Footer";
import getUserName from "../../../modules/get-user-name";
import Logout from "../../pages/Logout/Logout";
import Login from "../../pages/Login/Login";
import RecoverPassword from "../../pages/RecoverPassword/RecoverPassword";
import ResetPassword from "../../pages/ResetPassword/ResetPassword";
import AuthorizedLayout from "../../layouts/AuthorizedLayout/AuthorizedLayout";
import { onLogin, onLogout } from "../../../modules/redux/actions";
import withTrackerSSR from "../../../modules/with-tracker-ssr";
import { Notifications } from "../../../api/Notification/NotificationClass";
import NotFound from "../../pages/NotFound/NotFound";

const StyledApp = styled.div`
  visibility: ${props =>
    props.ready && !props.loading ? "visible" : "hidden"};

  > .container {
    margin-bottom: 80px;
    padding-bottom: 20px;
  }

  .verify-email {
    margin-bottom: 0;
    padding: 0;
    border-top: none;
    border-bottom: 1px solid #e7e7e7;
    background: #fff;
    color: var(--gray-dark);
    border-radius: 0;

    p {
      padding: 19px;
    }

    .btn {
      padding: 0;
    }
  }
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ready: false, afterLoginPath: null };
    autoBind(this);
  }

  componentDidMount() {
    const { handleOnLogin, handleOnLogout } = this.props;
    Accounts.onLogin(() => handleOnLogin());
    Accounts.onLogout(() => handleOnLogout());
    this.setPageReady();
  }

  setPageReady() {
    this.setState({ ready: true });
  }

  setAfterLoginPath(afterLoginPath) {
    this.setState({ afterLoginPath });
  }

  render() {
    const { props, state, setAfterLoginPath } = this;
    return (
      <StyledApp ready={this.state.ready}>
        <Navigation {...props} {...state} />
        <Grid fluid>
          <Switch>
            <Route
              exact
              name="index"
              path="/"
              render={routeProps => (
                <Index
                  {...routeProps}
                  {...props}
                  {...state}
                  setAfterLoginPath={setAfterLoginPath}
                />
              )}
            />

            <Route
              path="/auth"
              render={routeProps => (
                <AuthorizedLayout
                  {...routeProps}
                  {...props}
                  {...state}
                  setAfterLoginPath={setAfterLoginPath}
                />
              )}
            />

            <Public path="/login" component={Login} {...props} {...state} />
            <Route
              exact
              path="/logout"
              render={routeProps => (
                <Logout
                  {...routeProps}
                  setAfterLoginPath={setAfterLoginPath}
                  {...props}
                  {...state}
                />
              )}
            />
            <NormalRoute
              exact
              name="recover-password"
              path="/recover-password"
              component={RecoverPassword}
              {...props}
              {...state}
            />
            <NormalRoute
              exact
              name="token"
              path="/reset-password/:token"
              component={ResetPassword}
              {...props}
              {...state}
            />

            <Route component={NotFound} />
          </Switch>
        </Grid>
        <Footer />
      </StyledApp>
    );
  }
}

App.defaultProps = {
  userId: ""
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
  handleOnLogin: PropTypes.func.isRequired,
  handleOnLogout: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { auth } = state;
  const stateToReturn = {
    loading: auth.loading,
    loggingIn: auth.loggingIn,
    authenticated: auth.authenticated,
    name: auth.name,
    roles: auth.roles,
    groups: auth.groups,
    userId: auth.userId,
    emailAddress: auth.emailAddress
  };
  delete state.auth;
  return { ...stateToReturn, ...state };
};

const mapDispatchToProps = dispatch => ({
  handleOnLogin: data => dispatch(onLogin(data)),
  handleOnLogout: data => dispatch(onLogout(data))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTrackerSSR(() => {
    const loggingIn = Meteor.loggingIn();
    const user = Meteor.user();
    const userId = Meteor.userId();
    const notify = Meteor.subscribe("notification.getUnreadNotification");
    const loading = !Roles.subscription.ready() && !notify.ready();
    const name =
      user &&
      user.profile &&
      user.profile.name &&
      getUserName(user.profile.name);
    const emailAddress = user && user.emails && user.emails[0].address;

    return {
      loading,
      loggingIn,
      authenticated: !loggingIn && !!userId,
      name: name || emailAddress,
      groups: Roles.getGroupsForUser(userId),
      roles: Roles.getRolesForUser(userId),
      userId,
      emailAddress,
      unReadCount:
        notify.ready() &&
        Notifications.find({ for: userId, read: false }).count()
    };
  })
)(App);
