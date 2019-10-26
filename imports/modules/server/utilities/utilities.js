import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { _ } from "meteor/underscore";
import Documents from "../../../api/Documents/Documents";
import { FindMax } from "../../../modules/utilities";

export const __GetReference = staffId => {
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

export const __GetStaffDetails = staffId => {
  const staff = StaffMembers.findOne({ staffId: staffId });
  if (!_.isEmpty(staff)) {
    return staff;
  }
  return undefined;
};

export const __WriteDocumentToCollection = (pdf, staffId, letterName) => {
  //dosen't exist we move on here
  let meta = {};
  const documents = Documents.find({
    "meta.staffId": staffId,
    "meta.serial": { $exists: true, $ne: null }
  }).fetch();
  if (_.isEmpty(documents)) {
    meta.staffId = staffId;
    meta.serial = 1;
    meta.reference = `${staffId}/1`;
  } else {
    let maxSerial = FindMax(documents, "meta");
    meta.staffId = staffId;
    meta.serial = maxSerial + 1;
    meta.reference = `${staffId}/${maxSerial + 1}`;
  }
  //write the letter here using the documents collection
  return Documents.WriteDocumentToCollection(
    pdf,
    meta,
    letterName,
    "application/pdf"
  );
};
