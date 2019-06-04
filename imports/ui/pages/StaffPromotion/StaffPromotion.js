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
if (Meteor.isClient) {
  import "react-virtualized/styles.css";
}

const StaffPromotionStyles = styled.div`
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

class StaffPromotion extends React.Component {
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
      loading: true,
      disableHeader: false,
      hideIndexRow: false,
      overscanRowCount: 10,
      scrollToIndex: undefined,
      sortBy,
      sortDirection,
      useDynamicRowHeight: false
    };
    this.fetchData = _.debounce(this.makeRemoteCall, 300);
    autoBind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    const { sortBy: prevSortBy, sortDirection: prevSortDirection } = this.state;
    if (
      nextState.sortBy !== prevSortBy ||
      nextState.sortDirection !== prevSortDirection
    ) {
      const { sortBy, sortDirection } = nextState;

      let { staff } = this.state;
      if (sortBy) {
        staff = staff.sort(compareValues(sortBy));
        if (sortDirection === SortDirection.DESC) {
          staff = staff.reverse();
        }
      }
    }
  }

  componentDidMount() {
    this.makeRemoteCall();
  }

  makeRemoteCall(start, end) {
    if (!this.state.hasMore) return;
    Meteor.call("getStaffDueForPromotion", (err, res) => {
      if (!err) {
        const staff = _.union(this.state.staff, res[0]);
        const count = res[2];
        const hasMore = count > staff.length;
        this.setState({
          staff,
          designations: res[1],
          loading: false,
          count,
          hasMore
        });
      }
    });
    Meteor.call("staffmembers.getStaffDueForPromotion", (err, res) => {
      if (!err) {
        console.log(res);
      } else {
        console.log(err);
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
    Meteor.call("getStaffDueForPromotion", designation, (err, res) => {
      if (!err) {
        this.setState({
          staff: res[0],
          designations: res[1],
          loading: false,
          selectedDesignation: designation
        });
      }
    });
  }

  _sort({ sortBy, sortDirection }) {
    const { sortBy: prevSortBy, sortDirection: prevSortDirection } = this.state;

    // If list was sorted DESC by this column.
    // Rather than switch to ASC, return to "natural" order.
    if (prevSortDirection === SortDirection.DESC) {
      sortBy = null;
      sortDirection = null;
    }

    this.setState({ sortBy, sortDirection });
  }

  _isSortEnabled() {
    const { staff, rowCount } = this.state;
    return rowCount <= staff.length;
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

  _rowClassName({ index }) {
    if (index < 0) {
      return "headerRow";
    } else {
      return index % 2 === 0 ? "evenRow" : "oddRow";
    }
  }

  _noRowsRenderer() {
    return <div className="noRows lead">No data available.</div>;
  }

  _getRowHeight({ index }) {
    const { staff } = this.state;

    return staff.length;
  }

  render() {
    const rowGetter = ({ index }) => this.state.staff[index];
    const { selectedDesignation, designations, loading } = this.state;
    const {
      disableHeader,
      overscanRowCount,
      sortBy,
      sortDirection
    } = this.state;
    return (
      <StaffPromotionStyles>
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
              <AutoSizer disableHeight>
                {({ width }) => {
                  return (
                    <Tables
                      disableHeader={disableHeader}
                      headerClassName="headerColumn"
                      rowClassName={this._rowClassName}
                      noRowsRenderer={this._noRowsRenderer}
                      width={width}
                      height={900}
                      headerHeight={30}
                      rowHeight={40}
                      rowCount={this.state.staff.length}
                      overscanRowCount={overscanRowCount}
                      rowGetter={rowGetter}
                      sort={this._sort}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onRowClick={this.onRowClick}
                      className="Table"
                    >
                      <Column
                        label="Staff Id"
                        dataKey="staffId"
                        disableSort={!this._isSortEnabled()}
                        width={120}
                      />

                      <Column
                        label="Name"
                        width={300}
                        dataKey="biodata"
                        cellDataGetter={({ rowData, dataKey }) => (
                          <span>
                            {rowData[dataKey].firstName}{" "}
                            {rowData[dataKey].middleName}{" "}
                            {rowData[dataKey].surname}
                          </span>
                        )}
                        cellRenderer={({ dataKey = "biodata", cellData }) => (
                          <p>{cellData}</p>
                        )}
                      />
                      <Column
                        label="Designation"
                        dataKey="designation"
                        width={300}
                        disableSort={!this._isSortEnabled()}
                      />
                      <Column
                        label="Salary"
                        width={200}
                        dataKey="salaryStructure"
                      />
                      <Column
                        label="Last promotion"
                        width={100}
                        dataKey="dateOfLastPromotion"
                      />
                      <Column
                        label="Years spent"
                        width={100}
                        dataKey="yearsSincePromotion"
                      />
                    </Tables>
                  );
                }}
              </AutoSizer>
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </StaffPromotionStyles>
    );
  }
}

export default StaffPromotion;
