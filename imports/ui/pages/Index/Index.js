/* eslint-disable */
import React from "react";
import { Button, Row, Col, Label } from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import SEO from "../../components/SEO/SEO";
import Loading from "../../components/Loading/Loading";
import { withTracker } from "meteor/react-meteor-data";
import styled from "styled-components";
import autoBind from "react-autobind";
import * as XLSX from "xlsx";

class Index extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    Meteor.call("staffposting.getPostingSummary", (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    });
  }

  SheettoArray(sheet) {
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet["!ref"]);
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
    const excelData = this.SheettoArray(excel);
    console.log(excelData);
    Meteor.call("trial", excelData, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    });
  }

  callMeBack2(excel) {
    const excelData = this.SheettoArray(excel);
    Meteor.call("buildUniversityUnit", excelData, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    });
  }

  change(e) {
    const src = document.getElementById("input");
    this.readExcel(src, this.callMeBack);
  }

  change2(e) {
    const src = document.getElementById("input2");
    this.readExcel(src, this.callMeBack2);
  }

  render() {
    return (
      <div>
        <input type="file" id="input" onChange={this.change} />
        <br />
        <h1>Hello Course ware/ Bookshop</h1>
        <br />
        <input type="file" id="input2" onChange={this.change2} />
      </div>
    );
  }
}

export default Index;
