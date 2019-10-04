/*eslint-disable */
import ReactDOMServer from "react-dom/server";
import PrintPromotionLetter from "../../ui/components/PrintPromotionLetter/PrintPromotionLetter";
import { GeneratePDF } from "./pdfGeneration";
import { StaffMembers } from "../../api/StaffMember/StaffMemberClass";
import { _ } from "meteor/underscore";
import Documents from "../../api/Documents/Documents";
import { FindMax } from "../../modules/utilities";

const __generateHTML = ({ options, staff, reference }) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        ReactDOMServer.renderToStaticMarkup(
          PrintPromotionLetter({ options, staff, reference })
        )
      );
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

const __GetReference = (staffId, promotionletterRef) => {
  //this is where i will check if the
  //letter has been printed before

  const ifReferenceExist = Documents.findOne({
    "meta.staffId": staffId,
    "meta.reference": promotionletterRef
  });

  if (ifReferenceExist) {
    return promotionletterRef;
  }

  console.log(`promotion reference: ${promotionletterRef}`);

  //dosen't exist we move on here

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

const __WriteDocumentToCollection = (pdf, staffId, promotionletterRef) => {
  //this is where i will check if the
  //letter has been printed before

  const ifReferenceExist = Documents.findOne({
    "meta.staffId": staffId,
    "meta.reference": promotionletterRef
  });

  if (ifReferenceExist) {
    //we already have that document in the collection.
    return;
  }

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
  return Documents.WriteDocumentToCollection(
    pdf,
    meta,
    "promotion letter",
    "application/pdf"
  );
};

export default PrintList = async options => {
  const { staffId, promotionletterRef } = options;
  const staff = __GetStaffDetails(staffId);
  const reference = await __GetReference(staffId, promotionletterRef);
  console.log(reference);
  const html = await __generateHTML({ options, staff, reference });
  const fileName = `promotion_letter.pdf`;
  //passing in true to the generatpdf method so that the buffer
  //i have is not converted into a string
  const pdf = await GeneratePDF(html, fileName, "portrait", "a4", true);
  //this is where we safe the letter to the document collection
  await __WriteDocumentToCollection(pdf, staffId, promotionletterRef);
  const pdfToSendToClient = await GeneratePDF(html, fileName, "portrait", "a4");
  return pdfToSendToClient;
};
