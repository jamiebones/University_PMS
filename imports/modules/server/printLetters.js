/*eslint-disable */
import ReactDOMServer from "react-dom/server";
import { GeneratePDF } from "./pdfGeneration";
import { StaffMembers } from "../../api/StaffMember/StaffMemberClass";
import { _ } from "meteor/underscore";
import Documents from "../../api/Documents/Documents";
import { FindMax } from "../../modules/utilities";

const __generateHTML = (data, printLetterComponent) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(ReactDOMServer.renderToStaticMarkup(printLetterComponent(data)));
    } catch (e) {
      reject(e);
    }
  });
};

const __GetStaffDetails = staffId => {
  const staff = StaffMembers.findOne({ staffId: staffId });
  if (!_.isEmpty(staff)) {
    return staff;
  }
  return undefined;
};

const __GetReference = staffId => {
  const documents = Documents.find({
    "meta.staffId": staffId,
    "meta.serial": { $exists: true, $ne: null }
  }).fetch();
  if (_.isEmpty(documents)) {
    return `${staffId}/1`;
  }
  let maxSerial = FindMax(documents, "meta");
  return `${staffId}/${maxSerial + 1}`;
};

const __WriteDocumentToCollection = (pdf, staffId, letterName) => {
  //dosen't exist we move on here
  let meta = {};
  const documents = Documents.find({
    "meta.staffId": staffId,
    "meta.serial": { $exists: true, $ne: null }
  }).fetch();
  if (_.isEmpty(documents)) {
    meta.staffId = staffId;
    meta.serial = 1;
    meta.reference = `${staffId}/1`;
  } else {
    let maxSerial = FindMax(documents, "meta");
    meta.staffId = staffId;
    meta.serial = maxSerial + 1;
    meta.reference = `${staffId}/${maxSerial + 1}`;
  }
  //write the promotion letter ref in the promotedstaff collection here
  return Documents.WriteDocumentToCollection(
    pdf,
    meta,
    letterName,
    "application/pdf"
  );
};

const __updatePromotedStaffWithReference = (id, reference, collectionName) => {
  return collectionName.update(id, {
    $set: { letterRef: reference }
  });
};

export default PrintList = async options => {
  const {
    staffId,
    letterRef,
    id,
    collectionName,
    letterName,
    fileName,
    printLetterComponent,
    data
  } = options;
  const staff = __GetStaffDetails(staffId);
  const reference = await __GetReference(staffId);

  // __updatePromotedStaffWithReference(id, reference, collectionName);
  data.reference = reference;
  const html = await __generateHTML(data, printLetterComponent);
  console.log("html coming forth");
  console.log(html);
  //passing in true to the generatpdf method so that the buffer
  //i have is not converted into a string
  const pdf = await GeneratePDF(html, fileName, "landscape", "legal");
  //this is where we safe the letter to the document collection
  await __WriteDocumentToCollection(pdf, staffId, letterName);
  const pdfToSendToClient = await GeneratePDF(html, fileName, "portrait", "a4");
  return pdfToSendToClient;
};
