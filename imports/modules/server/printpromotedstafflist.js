/*eslint-disable */
import ReactDOMServer from "react-dom/server";
import PrintPromotedStaffList from "../../ui/components/PrintPromotedStaffList/PrintPromotedStaffList";
import { GeneratePDF } from "./pdfGeneration";

import { getBase64String } from "./utilities";

const __generateHTML = ({ logo, staff, heading }) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        ReactDOMServer.renderToStaticMarkup(
          PrintPromotedStaffList({ logo, staff, heading })
        )
      );
    } catch (e) {
      reject(e);
    }
  });
};

export default (PrintList = async promotedList => {
  const { staff, heading } = promotedList;
  const path = "../web.browser/app/image/logo.png";
  const logo = await getBase64String(path);
  const html = await __generateHTML({ logo, staff, heading });
  const fileName = `recent_postings.pdf`;
  const pdfList = await GeneratePDF(html, fileName, "landscape", "legal");
  return pdfList;
});
