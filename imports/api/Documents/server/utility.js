import Documents from "../Documents";
import { _ } from "meteor/underscore";

const FindMax = (arr, key) => {
  if (arr.length) {
    let highest = 0;
    for (let i = 0; i < arr.length; i++) {
      let currentItem = arr[i][key].serial;
      if (currentItem > highest) {
        highest = currentItem;
      }
    }
    return highest;
  }
  return 0;
};

export const DocumentsInUnit = file => {
  //we have personnel documents uploaded here
  //we should have the type of document here been
  //uploaded if it is a personnel document
  const documents = Documents.find({
    "meta.unit": file.meta.unit,
    "meta.serial": { $exists: true, $ne: null },
    "meta.documentType": file.meta.documentType
  }).fetch();
  let reference = "";
  const docType = file.meta.documentType;
  if (_.isEmpty(documents)) {
    //new serial
    file.meta.serial = 1;
    reference = `${file.meta.reference}/${docType}/1`;
    file.meta.reference = reference;
  } else {
    //find the max serial here
    let maxSerial = FindMax(documents, "meta");
    file.meta.serial = maxSerial + 1;
    reference = `${file.meta.reference}/${docType}/${maxSerial + 1}`;
    file.meta.reference = reference;
  }
  file.meta.uploadedDate = new Date();
  return file;
};

export const StaffDocuments = file => {
  const staffId = file.meta.staffId.toUpperCase();
  //find the max serial here
  const documents = Documents.find({
    "meta.staffId": staffId,
    "meta.serial": { $exists: true, $ne: null }
  }).fetch();
  let reference = "";
  if (_.isEmpty(documents)) {
    //new serial
    file.meta.serial = 1;
    file.meta.staffId = staffId;
    reference = `${staffId}/1`;
    file.meta.reference = reference;
  } else {
    //find the max serial here
    let maxSerial = FindMax(documents, "meta");
    file.meta.serial = maxSerial + 1;
    file.meta.staffId = staffId;
    reference = `${staffId}/${maxSerial + 1}`;
    file.meta.reference = reference;
  }

  file.meta.uploadedDate = new Date();
  return file;
};
