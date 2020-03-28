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
      inProgress: false,
      error: []
    };
    autoBind(this);
  }

  fileUploadFunction = (file, self, meta) => {
    return new Promise((resolve, reject) => {
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

      uploadInstance.start(); // Must manually start the upload

      self.setState({
        uploading: uploadInstance, // Keep track of this instance to use below
        inProgress: true // Show the progress bar now
      });

      // These are the event functions, don't need most of them, it shows where we are in the process
      uploadInstance.on("start", function(error, fileObj) {
        console.log("Starting");
        self.setState({ fileStatus: `uploading ${fileObj.name}` });
      });

      uploadInstance.on("end", function(error, fileObj) {
        self.setState({ fileStatus: `Finished uploading ${fileObj.name}` });
      });

      uploadInstance.on("uploaded", function(error, fileObj) {
        if (error) {
          console.log(error);
          self.setState({ error: error, uploading: [] });
          reject(error);
        } else {
          //we were successful here we just return 1
          //to show that it ran well.
          self.setState({
            uploading: [],
            progress: 0,
            inProgress: false,
            fileStatus: ""
          });
          resolve(1);
        }
      });

      uploadInstance.on("error", function(error, fileObj) {
        console.log("Error during upload: " + error);
        reject(`There was an error uploading : ${fileObj.name} || ${error}`);
      });

      uploadInstance.on("progress", function(progress, fileObj) {
        console.log("Upload Percentage: " + progress);
        // Update our progress bar
        self.setState({
          progress: progress
        });
      });
    });
  };

  async uploadIt(e) {
    e.preventDefault();
    if (e.target.files) {
      const { meta } = this.props;
      let files = e.target.files;
      let filesArr = Array.from(files);
      let count = null;
      let self = this;
      let errorArray = [];
      //type here means the reference type
      //1 = individual
      //2 = generic

      //verify each file here to prevent uploading a file that is not a pdf
      //reset the state

      //check what is coming through if we have a documentType and type
      //is equal to 1 we have a staff document
      //lets check if meta.bulk > 10 that means we have a bulk upload

      if (meta.documentType === "bulk" && meta.type == "1") {
        //check here if files uploaded are greater than 10
        if (filesArr.length - 1 < 10) {
          //tell them we cannot upload using bulk for less than 10 files
          alert(
            `You can not upload less than 10 documents using the bulk option please select the appropriate file types.`
          );
          this.refs["fileinput"].value = "";
          return;
        }
      }

      //confirm what you are uploading
      if (meta.type == "1") {
        const confirmWhatYouDoing = confirm(
          `You are uploading document type ${meta.documentType} for ${meta.staffId}. Please confirm`
        );
        if (!confirmWhatYouDoing) {
          this.refs["fileinput"].value = "";
          return;
        }
      }

      for (let i = 0; i < filesArr.length; i++) {
        const file = filesArr[i];
        if (file.name.lastIndexOf(".pdf") != file.name.length - 4) {
          errorArray.push(
            `file number ${i + 1} with name ${
              file.name
            } is not a pdf file. Please remove it and try again`
          );
        }
      }

      //check if we have anything on the errorArray
      if (errorArray.length > 0) {
        //we want to return to fix our shit
        this.setState({ error: errorArray });
        this.refs["fileinput"].value = "";
        Bert.alert(`There was an error`, "danger");
        return;
      }
      this.setState({ error: [] });
      for (let i = 0; i < filesArr.length; i++) {
        const file = filesArr[i];
        //please do validation here

        try {
          const uploadedCount = await this.fileUploadFunction(file, self, meta);
          count += uploadedCount;
          if (count == filesArr.length) {
            this.refs["fileinput"].value = "";
            Bert.alert(`${count} file(s) uploaded successfully`, "success");
          }
        } catch (error) {
          Bert.alert(`There was an error: ${error}`, "danger");
        }
      }
    }
  }

  showUploads() {
    if (!_.isEmpty(this.state.uploading)) {
      return (
        <div>
          <p> {this.state.fileStatus}</p>
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

        {this.state.error.length > 0 &&
          this.state.error.map((error, index) => {
            return (
              <p key={index} className="text-danger">
                {error}
              </p>
            );
          })}

        {this.showUploads()}
      </StyledAddDocuments>
    );
  }
}

export default AddDocuments;
