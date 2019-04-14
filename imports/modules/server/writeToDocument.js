import { Meteor } from "meteor/meteor";
import moment from "moment";
import hummus from "hummus";
//const AWS = require("aws-sdk");
//const fse = require("fs-extra");

export default (WriteToDocument = file => {
  return new Promise((resolve, reject) => {
    try {
      const logo = "../web.browser/app/image/pdflogo.png";
      const addedDate = moment().format("MMMM DD, YYYY");
      const pdfFont = "assets/app/pdfFont/couri.ttf";
      const fontSize = 11;
      const index = file.path.lastIndexOf("/");
      const fileName = file.path.slice(index);
      const modifiedPath = file._storagePath + fileName;
      console.log(modifiedPath);
      const pdfWriter = hummus.createWriterToModify(file.path, {
        modifiedFilePath: modifiedPath,
        log: "assets/app/temp/pdfLog.txt"
      });
      const pdfReader = hummus.createReader(file.path);
      for (let i = 0; i < pdfReader.getPagesCount(); ++i) {
        const pageInfo = pdfReader.parsePage(i);
        const dimensions = pageInfo.getMediaBox();
        const pageModifier = new hummus.PDFPageModifier(pdfWriter, i, true);
        pageModifier
          .startContext()
          .getContext()
          .writeText(
            `Ref : ${file.meta.staffId}/${file.meta.serial}`,
            10,
            dimensions[3] - 20,
            {
              font: pdfWriter.getFontForFile(pdfFont),
              size: fontSize,
              colorspace: "gray",
              color: 0x00
            }
          );

        pageModifier
          .startContext()
          .getContext()
          .writeText(`Date : ${addedDate}`, 10, dimensions[3] - 30, {
            font: pdfWriter.getFontForFile(pdfFont),
            size: fontSize,
            colorspace: "gray",
            color: 0x00
          });
        pageModifier
          .startContext()
          .getContext()
          .drawImage(30, 5, logo);
        pageModifier.endContext().writePage();
      }
      pdfWriter.end();
      resolve("pdf file modified");
      // return
    } catch (exception) {
      reject(`[ Pdf Modification Failed ] || ${exception}`);
    }
  });
});
