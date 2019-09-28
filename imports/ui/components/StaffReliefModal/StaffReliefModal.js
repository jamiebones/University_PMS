import React from "react";
import {
  Row,
  Col,
  Modal,
  Button,
  FormGroup,
  ControlLabel
} from "react-bootstrap";
import styled from "styled-components";
import autoBind from "react-autobind";
import DatePicker from "react-datepicker";
import { Meteor } from "meteor/meteor";
import moment from "moment";
import { Bert } from "meteor/themeteorchef:bert";

const StaffReliefModalStyle = styled.div`
  .react-datepicker {
    font-size: 1rem;
  }
`;

class StaffReliefModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
      endDate: moment(),
      submitted: false
    };
    autoBind(this);
  }

  savePostingRelief() {
    //let assemble what we are
    //sending to space
    //construct the relief object
    const reliefStaff = this.props.reliever;
    //reliefStaff means idiot going on relief
    const otherStaff = this.props.person;
    //other staff means sucker taking a break from work

    const reliefObject = {
      reliever_staffId: reliefStaff.staffId,
      reliever_designation: reliefStaff.designation,
      reliever_department: reliefStaff.currentPosting,
      reliever_staffName: `${reliefStaff.biodata.firstName} ${reliefStaff.biodata.middleName} ${reliefStaff.biodata.surname}`,
      staff_relivedStaffId: otherStaff.staffId,
      staff_relivedName: `${otherStaff.biodata.firstName} ${otherStaff.biodata.middleName} ${otherStaff.biodata.surname}`,
      staff_relivedDesignation: otherStaff.designation,
      staff_relivedDepartment: otherStaff.currentPosting,
      reliefStart: moment(this.state.startDate).toISOString(),
      reliefEnd: moment(this.state.endDate).toISOString(),
      reliefDepartment: otherStaff.currentPosting,
      status: "pending"
    };

    const confirmIntent = confirm(
      `start date: ${moment(this.state.startDate).format(
        "MMMM DD YYYY"
      )} to end date: ${moment(this.state.endDate).format("MMMM DD YYYY")}`
    );

    if (!confirmIntent) {
      return;
    }

    Meteor.call(
      "staffreliefposting.savenewRefliefPosting",
      reliefObject,
      err => {
        if (!err) {
          this.setState({ submitted: !this.state.submitted });
          Bert.alert("successful", "success");
          this.props.onHide();
        } else {
          Bert.alert("failed to set relief posting date", "danger");
          this.props.onHide();
        }
      }
    );
  }

  handleStartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    this.setState({ endDate: date });
  }

  render() {
    const { show, onHide, person, reliever } = this.props;
    const { submitted } = this.state;

    return (
      <StaffReliefModalStyle>
        <Row>
          <Col md={12} lg={12}>
            <Modal show={show} onHide={onHide}>
              <Modal.Header closeButton>
                <Modal.Title>
                  <p className="text-center">
                    Propose posting {reliever && reliever.biodata.firstName}{" "}
                    {reliever && reliever.biodata.middleName}{" "}
                    {reliever && reliever.biodata.surname} ,{" "}
                    {reliever.designation} on relief duty for{" "}
                    {person && person.biodata.firstName}{" "}
                    {person && person.biodata.middleName}{" "}
                    {person && person.biodata.surname},{" "}
                    {person && person.designation}
                  </p>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FormGroup>
                  <ControlLabel>Relief Start Date</ControlLabel>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={this.state.startDate}
                    onChange={this.handleStartDateChange}
                    minDate={new Date()}
                    className="form-control"
                    placeholderText="Select date relief duty starts"
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Relief End Date</ControlLabel>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={this.state.endDate}
                    onChange={this.handleEndDateChange}
                    minDate={new Date()}
                    className="form-control"
                    placeholderText="Select date relief duty ends"
                  />
                </FormGroup>

                <Button
                  bsStyle="info"
                  disabled={submitted}
                  onClick={this.savePostingRelief}
                >
                  {!submitted ? "Save Relief Posting" : "please wait......"}
                </Button>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </StaffReliefModalStyle>
    );
  }
}

export default StaffReliefModal;
