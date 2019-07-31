import React from "react";
import styled from "styled-components";
import { Row, Col, Button, Alert } from "react-bootstrap";
import autoBind from "react-autobind";
import {
  GetRealValue,
  AddSlashToPhoneNumber
} from "../../../modules/utilities";
import { _ } from "meteor/underscore";
import moment from "moment";
import { Bert } from "meteor/themeteorchef:bert";
import { Staff } from "../../../modules/classes/staff";

const PreviewStaffDataStyles = styled.div`
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
  .biodata {
    background-color: #fff;
    color: #000;
    padding: 10px;
    margin-bottom: 10px;
  }
  .official {
    background-color: #fff;
    color: #000;
    padding: 10px;
    margin-bottom: 10px;
  }
  .certificate {
    background-color: #fff;
    color: #000;
    padding: 10px;
    margin-bottom: 10px;
  }

  p {
    font-size: 15px;
  }

  span {
    margin-left: 10px;
    font-size: 14px;
    font-style: italic;
    color: #3c2e0d;
  }
  .heading {
    font-size: 17px;
    color: green;
    font-weight: bold;
  }
`;

class PreviewStaffData extends React.Component {
  constructor(props) {
    super(props);
    this.state = { submitted: false, show: false, errorMessage: [] };
    autoBind(this);
  }

  clearData() {
    const confirmClear = confirm(
      "Are you sure you want to clear previous entered data"
    );
    if (!confirmClear) return;
    this.props.clearData();
    Bert.alert("Data cleared", "success");
  }

  saveNewStaffData() {
    const { staff } = this.props;
    //console.log(staff);
    const newStaff = new Staff(staff);
    newStaff.saveStaff((error, staffData) => {
      if (staffData) {
        //call the server here
        //validation succeds here
        Meteor.call(
          "staffmembers.insertnewstaff",
          staffData,
          (error, response) => {
            if (response) {
              Bert.alert(
                "new staff details inserted into the database",
                "success"
              );
              this.props.clearData();
            } else {
              Bert.alert(`${error}`, "danger");
            }
          }
        );
      } else {
        if (typeof error == "object") {
          let message = [];
          for (let err in error) {
            if (!_.isEmpty(err)) {
              message.push(error[err]);
            }
          }
          return this.setState({ show: true, errorMessage: message });
        }
        return this.setState({ show: true, errorMessage: [error] });
      }
    });
  }

  handleDismiss() {
    this.setState({ show: false });
  }

  render() {
    const {
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
        },
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
          selectedLga,
          address
        },
        qualifications: { certificates }
      }
    } = this.props;
    const { submitted, errorMessage, show } = this.state;

    return (
      <PreviewStaffDataStyles>
        <div className="biodata">
          <Row>
            <Col md={6} mdOffset={3}>
              {show && errorMessage.length > 0 && (
                <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                  <h4>Oh Error! Correct the below error!</h4>
                  {errorMessage.length > 0 &&
                    errorMessage.map((message, index) => {
                      return <p key={index}>{message}</p>;
                    })}
                </Alert>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p className="text-center heading">Biodata</p>
              <p>
                Title <span>{title}</span>
              </p>

              <p>
                Name :{" "}
                <span>
                  {firstName} {middleName} {surname}
                </span>
              </p>

              <p>
                Sex : <span>{sex}</span>
              </p>

              <p>
                Marital Status :{" "}
                <span>{GetRealValue(maritalStatus && maritalStatus)}</span>
              </p>

              <p>
                State : <span>{stateOfOrigin}</span>
              </p>

              <p>
                LGA : <span>{selectedLga}</span>
              </p>

              <p>
                Date of birth :{" "}
                <span>{moment(dob && dob).format("MMMM DD YYYY")}</span>
              </p>

              <p>
                Phone numbers
                {phone &&
                  phone.length &&
                  phone.map((ph, index) => {
                    return (
                      <span key={index}>
                        {AddSlashToPhoneNumber(ph)} &nbsp;&nbsp;
                      </span>
                    );
                  })}
              </p>

              <p>
                Address: <span>{address}</span>
              </p>
            </Col>

            <Col md={6}>
              <p className="text-center heading">Certificates</p>
              <p>
                Certificates
                {certificates &&
                  certificates.length &&
                  certificates.map(({ cert, date }, index) => {
                    return (
                      <React.Fragment>
                        <span key={index}>
                          {cert} : {date}
                        </span>
                        <br />
                      </React.Fragment>
                    );
                  })}
              </p>
            </Col>
          </Row>
        </div>

        <div className="official">
          <Row>
            <Col md={12}>
              <p>
                Date of first appointment{" "}
                <span>
                  {moment(dateOfFirstAppointment).format("MMMM DD YYYY")}
                </span>
              </p>

              <p>
                Date of appointment in the university
                <span>
                  {moment(dateOfUniversityAppointment).format("MMMM DD YYYY")}
                </span>
              </p>

              <p>
                Staff Id : <span>{staffId}</span>
              </p>

              <p>
                Staff Type : <span>{GetRealValue(staffType)}</span>
              </p>

              <p>
                Staff Class :{" "}
                <span>
                  {staffClass !== "" && staffClass == "1"
                    ? "Senior Staff"
                    : "Junior Staff"}
                </span>
              </p>

              <p>
                Employment Type: <span>{GetRealValue(employmentType)}</span>
              </p>

              <p>
                Designation : <span>{designation}</span>
              </p>

              <p>
                Department : <span>{department}</span>
              </p>

              <p>
                Salary Scale:{" "}
                <span>
                  {salaryScale} {salaryLevel}/{step}
                </span>
              </p>

              <div className="pull-left">
                {!_.isEmpty(this.props.staff) ? (
                  <Button
                    bsStyle="success"
                    disabled={submitted}
                    onClick={this.saveNewStaffData}
                  >
                    {!submitted ? "Save details" : "Please wait....."}
                  </Button>
                ) : null}
              </div>

              <div className="pull-right">
                {!_.isEmpty(this.props.staff) ? (
                  <Button onClick={this.clearData}>Clear data</Button>
                ) : null}
              </div>
            </Col>
          </Row>
        </div>
      </PreviewStaffDataStyles>
    );
  }
}

export default PreviewStaffData;
