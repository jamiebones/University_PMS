import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Alert, Label, Col, Row, Table } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import TextField from "../../components/Common/TextFieldGroup";
import { Link } from "react-router-dom";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import { SheetToArray } from "../../../modules/utilities";

const NonTeachingAppraisalUploadStyle = styled.div`
  .alertDiv {
    margin-top: 20px;
    p {
      font-style: italic;
      color: #000;
    }
  }
  .NonTeachingAppraisalUploadDiv {
    margin-top: 30px;
  }
  .divSearchArea {
    border: 2px solid;
    background: #337547;
    padding: 30px;
  }
  .lead {
    color: #af2222;
  }
`;

class NonTeachingAppraisalUploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    };
    autoBind(this);
  }

  onChange(e) {
    const src = document.getElementById("fileUpload");
    this.readExcel(src, this.callMeBack);
  }

  readExcel(src, callback) {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const wb = XLSX.read(fileReader.result, { type: "binary" });
      const workBookName = wb.SheetNames[0];
      const excel = wb.Sheets[workBookName];
      callback(excel);
    };
    fileReader.readAsBinaryString(src.files[0]);
  }

  callMeBack(excel) {
    const excelData = SheetToArray(excel);
    Meteor.call(
      "apcappraisal.uploadAppraisal",
      excelData,
      (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log(response);
        }
      }
    );
  }

  render() {
    return (
      <NonTeachingAppraisalUploadStyle>
        <Row>
          <Col md={6} mdOffset={2}>
            <div className="divSearchArea">
              <input type="file" id="fileUpload" onChange={this.onChange} />
            </div>

            <div className="messageArea">
              <p>hello</p>
            </div>
          </Col>
        </Row>
      </NonTeachingAppraisalUploadStyle>
    );
  }
}

export default NonTeachingAppraisalUploadPage;
