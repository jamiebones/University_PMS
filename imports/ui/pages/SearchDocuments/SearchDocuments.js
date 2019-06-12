import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Alert, Col, Row, Button } from "react-bootstrap";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import PdfViewerComponent from "../../components/PdfViewerComponent/PdfViewerComponent";

const SearchDocumentsStyle = styled.div`
  .divSearchArea {
    border: 2px solid;
    background: #456b00;
    padding: 30px;
    color: #fff;
    p {
      font-style: italic;
      font-size: 19px;
    }
  }
`;

class SearchDocumentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reference: "",
      submitted: false,
      document: [],
      loading: false
    };
    autoBind(this);
  }

  onChange(e) {
    this.setState({ reference: e.target.value.toUpperCase() });
  }

  onSubmit(e) {
    if (this.state.reference !== "" && e.keyCode == 13) {
      this.searchDocumentViaRef();
    }
  }

  searchDocumentViaRef() {
    const { reference } = this.state;
    this.setState({ loading: true, submitted: true });
    Meteor.call("documents.getDocViaRef", reference, (err, res) => {
      if (!err) {
        //we have our documents here
        this.setState({ document: res, loading: false, submitted: false });
      } else {
        this.setState({ loading: false, submitted: false });
        Bert.alert(`Error: ${err}`, "danger");
      }
    });
  }

  render() {
    const { document, loading, submitted } = this.state;
    return (
      <SearchDocumentsStyle>
        <Row>
          <Col md={6} mdOffset={3}>
            <div className="divSearchArea">
              <p>Search documents by reference:</p>
              <input
                type="text"
                value={this.state.reference}
                className="form-control"
                onChange={this.onChange}
                onKeyDown={this.onSubmit}
              />
              <br />
              <Button
                bsSize="small"
                bsStyle="info"
                onClick={this.searchDocumentViaRef}
              >
                {submitted ? "Please wait........" : "Search documents"}
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            {!loading ? (
              this.state.document.length ? (
                /*render viewer here */
                <PdfViewerComponent documents={document} />
              ) : null
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </SearchDocumentsStyle>
    );
  }
}

export default SearchDocumentsPage;
