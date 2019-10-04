import pdf from "html-pdf";
import fs from "fs";

const __getBase64String = (path, notToString) => {
  return new Promise((resolve, reject) => {
    try {
      const file = fs.readFileSync(path);
      if (notToString) {
        resolve(new Buffer(file));
      } else {
        resolve(new Buffer(file).toString("base64"));
      }
    } catch (exception) {
      reject(`[Get Base64 String] || ${exception}`);
    }
  });
};

const GeneratePDF = (html, fileName, orientation, format, notToString) => {
  return new Promise((resolve, reject) => {
    try {
      pdf
        .create(html, {
          format: format,
          border: {
            top: "0.2in",
            right: "0.6in",
            bottom: "0.2in",
            left: "0.6in"
          },
          orientation: orientation,
          timeout: 60000
        })
        .toFile(`./tmp/${fileName}`, (error, response) => {
          if (error) reject(error);
          if (response) {
            resolve(__getBase64String(response.filename, notToString));
            fs.unlink(response.filename, () => {});
          }
        });
    } catch (exception) {
      reject(exception);
      console.log(`Pdf Generation error: ${error}`);
    }
  });
};

export { GeneratePDF };
