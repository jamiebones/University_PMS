import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffReliefPosting } from "../../api/StaffReliefPosting/StaffReliefPostingClass";
import { GetDetailsBasedOnRole } from "../../modules/utilities";
import Notify from "../../modules/server/classes/notification";

Meteor.methods({
  "staffreliefposting.savenewRefliefPosting": function StaffPostingReliefmethod(
    reliefObject
  ) {
    check(reliefObject, Object);
    const reliefPosting = new StaffReliefPosting(reliefObject);
    //check if the Registrar is the one doing the posting
    reliefPosting.save();
    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      //posting carried out by posting officer so message is for the Director
      const newNotification = new Notify();
      newNotification.sendNotification({
        accountType: "Director",
        from: "Posting Officer SATS, Directorate of Human Resources",
        message:
          "Please, check the staff relief posting list for approval. Thank you."
      });
    }
    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      //posting carried out by posting officer so message is for the Director
      const newNotification = new Notify();
      newNotification.sendNotification({
        accountType: "Director",
        from: "Posting Officer JSE, Directorate of Human Resources",
        message:
          "Please, check the staff relief posting list for approval. Thank you."
      });
    }
    return;
  },
  "staffreliefposting.approveorcancelposting": function StaffPostingReliefmethod(
    status,
    reliefId
  ) {
    check(status, String);
    check(reliefId, String);
    const reliefPosting = StaffReliefPosting.findOne(reliefId);
    reliefPosting.status = status;
    return reliefPosting.save();
  }
});
