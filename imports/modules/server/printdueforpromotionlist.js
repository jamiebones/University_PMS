/*eslint-disable */
import ReactDOMServer from "react-dom/server";
import PrintDueForPromotion from "../../ui/components/PrintDueForPromotionList/PrintDueForPromotionList";
import { GeneratePDF } from "./pdfGeneration";

import { getBase64String } from "./utilities";

const __generateHTML = ({ logo, staff }) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        ReactDOMServer.renderToStaticMarkup(
          PrintDueForPromotion({ logo, staff })
        )
      );
    } catch (e) {
      reject(e);
    }
  });
};

export default (PrintList = async promotedList => {
  const { staff } = promotedList;
  const path = "../web.browser/app/image/logo.png";
  const logo = await getBase64String(path);
  const html = await __generateHTML({ logo, staff });
  const fileName = `due_for_promotion.pdf`;
  const pdfList = await GeneratePDF(html, fileName, "landscape", "legal");
  return pdfList;
});
