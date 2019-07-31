/*eslint-disable */
import ReactDOMServer from "react-dom/server";
import PrintPosting from "../../ui/components/PrintPosting/PrintPosting";
import { GeneratePDF } from "./pdfGeneration";
import { getBase64String } from "./utilities";

const __generateHTML = ({ logo, postings }) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        ReactDOMServer.renderToStaticMarkup(PrintPosting({ logo, postings }))
      );
    } catch (e) {
      reject(e);
    }
  });
};

export default (PrintPostings = async postings => {
  const path = "../web.browser/app/image/logo.png";
  const logo = await getBase64String(path);
  const html = await __generateHTML({ logo, postings });
  const fileName = `recent_postings.pdf`;
  const pdfList = await GeneratePDF(html, fileName, "landscape", "legal");
  return pdfList;
});
