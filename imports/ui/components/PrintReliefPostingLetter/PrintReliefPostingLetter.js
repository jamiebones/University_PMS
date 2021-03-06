/*eslint-disable*/

import React from "react";
import { Meteor } from "meteor/meteor";
import InlineCss from "react-inline-css";
import moment from "moment";

const ReliefPostingLetterPrinting = ({
  reference,
  staffTitle,
  reliever_designation,
  reliever_staffName,
  staff_relivedDepartment,
  reliefStart,
  reliefEnd,
  directorName,
  unitHead,
  faculty,
  dept
}) => (
  <InlineCss
    stylesheet={`

   .container-fluid {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }
  .row {
    margin-right: -15px;
    margin-left: -15px;
  }
    .container:before,
    .container:after,
    .container-fluid:before,
    .container-fluid:after,
    .row:before,
    .row:after,
    {
    display: table;
    content: " ";
    }


    .container:after,
    .container-fluid:after,
    .row:after,
    {
    clear: both;
    }
    .center-block {
    display: block;
    margin-right: auto;
    margin-left: auto;
    }
    .pull-right {
    float: right !important;
    }
    .pull-left {
    float: left !important;
    }

    .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
        position: relative;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }
    .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
        float: left;
    }
    .col-xs-12 {
        width: 100%;
    }
    .col-xs-11 {
        width: 91.66666667%;
    }
    .col-xs-10 {
        width: 83.33333333%;
    }
    .col-xs-9 {
        width: 75%;
    }
    .col-xs-8 {
        width: 66.66666667%;
    }
    .col-xs-7 {
        width: 58.33333333%;
    }
    .col-xs-6 {
        width: 50%;
    }
    .col-xs-5 {
        width: 41.66666667%;
    }
    .col-xs-4 {
        width: 33.33333333%;
    }
    .col-xs-3 {
        width: 25%;
    }
    .col-xs-2 {
        width: 16.66666667%;
    }
    .col-xs-1 {
        width: 8.33333333%;
    }
    .col-xs-pull-12 {
        right: 100%;
    }
    .col-xs-pull-11 {
        right: 91.66666667%;
    }
    .col-xs-pull-10 {
        right: 83.33333333%;
    }
    .col-xs-pull-9 {
        right: 75%;
    }
    .col-xs-pull-8 {
        right: 66.66666667%;
    }
    .col-xs-pull-7 {
        right: 58.33333333%;
    }
    .col-xs-pull-6 {
        right: 50%;
    }
    .col-xs-pull-5 {
        right: 41.66666667%;
    }
    .col-xs-pull-4 {
        right: 33.33333333%;
    }
    .col-xs-pull-3 {
        right: 25%;
    }
    .col-xs-pull-2 {
        right: 16.66666667%;
    }
    .col-xs-pull-1 {
        right: 8.33333333%;
    }
    .col-xs-pull-0 {
        right: auto;
    }
    .col-xs-push-12 {
        left: 100%;
    }
    .col-xs-push-11 {
        left: 91.66666667%;
    }
    .col-xs-push-10 {
        left: 83.33333333%;
    }
    .col-xs-push-9 {
        left: 75%;
    }
    .col-xs-push-8 {
        left: 66.66666667%;
    }
    .col-xs-push-7 {
        left: 58.33333333%;
    }
    .col-xs-push-6 {
        left: 50%;
    }
    .col-xs-push-5 {
        left: 41.66666667%;
    }
    .col-xs-push-4 {
        left: 33.33333333%;
    }
    .col-xs-push-3 {
        left: 25%;
    }
    .col-xs-push-2 {
        left: 16.66666667%;
    }
    .col-xs-push-1 {
        left: 8.33333333%;
    }
    .col-xs-push-0 {
        left: auto;
    }
    .col-xs-offset-12 {
        margin-left: 100%;
    }
    .col-xs-offset-11 {
        margin-left: 91.66666667%;
    }
    .col-xs-offset-10 {
        margin-left: 83.33333333%;
    }
    .col-xs-offset-9 {
        margin-left: 75%;
    }
    .col-xs-offset-8 {
        margin-left: 66.66666667%;
    }
    .col-xs-offset-7 {
        margin-left: 58.33333333%;
    }
    .col-xs-offset-6 {
        margin-left: 50%;
    }
    .col-xs-offset-5 {
        margin-left: 41.66666667%;
    }
    .col-xs-offset-4 {
        margin-left: 33.33333333%;
    }
    .col-xs-offset-3 {
        margin-left: 25%;
    }
    .col-xs-offset-2 {
        margin-left: 16.66666667%;
    }
    .col-xs-offset-1 {
        margin-left: 8.33333333%;
    }
    .col-xs-offset-0 {
        margin-left: 0;
    }
    
    .identifier{
        font-size: 16px;
    }
    
    .text-left {
        text-align: left;
    }
    .text-right {
        text-align: right;
    }
    .text-center {
        text-align: center;
    }
    .text-justify {
        text-align: justify;
    }
    .text-nowrap {
        white-space: nowrap;
    }
    .text-lowercase {
        text-transform: lowercase;
    }
    .text-uppercase {
        text-transform: uppercase;
    }
    .text-capitalize {
        text-transform: capitalize;
    }
    .text-muted {
        color: #777;
    }
    .text-primary {
        color: #337ab7;
    }
    a.text-primary:hover,
    a.text-primary:focus {
        color: #286090;
    }
    .text-success {
        color: #3c763d;
    }
    a.text-success:hover,
    a.text-success:focus {
        color: #2b542c;
    }
    .text-info {
        color: #31708f;
    }
    a.text-info:hover,
    a.text-info:focus {
        color: #245269;
    }
    .text-warning {
        color: #8a6d3b;
    }
    a.text-warning:hover,
    a.text-warning:focus {
        color: #66512c;
    }
    .text-danger {
        color: #a94442;
    }
    a.text-danger:hover,
    a.text-danger:focus {
        color: #843534;
    }

    .bodySection{
        margin-top: 120px;
      }


    * {
        box-sizing: border-box;
    }

    html{
    zoom: 0.85;
    }

  @page {
    margin-top: 2cm;
    margin-bottom: 2cm;
    margin-left: 2cm;
    margin-right: 2cm;
    }

    .signature{
        margin-top: 90px;
        span{
          font-size: 19px;
        }
    }

    .bodySection{
        margin-top: 120px;
      }
  
    .referenceP{
        margin-top: 30px;
        margin-bottom: 50px;
    }
  
    .pBody{
        line-height: 9px;
      }

    body{
        font-size: 19px;
        font-family: Arial, Helvetica, sans-serif;
        color: #000;
    }
  
  .lead{
      font-size: 21px;
  }
  
  
`}
  >
    <div className="container-fluid bodySection">
      <div className="row">
        <div className="col-xs-12">
          <p className="referenceP">
            {reference}
            <span className="pull-right">
              {moment(new Date()).format("MMMM DD YYYY")}
            </span>
          </p>

          <p className="pBody">
            {staffTitle}. {reliever_staffName}
          </p>

          <p className="pBody">({reliever_designation})</p>
          <p className="pBody">{dept}</p>
          <p className="pBody">{faculty}</p>

          <p className="pBody">University of Uyo</p>
          <p className="pBody">Uyo</p>
          <br />
          <p className="lead">
            <b>NOTICE OF POSTING ON RELIEF</b>
          </p>

          <p>
            This is to inform you that approval has been given for your posting
            from the {dept}, {faculty} to the {staff_relivedDepartment}
          </p>

          <p>
            This posting takes effect from{" "}
            <b>{moment(reliefStart).format("dddd, MMMM Do YYYY")}</b>
          </p>

          <p>
            You are to report to the {unitHead} for the day-to-day assignment of
            duties.
          </p>

          <p>
            You should return to your office, {dept}, {faculty} on{" "}
            <b>{moment(reliefEnd).format("dddd, MMMM Do YYYY")}</b>
          </p>

          <p className="signature">
            <b>{directorName}</b> <br />
            <span>Director, Human Resources.</span>
          </p>
        </div>
      </div>
    </div>
  </InlineCss>
);

ReliefPostingLetterPrinting.propTypes = {};

export default ReliefPostingLetterPrinting;
