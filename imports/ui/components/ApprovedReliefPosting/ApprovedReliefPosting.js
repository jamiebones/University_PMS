import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Table } from "react-bootstrap";
import autoBind from "react-autobind";
import { base64ToBlob } from "../../../modules/base64-to-blob.js";
import fileSaver from "file-saver";
import Loading from "../../components/Loading/Loading";
import moment from "moment";

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
      postings: []
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
    target.innerHTML = "<em>Downloading...</em>";
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
          alert(err);
          target.innerText = "Print List";
          target.removeAttribute("disabled");
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
                  <p className="lead">Relief Posting List</p>
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
                              _id
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
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div>
                  <p className="lead text-info">
                    No approved relief posting list
                  </p>
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
