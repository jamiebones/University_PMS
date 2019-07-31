/*eslint-disable */
import React from "react";
import {
  Row,
  Col,
  Button,
  FormGroup,
  ControlLabel,
  Alert
} from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import { Bert } from "meteor/themeteorchef:bert";
import DatePicker from "react-datepicker";
if (Meteor.isClient) import "react-datepicker/dist/react-datepicker.css";
import autoBind from "react-autobind";
import { _ } from "meteor/underscore";
import moment from "moment";
import styled from "styled-components";

const PostingStyles = styled.div`
  .react-datepicker {
    font-size: 1rem;
  }
`;

class PostingDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postingDate: moment(),
      submitted: false
    };
    autoBind(this);
  }

  dateChange(date) {
    this.setState({ postingDate: date });
  }

  saveChanges() {
    const dateOfPosting = moment(this.state.postingDate);
    const staff = this.props.staff;
    const name =
      staff &&
      `${staff.biodata.firstName}${staff.biodata.middleName} ${
        staff.biodata.surname
      }`;

    const postingObj = {
      staffId: staff.staffId,
      staffName: name,
      designation: staff.designation,
      dateOfPosting: dateOfPosting.format(),
      currentPosting: staff.currentPosting
    };

    const confirmDate = confirm(
      `Posting date set to ${dateOfPosting.format("MMMM DD YYYY")}`
    );

    if (!confirmDate) return;

    console.log(postingObj);

    this.setState({ submitted: !this.state.submitted });
    Meteor.call("staffPosting.savePostingDate", postingObj, err => {
      if (!err) {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert("posting date changed successful", "success");
      } else {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert(`There was an error: ${error}`, "danger");
      }
    });
  }

  render() {
    const { currentPosting, biodata, postings } = this.props.staff;
    return (
      <PostingStyles>
        <Row>
          <Col md={12}>
            {postings.length == 0 ? (
              <div>
                <p>
                  Name: {biodata && biodata.firstName}{" "}
                  {biodata && biodata.middleName} {biodata && biodata.surname}
                </p>
                <p>Faculty/Unit: {currentPosting}</p>

                <FormGroup>
                  <ControlLabel>Posting date</ControlLabel>
                  <DatePicker
                    selected={this.state.postingDate}
                    onChange={this.dateChange}
                    className="form-control"
                    placeholderText="posting date"
                  />
                </FormGroup>

                <Button
                  bsStyle="success"
                  disabled={this.state.submitted}
                  onClick={this.saveChanges}
                >
                  {!this.state.submitted
                    ? "Save Changes"
                    : "please wait........"}
                </Button>
              </div>
            ) : (
              <Alert bsStyle="info">
                Posting date already set for {biodata && biodata.firstName}{" "}
                {biodata && biodata.middleName} {biodata && biodata.surname}
              </Alert>
            )}
          </Col>
        </Row>
      </PostingStyles>
    );
  }
}

export default PostingDate;
