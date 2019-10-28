/*eslint-disable */
import ReactDOMServer from "react-dom/server";
import PrintPromotionLetter from "../../ui/components/PrintPromotionLetter/PrintPromotionLetter";
import { GeneratePDFBuffer } from "./pdfGeneration";
import { StaffMembers } from "../../api/StaffMember/StaffMemberClass";
import { _ } from "meteor/underscore";
import Documents from "../../api/Documents/Documents";
import { FindMax } from "../../modules/utilities";
import {
  __GetReference,
  __WriteDocumentToCollection
} from "./utilities/utilities";

import { PromotedStaffs } from "../../api/PromotedStaff/PromotedStaffClass";

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

const __updatePromotedStaffWithReference = (promotionId, reference) => {
  return PromotedStaffs.update(promotionId, {
    $set: { promotionletterRef: reference }
  });
};

export default PrintList = async options => {
  const { staffId, promotionId } = options;
  const staff = __GetStaffDetails(staffId);
  const reference = await __GetReference(staffId);
  console.log(reference);
  __updatePromotedStaffWithReference(promotionId, reference);
  const html = await __generateHTML({ options, staff, reference });
  //passing in true to the generatpdf method so that the buffer
  //i have is not converted into a string
  const pdf = await GeneratePDFBuffer(html, "portrait", "a4");
  const letterName = "promotion letter";
  //this is where we safe the letter to the document collection
  await __WriteDocumentToCollection(pdf, staffId, letterName);
  return pdf.toString("base64");
};
