import React from "react";
import { Row, Col, FormGroup, ControlLabel, Button } from "react-bootstrap";
import { Bert } from "meteor/themeteorchef:bert";
import InputHint from "../../components/InputHint/InputHint";
import validate from "../../../modules/validate";
import autoBind from "react-autobind";

class CreateUserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      password: "password",
      roles: "0"
    };
    autoBind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
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
        firstName: {
          required: "first name is required?"
        },
        lastName: {
          required: "last name is required?"
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

  onChange(e) {
    if (e.target.value == "0") return;
    console.log(e.target.value);
    this.setState({ roles: e.target.value });
  }

  handleSubmit() {
    const options = {
      email: this.emailAddress.value,
      password: this.password.value,
      roles: this.state.roles,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value
        }
      }
    };
    if (this.state.roles == "0") {
      Bert.alert(`Please select the account type`, "danger");
      return;
    }
    this.setState({ submitted: !this.state.submitted });
    Meteor.call("user.createUserAccount", options, (error, response) => {
      if (error) {
        Bert.alert(error.reason, "danger");
        this.setState({ submitted: !this.state.submitted });
      } else {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert("Account created !", "success");
      }
    });
  }

  render() {
    return (
      <div>
        <h4 className="page-header">Create User Account</h4>

        <form
          ref={form => (this.form = form)}
          onSubmit={event => event.preventDefault()}
        >
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
                <ControlLabel>Surname</ControlLabel>
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
            <ControlLabel>Access Type</ControlLabel>
            <select onChange={this.onChange} className="form-control">
              <option value="0">select account type</option>
              <option value="Registrar">Registrar</option>
              <option value="Director">Director of Personnel</option>
              <option value="Records">Records staff</option>
              <option value="JSE">Junior Staff Establishment</option>
              <option value="SATS">Senior Staff Establishment</option>
              <option value="ASE">Academic Staff Establishment</option>
            </select>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <input
              type="password"
              name="password"
              defaultValue={this.state.password}
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
        </form>
      </div>
    );
  }
}

export default CreateUserAccount;
