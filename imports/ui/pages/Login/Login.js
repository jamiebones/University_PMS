/*eslint-disable */
import React from "react";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  Button,
  Alert
} from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Bert } from "meteor/themeteorchef:bert";
import validate from "../../../modules/validate";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      userEmail: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        emailAddress: {
          required: true,
          email: true
        },
        password: {
          required: true
        }
      },
      messages: {
        emailAddress: {
          required: "Need an email address here.",
          email: "Is this email address correct?"
        },
        password: {
          required: "Need a password here."
        }
      },
      submitHandler() {
        component.handleSubmit();
      }
    });
  }

  handleSubmit() {
    const isInRole = (user, roles, group) => {
      return Roles.userIsInRole(user, [roles], group);
    };
    const { history, setAfterLoginPath } = this.props;
    this.setState({
      submitted: !this.state.submitted,
      userEmail: this.emailAddress.value
    });

    Meteor.loginWithPassword(
      this.emailAddress.value,
      this.password.value,
      error => {
        if (error) {
          this.setState({ submitted: !this.state.submitted });
          Bert.alert(error.reason, "danger");
        } else {
          const user = Meteor.user();
          if (user !== undefined) {
            history.push("/auth/dashboard");
          }
          Bert.alert("You have been logged in successfully!", "success");
        }
      }
    );
  }

  render() {
    return (
      <div className="Login">
        <Row>
          <Col
            xs={12}
            sm={6}
            smOffset={3}
            md={5}
            mdOffset={5}
            lg={4}
            lgOffset={4}
          >
            <h4 className="page-header">Log In</h4>
            <form
              ref={form => (this.form = form)}
              onSubmit={event => event.preventDefault()}
            >
              <FormGroup>
                <ControlLabel>Email Address</ControlLabel>
                <input
                  type="email"
                  name="emailAddress"
                  ref={emailAddress => (this.emailAddress = emailAddress)}
                  className="form-control"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel className="clearfix">
                  <span className="pull-left">Password</span>
                  <Link className="pull-right" to="/recover-password">
                    Forgot password?
                  </Link>
                </ControlLabel>
                <input
                  type="password"
                  name="password"
                  ref={password => (this.password = password)}
                  className="form-control"
                />
              </FormGroup>
              <Button
                type="submit"
                bsStyle="success"
                disabled={this.state.submitted ? true : false}
              >
                {this.state.submitted ? "Please wait....." : "Log In"}
              </Button>
            </form>
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            sm={6}
            smOffset={3}
            md={5}
            mdOffset={5}
            lg={4}
            lgOffset={4}
          >
            {this.state.submitted ? (
              <Alert bsStyle="info">
                <p className="text-center">
                  Logging user <b>{this.state.userEmail}</b> into the system.
                  Please wait....
                </p>
              </Alert>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired
};

export default Login;
