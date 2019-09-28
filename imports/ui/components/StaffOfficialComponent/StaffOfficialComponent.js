import React from "react";
import styled from "styled-components";
import { Row, Col, FormGroup, ControlLabel } from "react-bootstrap";
import autoBind from "react-autobind";
import { withTracker } from "meteor/react-meteor-data";
import DroplistComponent from "../../components/DropListComponentModified/DropListComponentModified";
import Loading from "../../components/Loading/Loading";
import DatePicker from "react-datepicker";
import { templateParser, templateFormatter, parseDigit } from "input-format";
import { ReactInput } from "input-format";
import { _ } from "meteor/underscore";
import { UniversityUnits } from "../../../api/UniversityUnit/UniversityUnitClass";
import { Cadres } from "../../../api/Cadre/CadreClass";
import { ReturnArrayOfDesignation } from "../../../modules/utilities";
import moment from "moment";

const StaffOfficialComponentStyles = styled.div`
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

class StaffOfficialComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateOfFirstAppointment: moment(new Date()),
      dateOfUniversityAppointment: moment(new Date()),
      designations: [],
      selectedDesignation: "",
      selectedUnit: "",
      salaryLevel: "",
      step: ""
    };
    autoBind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.designations.length) {
      const staffDesignations = ReturnArrayOfDesignation(props.cadres || [])();
      return {
        designations: staffDesignations,
        selectedDesignation: props.selectedDesignation,
        selectedUnit: props.selectedUnit
      };
    }

    return {
      ...state
    };
  }

  onChange(e) {
    if (e === "0") return;
    this.props.staffData(
      {
        staffDataKey: "official",
        staffKey: e.target.name,
        staffValue: e.target.value
      },
      "official"
    );
  }

  handleDateofFirstAppointmentChange(date) {
    this.setState({ dateOfFirstAppointment: date });
    this.props.staffData(
      {
        staffDataKey: "official",
        staffKey: "dateOfFirstAppointment",
        staffValue: date
      },
      "official"
    );
  }

  handleDateofAppointmentInUniversity(date) {
    this.setState({ dateOfUniversityAppointment: date });
    this.props.staffData(
      {
        staffDataKey: "official",
        staffKey: "dateOfUniversityAppointment",
        staffValue: date
      },
      "official"
    );
  }

  setSelectedDesignation(designation) {
    this.setState({ selectedDesignation: designation });
    this.props.staffData(
      {
        staffDataKey: "official",
        staffKey: "designation",
        staffValue: designation
      },
      "official"
    );
  }

  setSelectedUnit(unit) {
    this.setState({ selectedUnit: unit });
    this.props.staffData(
      {
        staffDataKey: "official",
        staffKey: "department",
        staffValue: unit
      },
      "official"
    );
  }

  handleStepChange(value) {
    this.setState({ stepState: value }, () => {
      this.props.staffData(
        {
          staffDataKey: "official",
          staffKey: "step",
          staffValue: value
        },
        "official"
      );
    });
  }

  handleSalaryLevelChange(value) {
    this.setState({ salaryLevelState: value }, () => {
      this.props.staffData(
        {
          staffDataKey: "official",
          staffKey: "salaryLevel",
          staffValue: value
        },
        "official"
      );
    });
  }

  render() {
    const TEMPLATE = "xx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    const {
      loading,
      universityUnits,
      staff: {
        official: {
          dateOfFirstAppointment,
          dateOfUniversityAppointment,
          staffId,
          staffType,
          staffClass,
          employmentType,
          designation,
          department,
          step,
          salaryLevel,
          salaryScale
        }
      }
    } = this.props;

    const { designations, salaryLevelState, stepState } = this.state;

    return (
      <StaffOfficialComponentStyles>
        {!loading ? (
          <div>
            <Row>
              <Col md={12}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>Date of first appointment</ControlLabel>
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        selected={
                          (dateOfFirstAppointment &&
                            moment(dateOfFirstAppointment)) ||
                          this.state.dateOfFirstAppointment
                        }
                        onChange={this.handleDateofFirstAppointmentChange}
                        className="form-control"
                        placeholderText="date of first appointment"
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>
                        Date of appointment in the University
                      </ControlLabel>
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        selected={
                          (dateOfUniversityAppointment &&
                            moment(dateOfUniversityAppointment)) ||
                          this.state.dateOfUniversityAppointment
                        }
                        onChange={this.handleDateofAppointmentInUniversity}
                        className="form-control"
                        placeholderText="date of appointment in the University"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <DroplistComponent
                        data={designations}
                        field="rank"
                        label="Designation on appointment"
                        placeholder="Select designation......"
                        setValue={this.setSelectedDesignation}
                        prevSelectedData={designation}
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <DroplistComponent
                        data={universityUnits}
                        field="name"
                        label="Department on appointment"
                        placeholder="Select department"
                        setValue={this.setSelectedUnit}
                        prevSelectedData={department}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>Staff ID</ControlLabel>
                      <input
                        type="text"
                        name="staffId"
                        value={staffId || ""}
                        onChange={this.onChange}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>Staff type</ControlLabel>
                      <select
                        className="form-control"
                        name="staffType"
                        value={staffType || ""}
                        onChange={this.onChange}
                      >
                        <option value="0">select staff type</option>
                        <option value="1">Teaching staff</option>
                        <option value="2">Non Teaching staff</option>
                      </select>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>Staff Class</ControlLabel>
                      <select
                        className="form-control"
                        name="staffClass"
                        value={staffClass || ""}
                        onChange={this.onChange}
                      >
                        <option value="0">select staff type</option>
                        <option value="1">Senior staff</option>
                        <option value="2">Junior staff</option>
                      </select>
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>Employment Type</ControlLabel>
                      <select
                        className="form-control"
                        name="employmentType"
                        value={employmentType || ""}
                        onChange={this.onChange}
                      >
                        <option value="0">select employment type</option>
                        <option value="active">pensionable</option>
                        <option value="contract">contract</option>
                        <option value="part-time">part-time</option>
                        <option value="casual">casual</option>
                      </select>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <ControlLabel>Salary Scale </ControlLabel>
                      <select
                        className="form-control"
                        name="salaryScale"
                        value={salaryScale || ""}
                        onChange={this.onChange}
                      >
                        <option value="0">select salary scale</option>
                        <option value="CONTISS">CONTISS</option>
                        <option value="CONMESS">CONMESS</option>
                        <option value="CONUAS">CONUAS</option>
                      </select>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <ControlLabel>Level</ControlLabel>

                      <ReactInput
                        value={salaryLevel}
                        onChange={value => this.handleSalaryLevelChange(value)}
                        className="form-control"
                        parse={parse}
                        format={format}
                        placeholder="00"
                      />
                    </FormGroup>
                  </Col>

                  <Col md={2}>
                    <FormGroup>
                      <ControlLabel>Step</ControlLabel>

                      <ReactInput
                        value={step}
                        onChange={value => this.handleStepChange(value)}
                        className="form-control"
                        parse={parse}
                        format={format}
                        placeholder="00"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        ) : (
          <Loading />
        )}
      </StaffOfficialComponentStyles>
    );
  }
}

export default StaffOfficialComponentContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("cadres.getcadresandUniversityUnit");
  }

  return {
    loading: subscription && !subscription.ready(),
    cadres: Cadres.find().fetch(),
    universityUnits: UniversityUnits.find().fetch()
  };
})(StaffOfficialComponent);
