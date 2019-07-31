import React from "react";
import styled from "styled-components";
import { Row, Col, FormGroup, ControlLabel, Button } from "react-bootstrap";
import autoBind from "react-autobind";
import { withTracker } from "meteor/react-meteor-data";
import { NigeriaStates } from "../../../api/NigeriaStates/NigeriaStatesClass";
import { ReactInput } from "input-format";
import { templateParser, templateFormatter, parseDigit } from "input-format";
import DatePicker from "react-datepicker";
import { _ } from "meteor/underscore";
import { AddSlashToPhoneNumber } from "../../../modules/utilities";
import moment from "moment";

const BiodataComponentStyles = styled.div`
  .phone {
    margin-bottom: 15p;
    background-color: #c0c0c0;
    padding: 10px;
    cursor: pointer;
  }
  label {
    display: block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: bold;
  }
`;

class BiodataComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dob: moment(new Date()),
      phoneNumber: ""
    };
    autoBind(this);
  }

  savePhoneNumber() {
    const { phoneNumber } = this.state;
    const { phone } = this.props.staff.biodata;
    if (!phoneNumber) return;
    this.props.staffData(
      {
        staffDataKey: "biodata",
        staffKey: "phone",
        staffValue: phone ? [...phone, phoneNumber] : [phoneNumber]
      },
      "biodata"
    );
  }

  handlePhoneNumberChange(value) {
    this.setState({ phoneNumber: value });
  }

  onChange(e) {
    if (e === "0") return;
    this.props.staffData(
      {
        staffDataKey: "biodata",
        staffKey: e.target.name,
        staffValue: e.target.value
      },
      "biodata"
    );
  }

  handleDobChange(date) {
    this.setState({ dob: date });
    this.props.staffData(
      {
        staffDataKey: "biodata",
        staffKey: "dob",
        staffValue: date
      },
      "biodata"
    );
  }

  removePhoneNumber(e, index) {
    const { phone } = this.props.staff.biodata;
    const phones = phone || [];
    const remainPhones = phones.filter(e => {
      return e !== phones[index];
    });

    this.props.staffData(
      {
        staffDataKey: "biodata",
        staffKey: "phone",
        staffValue: [...remainPhones]
      },
      "biodata"
    );
  }

  onStateChange(e) {
    if (e.target.value === "0") return;
    const { states } = this.props;
    const selectedState = e.target.value;
    const state = states.find(state => {
      return state.state === selectedState;
    });

    this.props.staffData(
      {
        staffDataKey: "biodata",
        staffKey: "stateOfOrigin",
        staffValue: selectedState
      },
      "biodata"
    );
    this.props.staffData(
      {
        staffDataKey: "biodata",
        staffKey: "lga",
        staffValue: state && state.lga
      },
      "biodata"
    );
  }

  render() {
    const TEMPLATE = "xxx-xxxx-xxxx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    const {
      states,
      loading,
      staff: {
        biodata: {
          firstName,
          title,
          middleName,
          surname,
          stateOfOrigin,
          phone,
          sex,
          maritalStatus,
          dob,
          lga,
          selectedLga,
          address
        }
      }
    } = this.props;
    // const { lga, phoneArray } = this.state;
    return (
      <BiodataComponentStyles>
        <Row>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <select
                className="form-control"
                name="title"
                value={title || ""}
                onChange={this.onChange}
              >
                <option value="0">select title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
                <option value="Prof">Professor</option>
              </select>
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <ControlLabel>Firstname</ControlLabel>
              <input
                type="text"
                name="firstName"
                value={firstName || ""}
                onChange={this.onChange}
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Middle Name</ControlLabel>
              <input
                type="text"
                name="middleName"
                value={middleName || ""}
                onChange={this.onChange}
                className="form-control"
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <ControlLabel>Surname</ControlLabel>
              <input
                type="text"
                name="surname"
                value={surname || ""}
                onChange={this.onChange}
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>State of origin</ControlLabel>
              <select
                className="form-control"
                name="stateOfOrigin"
                value={stateOfOrigin || ""}
                onChange={this.onStateChange}
              >
                <option value="0">select state</option>
                {loading ? (
                  <option>loading......</option>
                ) : (
                  states.map(({ _id, state }) => {
                    return <option key={_id}>{state}</option>;
                  })
                )}
              </select>
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <ControlLabel>Local government of origin </ControlLabel>
              <select
                className="form-control"
                name="selectedLga"
                value={selectedLga || ""}
                onChange={this.onChange}
              >
                <option value="0">select lga</option>
                {lga &&
                  lga.length &&
                  lga.map(local => {
                    return <option key={local}>{local}</option>;
                  })}
              </select>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Sex</ControlLabel>
              <select
                className="form-control"
                name="sex"
                value={sex || ""}
                onChange={this.onChange}
              >
                <option value="0">select sex</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <ControlLabel>Marital Status</ControlLabel>
              <select
                className="form-control"
                name="maritalStatus"
                value={maritalStatus || ""}
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
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <div>
              {phone && phone.length ? (
                <div>
                  <p>
                    <b>Phone numbers</b>
                  </p>
                  {phone.map((ph, index) => {
                    return (
                      <p
                        className="phone"
                        key={index}
                        onClick={e => this.removePhoneNumber(e, index)}
                      >
                        {AddSlashToPhoneNumber(ph)}
                      </p>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <FormGroup>
              <ControlLabel>Phone</ControlLabel>
              <ReactInput
                value={this.state.phoneNumber}
                onChange={value => this.handlePhoneNumberChange(value)}
                className="form-control"
                parse={parse}
                format={format}
                placeholder="000-0000-0000"
              />
            </FormGroup>

            <Button bsSize="xsmall" onClick={this.savePhoneNumber}>
              +
            </Button>
          </Col>

          <Col md={6}>
            <FormGroup>
              <ControlLabel>Date of Birth</ControlLabel>
              <DatePicker
                selected={(dob && moment(dob)) || this.state.dob}
                onChange={this.handleDobChange}
                className="form-control"
                placeholderText="date of birth"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Address</ControlLabel>
              <textarea
                type="text"
                name="address"
                value={address || ""}
                onChange={this.onChange}
                className="form-control"
                rows="7"
              />
            </FormGroup>
          </Col>
        </Row>
      </BiodataComponentStyles>
    );
  }
}

export default (BiodataComponentContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("nigeriastates.getallStates");
  }

  return {
    loading: subscription && !subscription.ready(),
    //staff: StaffMembers.find(staffId).fetch(),
    states: NigeriaStates.find({}).fetch()
  };
})(BiodataComponent));
