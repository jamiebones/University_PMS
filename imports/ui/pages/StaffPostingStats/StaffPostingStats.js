import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Alert, Label } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";

const StaffPostingStatsStyles = styled.div`
  .spanLabel {
    padding: 5px;
  }
  .table-striped > tbody > tr:nth-of-type(odd) {
    background-color: #e4c1c1;
  }
`;

class StaffPostingStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: [],
      loading: true
    };
    autoBind(this);
  }

  componentWillMount() {
    Meteor.call("staffposting.getPostingSummary", (err, res) => {
      if (!err) {
        this.setState({ staff: res, loading: false });
      }
    });
  }
  render() {
    const { loading, staff } = this.state;
    return (
      <StaffPostingStatsStyles>
        <Row>
          <Col md={12}>
            <p className="lead center">Recent Posting Summary</p>
            {!loading ? (
              staff && staff.length ? (
                <Table responsive striped bordered condensed>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Outgoing</th>
                      <th>Incoming</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(({ dept, leaving, coming }, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <p>{dept}</p>
                          </td>

                          <td>
                            {leaving && leaving.length ? (
                              leaving.map(({ designation, number }, index) => {
                                return [
                                  <p key={index + 20000}>
                                    <span>{designation} :</span>
                                    <span className="spanLabel">
                                      <Label bsStyle="success">{number}</Label>
                                    </span>
                                  </p>
                                ];
                              })
                            ) : (
                              <p>
                                <span>
                                  <Label bsStyle="info">none</Label>
                                </span>
                              </p>
                            )}
                          </td>

                          <td>
                            {coming && coming.length ? (
                              coming.map(({ designation, number }, index) => {
                                return (
                                  <p key={index + 20000}>
                                    <span>{designation} :</span>
                                    <span className="spanLabel">
                                      <Label bsStyle="success">{number}</Label>
                                    </span>
                                  </p>
                                );
                              })
                            ) : (
                              <p>
                                <span className="spanLabel">
                                  <Label bsStyle="info">none</Label>
                                </span>
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Alert bsStyle="info">No data</Alert>
              )
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </StaffPostingStatsStyles>
    );
  }
}

export default StaffPostingStats;
