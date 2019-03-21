import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import rateLimit from "../../modules/rate-limit";
import { StaffDocument } from "../../api/StaffDocument/StaffDocumentClass";
import { StaffMember } from "../../api/StaffMember/StaffMemberClass";
import { _ } from "meteor/underscore";
import JimpDocumentManipulation from "../../modules/server/imageManipulation";

Meteor.methods({
  "staffDocument.saveDocuments": function staffDocument(doc) {
    check(doc, Object);
    //get the staff with the staffId;
    return JimpDocumentManipulation(doc)
      .then(result => {
        return result;
      })
      .catch(err => {
        console.log(err);
        throw new Meteor.Error(err);
      });
  }
});
