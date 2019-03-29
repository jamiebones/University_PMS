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
import { withTracker } from "meteor/react-meteor-data";
import DatePicker from "react-datepicker";
if (Meteor.isClient) import "react-datepicker/dist/react-datepicker.css";
import { NigeriaStates } from "../../../api/NigeriaStates/NigeriaStatesClass";
import moment from "moment";
import autoBind from "react-autobind";
import { _ } from "meteor/underscore";

class StaffBio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dob: moment(),
      firstName: "",
      middleName: "",
      surname: "",
      sex: "",
      maritalStatus: "",
      staffId: "",
      profilePicture: "",
      state: "",
      lga: [],
      lgaOrigin: ""
    };
    autoBind(this);
  }

  static getDerivedStateFromProps(nextProps, state) {
    debugger;
    if (nextProps.staff.stateOfOrigin.trim() !== state.state) {
      const { staff, states } = nextProps;
      const selectedState = states.find(st => {
        return (
          st.state.toLowerCase().trim() ===
          staff.stateOfOrigin.toLowerCase().trim()
        );
      });

      return {
        firstName: staff.biodata.firstName,
        surname: staff.biodata.surname,
        middleName: staff.biodata.middleName,
        profilePicture: staff.biodata.profilePicture,
        sex: staff.sex,
        dob: moment(staff.dob),
        maritalStatus: staff.maritalStatus,
        staffId: staff.staffId,
        state: staff.stateOfOrigin.trim(),
        lgaOrigin: staff.lgaOfOrigin.trim()
        // lga: selectedState && selectedState.lga
      };
    }
    return null;
  }

  onChange(e) {
    if (e === "0") return;
    this.setState({ [e.target.name]: e.target.value });
  }

  onStateChange(e) {
    const state = e.target.value;
    let states = this.props.states;
    //find lga
    const selectedState = states.find(st => {
      return st.state.toLowerCase().trim() === state.toLowerCase().trim();
    });
    if (!_.isEmpty(selectedState)) {
      const lga = selectedState.lga;
      this.setState({ lga: lga });
    }
    this.setState({ [e.target.name]: e.target.value });
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

  handleSubmit() {}

  render() {
    const { staff, states } = this.props;
    return (
      <div className="StaffBio">
        <Row>
          <Col xs={12} sm={8} md={8} lg={8}>
            <form
              ref={form => (this.form = form)}
              onSubmit={event => event.preventDefault()}
            >
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <select
                  className="form-control"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                >
                  <option value="0">select title</option>
                </select>
              </FormGroup>

              <FormGroup>
                <ControlLabel>First Name</ControlLabel>
                <input
                  type="text"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.onChange}
                  className="form-control"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Middle Name</ControlLabel>
                <input
                  type="text"
                  name="middleName"
                  value={this.state.middleName}
                  onChange={this.onChange}
                  className="form-control"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Surname</ControlLabel>
                <input
                  type="text"
                  name="surname"
                  value={this.state.surname}
                  onChange={this.onChange}
                  className="form-control"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Date of Birth</ControlLabel>
                <DatePicker
                  selected={this.state.dob}
                  onChange={this.onChange}
                  className="form-control"
                  placeholderText="date of birth"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Sex</ControlLabel>
                <select
                  className="form-control"
                  name="sex"
                  value={this.state.sex}
                  onChange={this.onChange}
                >
                  <option value="0">select sex</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Marital Status</ControlLabel>
                <select
                  className="form-control"
                  name="sex"
                  value={this.state.maritalStatus}
                  onChange={this.onChange}
                >
                  <option value="0">select marital status</option>
                  <option value="S">single</option>
                  <option value="M">married</option>
                  <option value="D">divorced</option>
                  <option value="W">widow</option>
                  <option value="W">widower</option>
                </select>
              </FormGroup>

              <FormGroup>
                <ControlLabel>State</ControlLabel>
                <select
                  className="form-control"
                  name="state"
                  value={this.state.state}
                  onChange={this.onStateChange}
                >
                  <option value="0">select state</option>
                  {states &&
                    states.map(({ state }, index) => {
                      return <option key={index + 9444}>{state}</option>;
                    })}
                </select>
              </FormGroup>

              <FormGroup>
                <ControlLabel>lga</ControlLabel>
                <select
                  className="form-control"
                  name="lgaOrigin"
                  value={this.state.lgaOrigin}
                  onChange={this.onChange}
                >
                  <option value="0">select lga</option>
                  {this.state.lga &&
                    this.state.lga.map((lga, index) => {
                      return <option key={index + 400}>{lga}</option>;
                    })}
                </select>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Staff ID </ControlLabel>
                <input
                  type="text"
                  name="staffId"
                  value={this.state.staffId}
                  onChange={this.onChange}
                  className="form-control"
                />
              </FormGroup>

              <Button
                type="submit"
                bsStyle="success"
                disabled={this.state.submitted ? true : false}
              >
                {this.state.submitted ? "Please wait....." : "Save"}
              </Button>
            </form>
          </Col>

          <Col xs={12} sm={4} md={4} lg={4}>
            {/*profilePicture ? (
              <p>
                <span className="text-center">Profile Picture</span>
                <img
                  className="img img-responsive"
                  src={profilePicture && profilePicture}
                />
              </p>
            ) : null*/}
          </Col>
        </Row>
      </div>
    );
  }
}

export default (StaffBioContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("nigeriastates.getallStates");
  }

  return {
    loading: subscription && !subscription.ready(),
    //staff: StaffMembers.find(staffId).fetch(),
    states: NigeriaStates.find({}).fetch()
  };
})(StaffBio));
