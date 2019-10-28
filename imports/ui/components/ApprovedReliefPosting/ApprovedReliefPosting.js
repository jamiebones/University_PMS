import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Table, Alert } from "react-bootstrap";
import autoBind from "react-autobind";
import { base64ToBlob } from "../../../modules/base64-to-blob.js";
import fileSaver from "file-saver";
import Loading from "../../components/Loading/Loading";
import moment from "moment";
import { SplitFacultDept } from "../../../modules/utilities";
import { Bert } from "meteor/themeteorchef:bert";

const ApprovedReliefPostingStyles = styled.div`
  .formerDept {
    padding: 5px;
  }
  span {
    padding: 5px;
    margin: 5px;
    font-style: italic;
    color: darkolivegreen;
  }
`;

class ApprovedReliefPosting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postings: [],
      personnelDirector: ""
    };
    autoBind(this);
  }

  componentDidMount() {
    if (this.state.postings.length == 0) {
      Meteor.call("staffreliefposting.getApprovedPosting", (err, res) => {
        if (!err) {
          this.setState({ postings: res });
        }
        console.log(err);
      });
    }
  }

  downloadPDF(event, postings) {
    event.preventDefault();
    const { target } = event;
    target.innerHTML = "<em>downloading...</em>";
    target.setAttribute("disabled", "disabled");
    Meteor.call(
      "staffreliefposting.printpdflist",
      postings,
      (err, response) => {
        if (!err) {
          const blob = base64ToBlob(response);
          fileSaver.saveAs(blob, "relief_postings_list.pdf");
          target.innerText = "Print List";
          target.removeAttribute("disabled");
        } else {
          target.innerText = "Print List";
          target.removeAttribute("disabled");
        }
      }
    );
  }

  printReliefPostingLetter(
    event,
    {
      reliever_staffId,
      _id,
      reliever_designation,
      reliever_department,
      reliever_staffName,
      staff_relivedDepartment,
      reliefStart,
      reliefEnd
    }
  ) {
    event.preventDefault();
    const { target } = event;
    target.innerHTML = "<em>downloading...</em>";
    target.setAttribute("disabled", "disabled");
    const { personnelDirector } = this.state;
    const promtReportTo = prompt(
      "Who to report to : Example Head, Senate Unit "
    );

    const getFaculty = SplitFacultDept(reliever_department);
    const faculty = getFaculty.faculty;
    const dept = getFaculty.dept;

    const staffTitle = prompt("Staff title:  ");

    let directorName = "";
    if (personnelDirector == "") {
      directorName = prompt("Director of Personnel Name:  ");
    }

    if (!promtReportTo) {
      return;
    }
    if (!staffTitle) return;
    if (!directorName) return;

    //lets view what we are sending to create the letter

    const data = `Staff title : ${staffTitle}
                  Reporting to : ${promtReportTo}
                  Director of Personnel name: ${directorName}`;

    const confirmData = confirm(data);

    if (!confirmData) {
      target.innerText = "print relief posting letter";
      target.removeAttribute("disabled");
      return;
    }

    const reliefObject = {
      staffId: reliever_staffId,
      id: _id,
      reliever_designation,
      reliever_department,
      reliever_staffName,
      staff_relivedDepartment,
      reliefStart,
      reliefEnd,
      unitHead: promtReportTo,
      faculty,
      dept,
      staffTitle,
      directorName
    };
    Meteor.call(
      "staffReliefPosting.printReliefPostingLetter",
      reliefObject,
      (err, response) => {
        if (!err) {
          const blob = base64ToBlob(response);
          fileSaver.saveAs(blob, "relief_postings_letter.pdf");
          target.innerText = "print relief posting letter";
          target.removeAttribute("disabled");
        } else {
          target.innerText = "print relief posting letter";
          target.removeAttribute("disabled");
          Bert.alert(err, "danger");
        }
      }
    );
  }

  render() {
    const { loading } = this.props;
    const { postings } = this.state;

    return (
      <ApprovedReliefPostingStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              postings && postings.length ? (
                <div>
                  <p className="lead text-center">Relief Posting List</p>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Name</th>
                        <th>Relieving</th>
                        <th>Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {postings &&
                        postings.map(
                          (
                            {
                              reliever_staffId,
                              reliever_designation,
                              reliever_department,
                              reliever_staffName,
                              staff_relivedStaffId,
                              staff_relivedName,
                              staff_relivedDesignation,
                              staff_relivedDepartment,
                              reliefStart,
                              reliefEnd,
                              _id,
                              letterRef
                            },
                            index
                          ) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <p>
                                    <span>{reliever_staffName}</span>
                                    <br />
                                    <span>{reliever_designation}</span>
                                    <br />
                                    <span>{reliever_department}</span>
                                    <br />
                                    <span>{reliever_staffId}</span>
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    <span>{staff_relivedName}</span>
                                    <br />
                                    <span>{staff_relivedDesignation}</span>
                                    <br />
                                    <span>{staff_relivedDepartment}</span>
                                    <br />
                                    <span>{staff_relivedStaffId}</span>
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    <span>
                                      Relief Start :{" "}
                                      {moment(reliefStart).format(
                                        "MMMM DD YYYY"
                                      )}
                                    </span>
                                    <br />
                                    <span>
                                      Relief End:{" "}
                                      {moment(reliefEnd).format("MMMM DD YYYY")}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <div>
                                    {letterRef ? (
                                      <p>
                                        <Button
                                          bsSize="xsmall"
                                          bsStyle="default"
                                        >
                                          reprint letter
                                        </Button>
                                      </p>
                                    ) : (
                                      <p>
                                        <Button
                                          bsSize="xsmall"
                                          onClick={() =>
                                            this.printReliefPostingLetter(
                                              event,
                                              {
                                                reliever_staffId,
                                                _id,
                                                reliever_designation,
                                                reliever_department,
                                                reliever_staffName,
                                                staff_relivedDepartment,
                                                reliefStart,
                                                reliefEnd
                                              }
                                            )
                                          }
                                          bsStyle="success"
                                        >
                                          print relief posting letter
                                        </Button>
                                      </p>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div>
                  <Alert bsStyle="info">
                    <p className="lead text-danger text-center">
                      No approved relief posting list
                    </p>
                  </Alert>
                </div>
              )
            ) : (
              <Loading />
            )}
            {postings && postings.length ? (
              <div className="pull-right">
                <Button
                  className="hidden-print"
                  bsSize="xsmall"
                  onClick={() => this.downloadPDF(event, postings)}
                  bsStyle="success"
                >
                  Print List
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>
      </ApprovedReliefPostingStyles>
    );
  }
}

export default ApprovedReliefPosting;
