import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Alert, Button } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { base64ToBlob } from "../../../modules/base64-to-blob.js";
import PromotionShowModal from "../../components/PromotionShowModal/PromotionShowModal";
import fileSaver from "file-saver";
if (Meteor.isClient) {
  import "react-virtualized/styles.css";
}
import moment from "moment";

const PromotionListStyles = styled.div`
  .Table tr th {
    background: #b4ca8d;
  }

  .table-bordered {
  }
  .tableDiv {
    margin-top: 50px;
  }
`;

class PromotionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      promotion: [],
      promotedStaff: [],
      selectedStaf: [],
      numSelected: 0,
      registrarName: "",
      councilDate: "",
      staffTitle: "",
      promotionObject: "",
      show: false,
      selectedYear: ""
    };
    autoBind(this);
  }

  loadData() {}

  componentDidMount() {
    Meteor.call("promotedStaff.getPromotionListByYear", (err, res) => {
      if (!err) {
        this.setState({ promotion: res, loading: false });
      }
    });
  }

  resetModal() {
    this.setState({ promotionObject: "" });
  }

  handleSelectChange(e) {
    const year = e.target.value;
    if (year == "0") return;
    this.setState({ loading: true, selectedYear: year });
    Meteor.call("promotedStaff.getPromotionByYear", year, (err, res) => {
      if (!err) {
        const staffs = res;
        staffs.length &&
          staffs.map(staff => {
            return (staff.clicked = false);
          });
        this.setState({ promotedStaff: staffs, loading: false });
      } else {
        console.log(err);
      }
    });
  }

  reprintPromotionLetter(event, { staffId, reference }) {
    event.preventDefault();
    const { target } = event;
    const options = {
      staffId,
      reference
    };
    target.innerHTML = "<em>Downloading...</em>";
    target.setAttribute("disabled", "disabled");
    Meteor.call("promotedstaff.reprintpromotionletter", options, (err, res) => {
      if (!err) {
        const blob = base64ToBlob(res);
        fileSaver.saveAs(blob, "promotion_letter.pdf");
        target.innerText = "Re-print letter";
        target.removeAttribute("disabled");
      } else {
        target.innerText = "Re-print letter";
        target.removeAttribute("disabled");
        console.log(err);
      }
    });
  }

  onHide() {
    this.setState({ show: !this.state.show });
  }

  showModal(modalState) {
    this.setState({ show: modalState });
  }

  printPromotionLetter(
    event,
    {
      _id,
      staffId,
      staffName,
      oldDesignation,
      newDesignation,
      oldSalaryStructure,
      newSalaryStructure,
      oldPromotionDate,
      promotionYear,
      promotionSalary,
      promotionletterRef
    }
  ) {
    let councilDate = "";
    let registrarName = "";
    let staffTitle = "";
    if (this.state.staffTitle === "") {
      //ask them to input the date for the meeting
      staffTitle = prompt(
        "please enter the title of the staff: Example Mr, Mrs, Prof, Dr"
      );
      if (staffTitle) {
        this.setState({ staffTitle: staffTitle });
      } else {
        return;
      }
    }
    if (this.state.councilDate === "") {
      //ask them to input the date for the meeting
      councilDate = prompt(
        "please enter the council date that approve the meeting. Example format of date: Thursday, November 10, 2016"
      );
      if (councilDate) {
        this.setState({ councilDate: councilDate });
      } else {
        return;
      }
    }

    if (this.state.registrarName === "") {
      //ask them to input the date for the meeting
      registrarName = prompt(
        "please enter the Registrar name: Example Aniediabasi Udofia"
      );
      if (registrarName) {
        this.setState({ registrarName: registrarName });
      } else {
        return;
      }
    }

    const promotedStaffDetails = {
      staffId,
      staffName,
      oldDesignation,
      newDesignation,
      oldSalaryStructure,
      newSalaryStructure,
      oldPromotionDate,
      promotionYear,
      promotionSalary,
      promotionId: _id,
      promotionletterRef,
      councilDate: this.state.councilDate
        ? this.state.councilDate
        : councilDate,
      registrarName: this.state.registrarName
        ? this.state.registrarName
        : registrarName,
      staffTitle: this.state.staffTitle ? this.state.staffTitle : staffTitle
    };

    //let's show the modal here with all the goodies
    promotedStaffDetails.resetModal = this.resetModal;
    promotedStaffDetails.year = this.state.selectedYear;
    this.setState({
      show: true,
      promotionObject: promotedStaffDetails,
      staffTitle: ""
    });
  }

  clickCheck(e, index) {
    const checked = e.target.checked;
    let { promotedStaff } = this.state;
    const selectedStaff = promotedStaff[index];
    selectedStaff.clicked = checked;
    promotedStaff[index] = selectedStaff;
    let { numSelected } = this.state;
    if (checked == true) {
      numSelected++;
    } else {
      numSelected--;
    }
    this.setState({ promotedStaff, numSelected });
  }

  selectCheckBoxes(e) {
    const checked = e.target.checked;
    const { promotedStaff } = this.state;
    promotedStaff.map(staff => {
      return (staff.clicked = checked);
    });
    const selectedList = promotedStaff.filter(staff => (staff.clicked = true));

    this.setState({ promotedStaff, numSelected: selectedList.length });
  }

  printSelectedList(event) {
    const promptReply = prompt("Write the heading for the selected list");
    const confirmPlease = confirm(`list heading : ${promptReply}`);
    if (confirmPlease) {
      //we are good
      const { promotedStaff } = this.state;
      const selectedList = promotedStaff.filter(staff => staff.clicked == true);
      const printPromotion = {
        staff: selectedList,
        heading: promptReply
      };
      event.preventDefault();
      const { target } = event;
      target.innerHTML = "<em>Downloading...</em>";
      target.setAttribute("disabled", "disabled");
      Meteor.call(
        "promotedstaff.printpromotionlist",
        printPromotion,
        (err, res) => {
          if (!err) {
            const blob = base64ToBlob(res);
            fileSaver.saveAs(blob, "promotion_list.pdf");
            target.innerText = "Print Selected List";
            target.removeAttribute("disabled");
          } else {
            target.innerText = "Print Selected List";
            target.removeAttribute("disabled");
            console.log(err);
          }
        }
      );
    }
  }

  render() {
    const { promotion, promotedStaff, loading } = this.state;
    return (
      <PromotionListStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              <div>
                <Row>
                  <Col md={6}>
                    <select
                      className="form-control"
                      onChange={this.handleSelectChange}
                    >
                      <option value="0">select entry year</option>
                      {promotion.length &&
                        promotion.map(({ _id }) => {
                          return (
                            <option key={_id} value={_id}>
                              {_id}
                            </option>
                          );
                        })}
                    </select>
                  </Col>
                </Row>

                {promotedStaff.length ? (
                  <div className="tableDiv">
                    <Table responsive bordered condensed className="Table">
                      <thead>
                        <tr>
                          <th>S/N</th>
                          <th>Name</th>
                          <th>Previous/Current Designation</th>
                          <th>Previous/Current Salary</th>
                          <th>Salary</th>
                          <th>Previous Promotion Year</th>
                          <th>Promotion Year</th>
                          <th>
                            <input
                              type="checkbox"
                              onClick={this.selectCheckBoxes}
                            />
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {promotedStaff.map(
                          (
                            {
                              _id,
                              staffId,
                              staffName,
                              oldDesignation,
                              newDesignation,
                              oldSalaryStructure,
                              newSalaryStructure,
                              oldPromotionDate,
                              promotionYear,
                              clicked,
                              promotionSalary,
                              promotionletterRef
                            },
                            index
                          ) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <p>{index + 1}</p>
                                </td>
                                <td>
                                  <p>{staffName}</p>
                                  <p>{staffId}</p>
                                </td>

                                <td>
                                  <p>
                                    {oldDesignation} to {newDesignation}
                                  </p>
                                </td>

                                <td>
                                  <p>
                                    {oldSalaryStructure} to {newSalaryStructure}
                                  </p>
                                </td>

                                <td>
                                  <p>
                                    <span>
                                      {promotionSalary &&
                                        `Annual Salary: ${promotionSalary.yearlySalary}`}
                                    </span>
                                    <br />
                                    <span>
                                      {promotionSalary &&
                                        `Salary Range : ${promotionSalary.yearlySalaryRange}`}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p>{oldPromotionDate}</p>
                                </td>

                                <td>
                                  <p>{promotionYear}</p>
                                  {promotionSalary &&
                                    /* do we have a reference already*/
                                    (promotionletterRef ? (
                                      <Button
                                        bsSize="xsmall"
                                        bsStyle="success"
                                        onClick={e =>
                                          this.reprintPromotionLetter(e, {
                                            staffId,
                                            reference: promotionletterRef
                                          })
                                        }
                                      >
                                        Re-print letter
                                      </Button>
                                    ) : (
                                      <Button
                                        bsSize="xsmall"
                                        onClick={e =>
                                          this.printPromotionLetter(e, {
                                            _id,
                                            staffId,
                                            staffName,
                                            oldDesignation,
                                            newDesignation,
                                            oldSalaryStructure,
                                            newSalaryStructure,
                                            oldPromotionDate,
                                            promotionYear,
                                            promotionSalary,
                                            promotionletterRef
                                          })
                                        }
                                      >
                                        Print letter
                                      </Button>
                                    ))}
                                </td>

                                <td>
                                  <p>
                                    <input
                                      type="checkbox"
                                      checked={clicked}
                                      onChange={e => this.clickCheck(e, index)}
                                    />
                                  </p>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </Table>
                    {this.state.numSelected ? (
                      <div className="pull-right">
                        <Button
                          onClick={this.printSelectedList}
                          bsStyle="success"
                        >
                          Print Selected List
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Row>
                    <Col md={6}>
                      <div className="tableDiv">
                        <Alert>
                          <p>No data for selected year</p>
                        </Alert>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            ) : (
              <Loading />
            )}
            {this.state.promotionObject !== "" ? (
              <PromotionShowModal
                show={this.state.show}
                onHide={this.onHide}
                showModal={this.showModal}
                promotionDetails={this.state.promotionObject}
              />
            ) : null}
          </Col>
        </Row>
      </PromotionListStyles>
    );
  }
}

export default PromotionList;
