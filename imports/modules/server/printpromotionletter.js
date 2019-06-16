/*eslint-disable */
import ReactDOMServer from "react-dom/server";
import PrintPromotionLetter from "../../ui/components/PrintPromotionLetter/PrintPromotionLetter";
import { GeneratePDF } from "./pdfGeneration";
import { StaffMembers } from "../../api/StaffMember/StaffMemberClass";
import { _ } from "meteor/underscore";

const __generateHTML = ({ options, staff }) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        ReactDOMServer.renderToStaticMarkup(
          PrintPromotionLetter({ options, staff })
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

export default (PrintList = async options => {
  const { staffId } = options;
  const staff = __GetStaffDetails(staffId);
  const html = await __generateHTML({ options, staff });
  const fileName = `promotion_letter.pdf`;
  const pdf = await GeneratePDF(html, fileName, "portrait", "a4");
  return pdf;
});
