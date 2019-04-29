import React, { memo, useMemo } from "react";
import styled from "styled-components";
import { Button, Col, Row, Table } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import { CalculateDueForRetirement } from "../../../modules/utilitiesComputation";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { Table as Tables, Column, AutoSizer } from "react-virtualized";
import { compareValues, SortDirection } from "../../../modules/utilities";
if (Meteor.isClient) {
  import "react-virtualized/styles.css";
}
import moment from "moment";

const splitFac = faculty => {
  if (faculty) {
    const split = faculty.split("/");
    return {
      faculty: split[0],
      dept: split[1]
    };
  }
};

const PensionDashBoardStyles = styled.div`
  .pensionTable tr th {
    color: deepskyblue;
    background-color: #c0c0c0;
  }

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

class PensionDashBoard extends React.Component {
  constructor(props) {
    super(props);
    const sortBy = "designation";
    const sortDirection = SortDirection.ASC;
    this.state = {
      loading: true,
      staff: [],
      disableHeader: false,
      overscanRowCount: 10,
      sortBy,
      sortDirection
    };
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
    Meteor.call("staffmembers.getstaff", (err, res) => {
      if (!err) {
        const result = CalculateDueForRetirement(res);
        this.setState({ staff: result, loading: false });
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
    const {
      staff,
      loading,
      disableHeader,
      overscanRowCount,
      sortBy,
      sortDirection
    } = this.state;
    const rowGetter = ({ index }) => this.state.staff[index];
    return (
      <PensionDashBoardStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              <div>
                <p className="lead text-center">
                  List Of Staff That Has Served For 35 Years And Above
                </p>

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
                          cellRenderer={({ cellData }) => <p>{cellData}</p>}
                        />
                        <Column
                          label="Designation"
                          dataKey="designation"
                          width={200}
                        />
                        <Column
                          label="Faculty/Dept"
                          width={450}
                          dataKey="currentPosting"
                          cellDataGetter={({ rowData, dataKey }) => (
                            <p>
                              <span>{splitFac(rowData[dataKey]).faculty}</span>
                              <br />
                              <span>{splitFac(rowData[dataKey]).dept}</span>
                            </p>
                          )}
                          cellRenderer={({ cellData }) => <div>{cellData}</div>}
                        />
                        <Column label="DOB" width={100} dataKey="dob" />
                        <Column label="Age" width={50} dataKey="age" />
                        <Column
                          label="Service"
                          width={200}
                          dataKey="periodSpent"
                          disableSort={true}
                        />
                        <Column
                          label="Left"
                          width={50}
                          dataKey="yearsToretirement"
                          cellDataGetter={({ rowData, dataKey }) => (
                            <span>
                              {rowData[dataKey] <= 0
                                ? "Retired"
                                : rowData[dataKey]}
                            </span>
                          )}
                          cellRenderer={({ cellData }) => <p>{cellData}</p>}
                        />
                      </Tables>
                    );
                  }}
                </AutoSizer>
              </div>
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </PensionDashBoardStyles>
    );
  }
}

export default PensionDashBoard;
