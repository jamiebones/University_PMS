import { StaffDocument } from "../../api/StaffDocument/StaffDocumentClass";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";
import { _ } from "meteor/underscore";
import { FindMax } from "../../modules/utilities";
const Jimp = require("jimp");

const getDocumentSerial = staffId => {
  return new Promise((resolve, reject) => {
    try {
      const query = {
        staffId: new RegExp("^" + staffId + "$", "i")
      };
      const staff = StaffMember.findOne(query);
      let maxSerial;
      if (!_.isEmpty(staff)) {
        maxSerial = FindMax(staff.documents, "serial");
      }
      resolve({ maxSerial, staff });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

const jimpManipulateDocuments = ({ document, serial, staffId }) => {
  return new Promise((resolve, reject) => {
    try {
      //pass a single document let's start
      //doing shit
      Jimp.read(document)
        .then(image => {
          image.resize(Jimp.AUTO, 600).quality(100);
          Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font => {
            image
              .print(font, 10, 10, `${staffId.toUpperCase()}/${serial}`)
              .getBase64Async(Jimp.MIME_PNG)
              .then(base64Image => {
                resolve(base64Image);
              });
          });
        })
        .catch(err => {
          reject(err);
          console.log(err);
        });
    } catch (error) {
      console.log(err);
    }
  });
};

const convertBase64ToBuffer = base64Image => {
  return new Promise((resolve, reject) => {
    try {
      const bufferImage = Buffer.from(
        base64Image.replace(/^data:image\/png;base64,/, ""),
        "base64"
      );

      resolve(bufferImage);
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

const saveImageInDatabase = ({ document, serial, staffId, staff }) => {
  return new Promise((resolve, reject) => {
    try {
      debugger;
      let newDocument = new StaffDocument();
      newDocument.staffId = staffId;
      newDocument.document = document;
      newDocument.dateAdded = new Date().toISOString();
      newDocument.documentSerial = serial;
      const documentId = newDocument.save();
      const docObj = {
        documentId,
        serial
      };
      staff.documents.push(docObj);
      staff.save();
      let maxSerial = (serial += 1);
      resolve(maxSerial);
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

export default (ManipulateImage = async ({ staffId, documents }) => {
  debugger;
  const { maxSerial, staff } = await getDocumentSerial(staffId);
  //loop over documents
  let serial = maxSerial + 1;
  let documentSaved = 0;
  for (let documentImage of documents) {
    console.log(serial);
    const imageBuffer = await convertBase64ToBuffer(documentImage);
    const base64Image = await jimpManipulateDocuments({
      document: imageBuffer,
      serial,
      staffId
    });
    await saveImageInDatabase({
      document: base64Image,
      serial,
      staffId,
      staff
    });
    serial += 1;
    documentSaved += 1;
    if (documentSaved === documents.length) {
      return `${documentSaved} saved successfully`;
    }
  }
});
