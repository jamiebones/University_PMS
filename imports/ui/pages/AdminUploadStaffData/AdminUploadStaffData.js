/* eslint-disable */
import React from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";
import autoBind from "react-autobind";
import * as XLSX from "xlsx";
import { _ } from "meteor/underscore";

const AdminUploadStaffDataStyles = styled.div`
  .uploadDiv {
    margin-top: 90px;
  }
  .errorDiv {
    p {
      color: red;
    }
  }
  .msg {
    width: 50%;
  }
`;

class AdminUploadStaffData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      error: ""
    };
    autoBind(this);
  }

  SheettoArray(sheet) {
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet["!ref"]);
    console.dir(range);
    for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      row = [];
      for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        var nextCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
        if (typeof nextCell === "undefined") {
          row.push(void 0);
        } else row.push(nextCell.w);
      }
      result.push(row);
    }
    return result;
  }

  readExcel(src, callback, self) {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const wb = XLSX.read(fileReader.result, { type: "binary" });
      const workBookName = wb.SheetNames[0];
      const excel = wb.Sheets[workBookName];
      callback(excel, self);
    };
    fileReader.readAsBinaryString(src.files[0]);
  }

  callMeBack(excel, self) {
    const excelData = this.SheettoArray(excel);
    console.log(excelData);
    Meteor.call(
      "staffMembers.saveRecordsInDatabase",
      excelData,
      (error, response) => {
        if (error) {
          self.setState({ uploading: false, error });
          document.getElementById("input").value = "";
        } else {
          self.setState({ uploading: false });
          document.getElementById("input").value = "";
        }
      }
    );
  }

  change(e) {
    //self is the context in which the onchange was called
    const src = document.getElementById("input");
    let self = this;
    this.setState({ uploading: true });
    this.readExcel(src, this.callMeBack, self);
  }

  render() {
    return (
      <AdminUploadStaffDataStyles>
        <Row>
          <Col md={6} mdOffset={3}>
            <div className="uploadDiv">
              <div className="errorDiv">
                {this.state.error ? <p>{error}</p> : null}
              </div>
              {this.state.uploading ? (
                <Alert className="msg">
                  <p>Uploading data to the database please wait............</p>
                </Alert>
              ) : null}
              <input
                type="file"
                id="input"
                disabled={this.state.uploading}
                onChange={this.change}
              />
            </div>
          </Col>
        </Row>
      </AdminUploadStaffDataStyles>
    );
  }
}

export default AdminUploadStaffData;
