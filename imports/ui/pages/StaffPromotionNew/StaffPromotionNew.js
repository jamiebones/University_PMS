import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Label, Alert } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import PromotionModal from "../../components/PromotionModal/PromotionModal";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { Table as Tables, Column, AutoSizer } from "react-virtualized";
import { compareValues, SortDirection } from "../../../modules/utilities";
import ShowPromotionTable from "../../components/ShowPromotionTable/ShowPromotionTable";

const StaffPromotionNewStyles = styled.div`
  .Table {
    width: 100%;
    margin-top: 15px;
  }
  .headerRow,
  .evenRow,
  .oddRow {
    border-bottom: 1px solid #e0e0e0;
  }
  .oddRow {
    background-color: #fafafa;
  }
  .headerColumn {
    text-transform: none;
    color: darkcyan;
  }
  .exampleColumn {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .noRows {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    color: #bdbdbd;
  }
`;

class StaffPromotionNew extends React.Component {
  constructor(props) {
    super(props);
    const sortBy = "designation";
    const sortDirection = SortDirection.ASC;
    //const sortedList = this._sortList({ sortBy, sortDirection });
    this.state = {
      biodata: "",
      staffId: "",
      salaryStructure: "",
      certificate: "",
      dateOfLastPromotion: "",
      firstRender: true,
      designation: "",
      showModal: false,
      selectedDesignation: "",
      staff: [],
      hasMore: true,
      count: 0,
      designations: [],
      loading: true
    };

    autoBind(this);
  }

  componentDidMount() {
    this.makeRemoteCall();
  }

  makeRemoteCall() {
    Meteor.call("staffmembers.getStaffDueForPromotion", (err, res) => {
      if (!err) {
        this.setState({
          staff: res[0],
          designations: res[1],
          loading: false,
        });
      }
    });
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

  onChange(e) {
    if (e.target.value == "0") return;
    const designation = e.target.value;
    this.setState({ loading: true });
    Meteor.call(
      "staffmembers.getStaffDueForPromotion",
      designation,
      (err, res) => {
        if (!err) {
          this.setState({
            staff: res[0],
            designations: res[1],
            loading: false,
            selectedDesignation: designation
          });
        }
      }
    );
  }

  onRowClick(e) {
    const {
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      designation,
      certificate
    } = e.rowData;
    this.updatePromotion({
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      designation,
      certificate
    });
  }

  render() {
    const { selectedDesignation, designations, loading, staff } = this.state;
    console.log(staff);
    return (
      <StaffPromotionNewStyles>
        <Row>
          <Col md={12}>
            <Row>
              <Col md={6}>
                <select
                  className="form-control"
                  value={this.state.selectedDesignation}
                  onChange={this.onChange}
                >
                  <option value="0">select a designation</option>
                  <option value="all">All Eligible For Promotion</option>
                  {designations &&
                    designations.map(({ rank }) => {
                      return (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      );
                    })}
                </select>
              </Col>
            </Row>
            <br />
            <br />
            {selectedDesignation ? (
              <p className="lead text-center">
                Viewing {selectedDesignation} cadre list
              </p>
            ) : (
              <p className="lead text-center">
                Viewing initial list for promotion
              </p>
            )}

            <PromotionModal
              show={this.state.showModal}
              onHide={() => this.setState({ showModal: false })}
              history={history}
              staffdesignation={this.state.designation}
              biodata={this.state.biodata}
              staffId={this.state.staffId}
              salaryStructure={this.state.salaryStructure}
              dateOfLastPromotion={this.state.dateOfLastPromotion}
              user={this.props.name}
              designations={designations}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {!loading ? (
              <div>
                {staff && staff.length ? (
                  <div>
                    {staff.map(({ _id, data }, index) => {
                      return (
                        <ShowPromotionTable _id={_id} data={data} key={index} />
                      );
                    })}
                  </div>
                ) : (
                  <div>no length</div>
                )}
              </div>
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </StaffPromotionNewStyles>
    );
  }
}

export default StaffPromotionNew;
