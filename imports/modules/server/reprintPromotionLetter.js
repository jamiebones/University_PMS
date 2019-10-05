/*eslint-disable */
import { _ } from "meteor/underscore";
import Documents from "../../api/Documents/Documents";
import { HTTP } from "meteor/http";

const __getDocumentBuffer = documentPath => {
  let file = HTTP.call("GET", documentPath, {
    npmRequestOptions: {
      encoding: null
    }
  });
  return new Buffer(file.content).toString("base64");
};

const __getDocumentsByReference = (staffId, reference) => {
  const doc = Documents.find({
    "meta.reference": reference,
    "meta.staffId": staffId
  }).fetch();
  let documentArray = [];
  doc.map(aFile => {
    let link = Documents.findOne({ _id: aFile._id }).link();
    documentArray.push(link);
  });
  return documentArray[0];
};

export default ReprintPromotionListPrint = async options => {
  const { staffId, reference } = options;
  const documentPath = await __getDocumentsByReference(staffId, reference);
  const file = await __getDocumentBuffer(documentPath);
  return file;
};
