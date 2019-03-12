import React from "react";
import { Row, Col, FormGroup, ControlLabel, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import { Bert } from "meteor/themeteorchef:bert";
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from "../../components/AccountPageFooter/AccountPageFooter";
import validate from "../../../modules/validate";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        title: {
          required: true
        },
        firstName: {
          required: true
        },
        lastName: {
          required: true
        },
        emailAddress: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 6
        }
      },
      messages: {
        title: {
          required: "What's your title?"
        },
        firstName: {
          required: "What's your first name?"
        },
        lastName: {
          required: "What's your last name?"
        },
        emailAddress: {
          required: "Need an email address here.",
          email: "Is this email address correct?"
        },
        password: {
          required: "Need a password here.",
          minlength: "Please use at least six characters."
        }
      },
      submitHandler() {
        component.handleSubmit();
      }
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const value = this.title.value;
    if (value === "select") {
      Bert.alert("Select Title", "danger");
      return;
    }
    const options = {
      email: this.emailAddress.value,
      password: this.password.value,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value
        },
        title: this.title.value
      }
    };
    this.setState({ submitted: !this.state.submitted });
    const name = this.firstName.value;
    Meteor.call("user.createUserAccount", options, (error, response) => {
      if (error) {
        Bert.alert(error.reason, "danger");
        this.setState({ submitted: !this.state.submitted });
      } else {
        Bert.alert("Account created !", "success");
        history.push(`/account_created/${name}`);
      }
    });
  }

  render() {
    return (
      <div className="Signup">
        <Row>
          <Col
            xs={12}
            sm={6}
            md={5}
            lg={4}
            smOffset={3}
            md={5}
            mdOffset={5}
            lg={4}
            lgOffset={4}
          >
            <h4 className="page-header">Register Account</h4>

            <form
              ref={form => (this.form = form)}
              onSubmit={event => event.preventDefault()}
            >
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <select
                  className="form-control title"
                  ref={title => (this.title = title)}
                  name="title"
                >
                  <option value="select">select title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr(Engr)">Dr(Engr)</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>
              </FormGroup>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <ControlLabel>First Name</ControlLabel>
                    <input
                      type="text"
                      name="firstName"
                      ref={firstName => (this.firstName = firstName)}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <ControlLabel>Last Name</ControlLabel>
                    <input
                      type="text"
                      name="lastName"
                      ref={lastName => (this.lastName = lastName)}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
              </Row>
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
                <ControlLabel>Password</ControlLabel>
                <input
                  type="password"
                  name="password"
                  ref={password => (this.password = password)}
                  className="form-control"
                />
                <InputHint>Use at least six characters.</InputHint>
              </FormGroup>
              <Button
                type="submit"
                bsStyle="success"
                disabled={this.state.submitted}
              >
                {this.state.submitted
                  ? "Creating account please wait------"
                  : "Sign Up"}
              </Button>
              <AccountPageFooter>
                <p>
                  Already have an account? <Link to="/login">Log In</Link>.
                </p>
              </AccountPageFooter>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired
};

export default Signup;
