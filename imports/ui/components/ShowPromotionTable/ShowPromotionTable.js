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
    this.state = {
      biodata: "",
      staffId: "",
      salaryStructure: "",
      certificate: "",
      dateOfLastPromotion: "",
      designation: ""
    };
  }

  updatePromotion({
    biodata,
    staffId,
    salaryStructure,
    dateOfLastPromotion,
    designation,
    certificate
  }) {
    this.setState({
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      designation,
      certificate,
      showModal: true
    });
  }

  onRowClick({
    biodata,
    staffId,
    salaryStructure,
    dateOfLastPromotion,
    designation,
    certificate
  }) {
    this.props.modalDetails({
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      designation,
      certificate
    });
  }

  render() {
    const { _id, data } = this.props;
    return (
      <ShowPromotionTableStyles>
        <Row>
          <Col md={12}>
            <p className="text-info">{_id && _id.toUpperCase()}</p>

            <Table responsive striped>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Staff Details</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Salary Structure</th>
                  <th>Qualifications</th>
                  <th>Last Promotion Year</th>
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
                        <tr
                          key={index}
                          onClick={e =>
                            this.onRowClick({
                              biodata,
                              certificate,
                              currentPosting,
                              dateOfLastPromotion,
                              designation,
                              salaryStructure,
                              staffId,
                              yearsSincePromotion
                            })
                          }
                        >
                          <td>{index + 1}</td>
                          <td>
                            <p>
                              <span>
                                {biodata && biodata.firstName}{" "}
                                {biodata && biodata.middleName}{" "}
                                {biodata && biodata.surname}
                              </span>
                              <br />
                              <span>{staffId}</span>
                            </p>
                          </td>

                          <td>
                            <p>{designation}</p>
                          </td>

                          <td>
                            <p>{currentPosting}</p>
                          </td>
                          <td>
                            <p>{salaryStructure}</p>
                          </td>
                          <td>
                            {certificate.map(({ cert, date }, index) => {
                              return (
                                <p key={index}>
                                  <span>
                                    {cert} : {date}
                                  </span>
                                  <br />
                                </p>
                              );
                            })}
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
