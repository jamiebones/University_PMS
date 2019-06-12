import { Meteor } from "meteor/meteor";
import { FilesCollection } from "meteor/ostrio:files";
if (Meteor.isServer) {
  import WriteToDocument from "../../modules/server/writeToDocument";
}
//import { RefTable } from "../RefTable/RefTableClass";
import { _ } from "meteor/underscore";

const FindMax = (arr, key) => {
  if (arr.length) {
    let highest = 0;
    for (let i = 0; i < arr.length; i++) {
      let currentItem = arr[i][key].serial;
      if (currentItem > highest) {
        highest = currentItem;
      }
    }
    return highest;
  }
  return 0;
};

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
      magic.detectFile(
        file.path,
        Meteor.bindEnvironment((err, mimeType) => {
          if (err || !~mimeType.indexOf("pdf")) {
            // is not a real image --> delete
            console.log("onAfterUpload, not an image: ", file.path);
            console.log("deleted", file.path);
            this.remove(file._id);
          }

          //check here if we have personal document upload
          //when the file.meta.type == 1
          if (file.meta.type === "1") {
            //find the max serial here
            const documents = this.find({
              "meta.staffId": file.meta.staffId,
              "meta.serial": { $exists: true, $ne: null }
            }).fetch();
            let reference = "";
            if (_.isEmpty(documents)) {
              //new serial
              file.meta.serial = 1;
              reference = `${file.meta.staffId}/1`;
              file.meta.reference = reference;
            } else {
              //find the max serial here
              let maxSerial = FindMax(documents, "meta");
              file.meta.serial = maxSerial + 1;
              reference = `${file.meta.staffId}/${maxSerial + 1}`;
              file.meta.reference = reference;
            }
          } else if (file.meta.type === "2") {
            //we have personnel documents uploaded here
            const documents = this.find({
              "meta.reference": file.meta.reference,
              "meta.serial": { $exists: true, $ne: null }
            }).fetch();
            let reference = "";
            if (_.isEmpty(documents)) {
              //new serial
              file.meta.serial = 1;
              reference = `${file.meta.reference}/1`;
              file.meta.reference = reference;
            } else {
              //find the max serial here
              let maxSerial = FindMax(documents, "meta");
              file.meta.serial = maxSerial + 1;
              reference = `${file.meta.reference}/${maxSerial + 1}`;
              file.meta.reference = reference;
            }
          }
          //console.dir(file);
          WriteToDocument(file)
            .then(pdf => {
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

// Export FilesCollection instance, so it can be imported in other files
export default Documents;
