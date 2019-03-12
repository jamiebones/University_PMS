import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import rateLimit from "../../modules/rate-limit";
import { StaffDocument } from "../../api/StaffDocument/StaffDocumentClass";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";
import { _ } from "meteor/underscore";

const findMax = (arr, key) => {
  if (arr.length) {
    let highest = 0;
    for (let i = 0; i < arr.length; i++) {
      let currentItem = arr[i][key];
      if (currentItem > highest) {
        highest = currentItem;
      }
    }
    return highest;
  }
  return 0;
};

Meteor.methods({
  "staffDocument.saveDocuments": function staffDocument(doc) {
    check(doc, Object);
    //get the staff with the staffId;
    const { staffId, documents } = doc;
    const query = {
      staffId: new RegExp("^" + staffId + "$", "i")
    };
    const staff = StaffMember.findOne(query);
    let maxSerial;
    if (!_.isEmpty(staff)) {
      maxSerial = findMax(staff.documents, "serial");
    }
    //save the documents first
    for (let i = 0; i < documents.length; i++) {
      debugger;
      const document = documents[i];
      let newDocument = new StaffDocument();
      maxSerial++;
      newDocument.staffId = staffId;
      newDocument.document = document;
      newDocument.dateAdded = new Date().toISOString();
      newDocument.documentSerial = maxSerial;
      const documentId = newDocument.save();
      console.log(documentId);
      const docObj = {
        documentId,
        serial: maxSerial
      };
      staff.documents.push(docObj);
    }
    staff.save();
  }
});
