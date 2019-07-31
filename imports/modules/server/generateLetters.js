/*eslint-disable */
import ReactDOMServer from "react-dom/server";
import { GeneratePdf } from "./pdfGeneration";
import { NonTeachingCadresAndProgression } from "../cadresprogression";

const __checkDesignationType = ({ designation }) => {
  return new Promise((resolve, reject) => {
    const nonTeachingDesignation = NonTeachingCadresAndProgression();
    //loop through
    for (let i = 0; i < nonTeachingDesignation.length; i++) {
      const cadre = nonTeachingDesignation[i];
      //find the designation;
      const desInCadre = cadre.includes(designation.toUpperCase());
      if (desInCadre) {
        resolve({ position: i });
        break;
      }
      continue;
    }
    //can not find cadre here so i should return null
    resolve({ position: null });
  });
};

const __getLetterInformation = options => {
  return new Promise((resolve, reject) => {
    const destinationType = __checkDesignationType(options);

    if (destinationType.position == "1") {
      //we have an admin officer here
    }
  });
};

//const handler = (options, promise) => {
// action = promise;
// const certificateData = getCertificateData(options);
//  const html = getCertificateAsHTML(certificateData);
// const fileName = `Certificate.pdf`;
// if (html && fileName) generatePDF(html, fileName);
//};

export const GenerateLetters = async options => {};
