import React from "react";
import styled from "styled-components";
import { Col, Row, Button, Alert, Label } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import PromotionModal from "../../components/PromotionModal/PromotionModal";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { base64ToBlob } from "../../../modules/base64-to-blob.js";
import fileSaver from "file-saver";
import ShowPromotionTable from "../../components/ShowPromotionTable/ShowPromotionTable";

const StaffPromotionNewStyles = styled.div`
  .promoTableDiv {
    margin-bottom: 10px;
  }
`;

class StaffPromotionNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      biodata: "",
      staffId: "",
      salaryStructure: "",
      certificate: [],
      dateOfLastPromotion: "",
      designation: "",
      showModal: false,
      selectedDesignation: "",
      staff: [],
      designations: [],
      staffList: [],
      fetchingMore: false,
      loading: true
    };

    autoBind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    if (this.state.staff.length == "0") {
      this.makeRemoteCall(null, 20);
    } else {
      //let's strip what we want from the
      //the state instead of a round trip back
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  makeRemoteCall(selectedDesignation) {
    Meteor.call(
      "staffmembers.getStaffDueForPromotion",
      selectedDesignation,
      (err, res) => {
        if (!err) {
          //we are going to save a subset
          //of 30 in the staffList array
          this.setState({
            staff: res[0],
            staffList: res[0].slice(0, 20),
            designations: res[1],
            loading: false
          });
        } else {
          this.setState({
            staff: [],
            designation: [],
            loading: false
          });
        }
      }
    );
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
            staffList: res[0].slice(0, 20),
            designations: res[1],
            loading: false,
            selectedDesignation: designation
          });
        }
      }
    );
  }

  updatePromotionModal({
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

  printDueForPromotionList(event) {
    event.preventDefault();
    const { staff } = this.state;
    const dueList = {
      staff
    };
    const { target } = event;
    target.innerHTML = "<em>Downloading...</em>";
    target.setAttribute("disabled", "disabled");
    Meteor.call(
      "staffmembers.printlistofstaffdueforpromotion",
      dueList,
      (err, res) => {
        if (!err) {
          const blob = base64ToBlob(res);
          fileSaver.saveAs(blob, "due_for_promotion_list.pdf");
          target.innerText = "Print List";
          target.removeAttribute("disabled");
        } else {
          target.innerText = "Print List";
          target.removeAttribute("disabled");
          console.log(err);
        }
      }
    );
  }

  fetchMoreData() {
    const { staff, staffList } = this.state;
    const dataSize = staffList.length;
    if (staffList.length <= staff.length) {
      this.setState({ fetchingMore: true });
      const moreData = staff.slice(dataSize, dataSize + 30);

      this.setState({
        staffList: [...this.state.staffList, ...moreData],
        fetchingMore: false
      });
      console.log(this.state.staffList);
    }
  }

  handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    this.fetchMoreData();
  }

  render() {
    const {
      selectedDesignation,
      designations,
      loading,
      staff,
      staffList
    } = this.state;
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
              <p className="lead text-center text-info">
                Viewing {selectedDesignation} cadre list due for promotion
              </p>
            ) : (
              <p className="lead text-center text-info">
                Viewing abridged list of staff members due for promotion
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
              certificate={this.state.certificate}
              makeRemoteCall={this.makeRemoteCall}
              selectedDesignation={this.state.selectedDesignation}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {!loading ? (
              <div>
                {staffList && staffList.length ? (
                  <div>
                    {staffList.map(({ _id, data }, index) => {
                      return (
                        <div className="promoTableDiv" key={index}>
                          <ShowPromotionTable
                            _id={_id}
                            data={data}
                            modalDetails={this.updatePromotionModal}
                            loadMore={this.state.fetchingMore}
                          />
                        </div>
                      );
                    })}
                    {staffList.length < staff.length ? (
                      <p>
                        <Label bsStyle="default">More data</Label>
                      </p>
                    ) : (
                      <p>
                        {" "}
                        <Label bsStyle="default">Data loading finished</Label>
                      </p>
                    )}

                    <Button
                      bsStyle="success"
                      bsSize="small"
                      onClick={this.printDueForPromotionList}
                    >
                      Print List
                    </Button>
                  </div>
                ) : (
                  <Row>
                    <Col md={6}>
                      <Alert bsStyle="info">
                        <p className="text-danger lead">
                          No staff member in the {selectedDesignation} cadre is
                          due for promotion this year.
                        </p>
                      </Alert>
                    </Col>
                  </Row>
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
