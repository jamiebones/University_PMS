import React from "react";
import styled from "styled-components";
import { Col, Row, Button } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import PromotionModal from "../../components/PromotionModal/PromotionModal";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { base64ToBlob } from "../../../modules/base64-to-blob.js";
import fileSaver from "file-saver";
import ShowPromotionTable from "../../components/ShowPromotionTable/ShowPromotionTable";

const StaffPromotionNewStyles = styled.div``;

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
      loading: true
    };

    autoBind(this);
  }

  componentDidMount() {
    console.log(this.state);
    if (this.state.staff.length == "0") {
      this.makeRemoteCall();
    } else {
      //let's strip what we want from the
      //the state instead of a round trip back
    }
  }

  makeRemoteCall() {
    Meteor.call("staffmembers.getStaffDueForPromotion", (err, res) => {
      if (!err) {
        this.setState({
          staff: res[0],
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
              certificate={this.state.certificate}
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
                        <ShowPromotionTable
                          _id={_id}
                          data={data}
                          key={index}
                          modalDetails={this.updatePromotionModal}
                        />
                      );
                    })}
                    <Button
                      bsStyle="success"
                      bsSize="small"
                      onClick={this.printDueForPromotionList}
                    >
                      Print List
                    </Button>
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
