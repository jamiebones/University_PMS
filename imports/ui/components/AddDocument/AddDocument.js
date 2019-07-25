import React from "react";
import { Col, Row } from "react-bootstrap";
import Documents from "../../../api/Documents/Documents";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";

const StyledAddDocuments = styled.div`
  .alertDiv {
    margin-top: 20px;
    p {
      font-style: italic;
      color: #000;
    }
  }
`;

class AddDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffId: "",
      staff: {},
      documents: [],
      uploading: [],
      progress: 0,
      fileStatus: "",
      inProgress: false
    };
    autoBind(this);
  }

  uploadIt(e) {
    e.preventDefault();
    if (e.target.files) {
      const { meta } = this.props;
      let files = e.target.files;
      let filesArr = Array.from(files);
      let count = null;
      for (let i = 0; i < filesArr.length; i++) {
        const file = filesArr[i];

        let self = this;
        //type here means the reference type
        //1 = individual
        //2 = generic
        if (file) {
          let uploadInstance = Documents.insert(
            {
              file: file,
              meta: meta,
              streams: "dynamic",
              chunkSize: "dynamic",
              allowWebWorkers: true // If you see issues with uploads, change this to false
            },
            false
          );

          self.setState({
            uploading: uploadInstance, // Keep track of this instance to use below
            inProgress: true // Show the progress bar now
          });

          // These are the event functions, don't need most of them, it shows where we are in the process
          uploadInstance.on("start", function() {
            console.log("Starting");
            self.setState({ fileStatus: `uploading ${file.name}` });
          });

          uploadInstance.on("end", function(error, fileObj) {
            self.setState({ fileStatus: `Finished uploading ${fileObj.name}` });
          });

          uploadInstance.on("uploaded", function(error, fileObj) {
            console.log("uploaded: ", fileObj);
            count += 1;
            if (count == filesArr.length) {
              self.refs["fileinput"].value = "";
              Bert.alert(`${count} file(s) uploaded successfully`, "success");
            }

            self.setState({
              uploading: [],
              progress: 0,
              inProgress: false,
              fileStatus: ""
            });
          });

          uploadInstance.on("error", function(error, fileObj) {
            console.log("Error during upload: " + error);
          });

          uploadInstance.on("progress", function(progress, fileObj) {
            console.log("Upload Percentage: " + progress);
            // Update our progress bar
            self.setState({
              progress: progress
            });
          });

          uploadInstance.start(); // Must manually start the upload
        }
      }
    }
  }

  showUploads() {
    if (!_.isEmpty(this.state.uploading)) {
      return (
        <div>
          {this.state.uploading.file.name}

          <div className="progress progress-bar-default">
            <div
              style={{ width: this.state.progress + "%" }}
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow={this.state.progress || 0}
              role="progressbar"
              className="progress-bar"
            >
              <span className="sr-only">
                {this.state.progress}% Complete (success)
              </span>
              <span>{this.state.progress}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <StyledAddDocuments>
        <div className="alertDiv">
          <input
            type="file"
            id="fileinput"
            disabled={this.state.inProgress}
            multiple
            ref="fileinput"
            onChange={this.uploadIt}
          />
          <br />
          <br />
        </div>

        {this.showUploads()}
      </StyledAddDocuments>
    );
  }
}

export default AddDocuments;
