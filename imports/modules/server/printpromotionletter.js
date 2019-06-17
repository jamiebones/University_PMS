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

export default (PrintList = async options => {
  const { staffId } = options;
  const staff = __GetStaffDetails(staffId);
  const reference = __GetReference(staffId);
  const html = await __generateHTML({ options, staff, reference });
  const fileName = `promotion_letter.pdf`;
  const pdf = await GeneratePDF(html, fileName, "portrait", "a4");
  return pdf;
});
