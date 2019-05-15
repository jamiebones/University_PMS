import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Table } from "react-bootstrap";
import autoBind from "react-autobind";
import { StaffPostings } from "../../../api/StaffPosting/StaffPostingClass";
import Loading from "../../components/Loading/Loading";
import { base64ToBlob } from "../../../modules/base64-to-blob.js";
import fileSaver from "file-saver";
import moment from "moment";

const StaffPostingApprovalStyles = styled.div`
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

class StaffPostingApproval extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postings: []
    };
    autoBind(this);
  }

  componentDidMount() {
    if (this.state.postings.length == 0) {
      Meteor.call("staffposting.getApprovedPosting", (err, res) => {
        if (!err) {
          this.setState({ postings: res });
        }
        console.log(err);
      });
    }
  }

  downloadPostingPDF(event, postings) {
    event.preventDefault();
    const { target } = event;
    target.innerHTML = "<em>Downloading...</em>";
    target.setAttribute("disabled", "disabled");
    Meteor.call("staffposting.printpdflist", postings, (err, response) => {
      if (!err) {
        const blob = base64ToBlob(response);
        fileSaver.saveAs(blob, "postings_list.pdf");
        target.innerText = "Print List";
        target.removeAttribute("disabled");
      } else {
        alert(err);
        target.innerText = "Print List";
        target.removeAttribute("disabled");
      }
    });
  }

  render() {
    const { loading } = this.props;
    const { postings } = this.state;

    return (
      <StaffPostingApprovalStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              postings && postings.length ? (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Name</th>
                      <th>PF</th>
                      <th>Designation</th>
                      <th>Current Department</th>
                      <th> Posted To</th>
                      <th>Resumption Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postings &&
                      postings &&
                      postings.map((post, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <p>{post.data.staffName}</p>
                            </td>
                            <td>
                              <p>{post._id}</p>
                            </td>
                            <td>
                              <p>{post.data.designation}</p>
                            </td>

                            <td>
                              <p>{post.data.unitFrom}</p>
                            </td>
                            <td>
                              <p>{post.data.newUnit}</p>
                            </td>

                            <td>
                              {moment(post.data.startingDate).format(
                                "MMMM DD YYYY"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              ) : (
                <div>
                  <p className="lead">No approved posting list</p>
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
                  onClick={() => this.downloadPostingPDF(event, postings)}
                  bsStyle="success"
                >
                  Print List
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>
      </StaffPostingApprovalStyles>
    );
  }
}

export default StaffPostingApproval;
