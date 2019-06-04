import React from "react";
import styled from "styled-components";
import { Col, Row, Table } from "react-bootstrap";
import autoBind from "react-autobind";

const ShowPromotionTableStyles = styled.div`
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

class ShowPromotionTable extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { _id, data } = this.props;
    return (
      <ShowPromotionTableStyles>
        <Row>
          <Col md={12}>
            <p>{_id && _id.toUpperCase()}</p>

            <Table responsive striped>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>PF</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th> Posted To</th>
                  <th>Resumption Date</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map(
                    (
                      {
                        biodata,
                        certificate,
                        currentPosting,
                        dateOfLastPromotion,
                        designation,
                        salaryStructure,
                        staffId,
                        yearsSincePromotion
                      },
                      index
                    ) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <p>
                              {biodata && biodata.firstName}{" "}
                              {biodata && biodata.middleName}{" "}
                              {biodata && biodata.surname}
                            </p>
                          </td>
                          <td>
                            <p>{staffId}</p>
                          </td>
                          <td>
                            <p>{designation}</p>
                          </td>
                          <td>
                            <p>{salaryStructure}</p>
                          </td>

                          <td>
                            <p>{currentPosting}</p>
                          </td>
                          <td>
                            <p>
                              {dateOfLastPromotion}: {yearsSincePromotion}
                            </p>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </Table>
            <div className="pull-right">
              <p>Total: {data.length}</p>
            </div>
          </Col>
        </Row>
      </ShowPromotionTableStyles>
    );
  }
}

export default ShowPromotionTable;
