import ReactDOMServer from "react-dom/server";
import { GeneratePDFBuffer } from "./pdfGeneration";
import { _ } from "meteor/underscore";
import { StaffReliefPostings } from "../../api/StaffReliefPosting/StaffReliefPostingClass";
import PrintLetterComponent from "../../ui/components/PrintReliefPostingLetter/PrintReliefPostingLetter";

import {
  __GetReference,
  __WriteDocumentToCollection
} from "./utilities/utilities";

const __generateHTML = data => {
  return new Promise((resolve, reject) => {
    try {
      resolve(ReactDOMServer.renderToStaticMarkup(PrintLetterComponent(data)));
    } catch (e) {
      reject(e);
    }
  });
};

const __updatePromotedStaffWithReference = (id, reference) => {
  return StaffReliefPostings.update(id, {
    $set: { letterRef: reference }
  });
};

export default PrintList = async options => {
  const { staffId, id } = options;

  const letterName = "relief_posting_letter";

  const reference = await __GetReference(staffId);

  // __updatePromotedStaffWithReference(id, reference);
  options.reference = reference;
  const html = await __generateHTML(options);
  //generatpdf buffer method so that the buffer
  const pdf = await GeneratePDFBuffer(html, "portrait", "a4");
  //this is where we safe the letter to the document collection
  await __WriteDocumentToCollection(pdf, staffId, letterName);
  return pdf.toString("base64");
};
