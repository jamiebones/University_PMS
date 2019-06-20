import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Cadre } from "../Cadre/CadreClass";
import { _ } from "meteor/underscore";

Meteor.methods({
  "cadre.savenewCadre": function CadreMethods(
    cadreRankArray,
    cadre,
    startEdit,
    cadreId
  ) {
    check(cadreRankArray, Array);
    check(cadre, String);
    check(startEdit, Boolean);
    check(cadreId, Match.OneOf(String, null, undefined));

    if (!startEdit) {
      //we are saving a new cadre;
      //check if we have that cadre
      const checkCadre = Cadre.findOne({ cadre: cadre });
      if (!_.isEmpty(checkCadre)) {
        throw new Meteor.Error(`${cadre} already in the system`);
      }
      const newCadre = new Cadre();
      newCadre.cadre = cadre;
      newCadre.cadreRank = cadreRankArray;
      return newCadre.save();
    } else {
      //we are editing a cadre.
      const editCadre = Cadre.findOne(cadreId);
      if (!_.isEmpty(editCadre)) {
        editCadre.cadre = cadre;
        editCadre.cadreRank = cadreRankArray;
        return editCadre.save();
      }
    }
  }
});
