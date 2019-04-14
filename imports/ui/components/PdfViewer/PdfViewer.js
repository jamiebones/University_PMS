import DocumentOfStaffs from "../../../api/Documents/Documents";
import React from "react";
import PDF from "react-pdf-js";

class MyPdfViewer extends React.Component {
  state = {
    documents: [],
    loaded: false
  };

  onDocumentComplete = pages => {
    console.log(pages);
    this.setState({ page: 1, pages });
  };

  static getDerivedStateFromProps(props, state) {
    if (state.loaded == false) {
      const staffDocuments = props.documents;
      let documentArray = [];
      staffDocuments.map(aFile => {
        let link = DocumentOfStaffs.findOne({ _id: aFile._id }).link();
        documentArray.push(link);
      });
      console.log(documentArray);
      return {
        documents: documentArray,
        loaded: true
      };
    }
  }

  handlePrevious = () => {
    this.setState({ page: this.state.page - 1 });
  };

  handleNext = () => {
    debugger;
    this.setState({ page: this.state.page + 1 });
  };

  renderPagination = (page, pages) => {
    let previousButton = (
      <li className="previous" onClick={this.handlePrevious}>
        <a href="#">
          <i className="fa fa-arrow-left" /> Previous
        </a>
      </li>
    );
    if (page === 1) {
      previousButton = (
        <li className="previous disabled">
          <a href="#">
            <i className="fa fa-arrow-left" /> Previous
          </a>
        </li>
      );
    }
    let nextButton = (
      <li className="next" onClick={this.handleNext}>
        <a href="#">
          Next <i className="fa fa-arrow-right" />
        </a>
      </li>
    );
    if (page === pages) {
      nextButton = (
        <li className="next disabled">
          <a href="#">
            Next <i className="fa fa-arrow-right" />
          </a>
        </li>
      );
    }
    return (
      <nav>
        <ul className="pager">
          {previousButton}
          {nextButton}
        </ul>
      </nav>
    );
  };

  render() {
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      <div>
        <PDF
          file={this.state.documents[4]}
          onDocumentComplete={this.onDocumentComplete}
          page={this.state.page}
        />
        {pagination}
      </div>
    );
  }
}

export default MyPdfViewer;
