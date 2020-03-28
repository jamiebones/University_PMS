import { Meteor } from "meteor/meteor";
import { FilesCollection } from "meteor/ostrio:files";
import { ActivityLog } from "../../api/ActivityLog/ActivityLogClass";
if (Meteor.isServer) {
  import WriteToDocument from "../../modules/server/writeToDocument";
}

import { _ } from "meteor/underscore";
const Documents = new FilesCollection({
  storagePath: "/home/jamiebones/PMS_DATA",
  downloadRoute: "/files/documents",
  collectionName: "Documents",
  permissions: 0o755,
  allowClientCode: false,
  cacheControl: "public, max-age=31536000",
  // Read more about cacheControl: https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers
  onbeforeunloadMessage() {
    return "Upload is still in progress! Upload will be aborted if you leave this page!";
  },
  onBeforeUpload(file) {
    // Note: You should never trust to extension and mime-type here
    // as this data comes from client and can be easily substitute
    // to check file's "magic-numbers" use `mmmagic` or `file-type` package
    // real extension and mime-type can be checked on client (untrusted side)
    // and on server at `onAfterUpload` hook (trusted side)
    if (/pdf/i.test(file.ext)) {
      return true;
    }
    return false;
  },
  onAfterUpload(file) {
    if (Meteor.isServer) {
      // check real mimetype
      const { Magic, MAGIC_MIME_TYPE } = require("mmmagic");
      const magic = new Magic(MAGIC_MIME_TYPE);
      import { DocumentsInUnit, StaffDocuments } from "./server/utility";
      magic.detectFile(
        file.path,
        Meteor.bindEnvironment((err, mimeType) => {
          if (err || !~mimeType.indexOf("pdf")) {
            // is not a real pdf --> delete
            console.log("onAfterUpload, not a pdf file: ", file.path);
            console.log("file deleted", file.path);
            this.remove(file._id);
            throw new Error("oops", "Please upload only a pdf file");
          }

          //check here if we have personal document upload
          //when the file.meta.type == 1
          const userId = file.meta.userId;
          delete file.meta.userId;
          if (file.meta.type === "1") {
            StaffDocuments(file);
          } else if (file.meta.type === "2") {
            //we have personnel documents uploaded here
            //we should have the type of document here been
            //uploaded if it is a personnel document
            DocumentsInUnit(file);
          }
          //we should add another if block here to cover the case
          //of uploading files after the initial block file upload

          //console.dir(file);
          WriteToDocument(file)
            .then(pdf => {
              //this is where we write the person that uploaded the file
              const newActivity = new ActivityLog();
              newActivity.username = userId;
              const user = Meteor.users.findOne(userId);
              newActivity.name = `${user.profile.name.first} ${user.profile.name.last}`;
              newActivity.activityTime = new Date().toISOString();
              newActivity.actionTaken = `Added documents with reference  ${file.meta.reference} `;
              newActivity.type = "Document added";
              newActivity.save();
              this.update(file._id, { $set: { meta: file.meta } });
            })
            .catch(err => {
              console.log(err);
            });
        })
      );
    }
  }
});

Documents.WriteDocumentToCollection = (dataTowrite, meta, fileName, type) =>
  Documents.write(
    dataTowrite,
    //{
    //  fileName: "sample.png",
    // fielId: "abc123myId", //optional
    //  type: "image/png"
    //},
    {
      meta,
      fileName,
      type
    },
    function(writeError, fileRef) {
      if (writeError) {
        throw writeError;
      } else {
        console.log("document write successful");
      }
    }
  );

// Export FilesCollection instance, so it can be imported in other files
export default Documents;
