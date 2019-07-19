import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Cadre } from "../Cadre/CadreClass";
import {
  Designations,
  Designation
} from "../../api/Designation/DesignationClass";
import { SearchArray } from "../../modules/utilities";
import { _ } from "meteor/underscore";

Meteor.methods({
  "cadre.savenewCadre": function CadreMethods(
    cadreRankArray,
    cadre,
    startEdit,
    cadreId,
    cadreType
  ) {
    check(cadreRankArray, Array);
    check(cadre, String);
    check(startEdit, Boolean);
    check(cadreId, Match.OneOf(String, null, undefined));
    check(cadreType, Match.OneOf(String, null, undefined));

    if (!startEdit) {
      //we are saving a new cadre;
      //check if we have that cadre
      const checkCadre = Cadre.findOne({ cadre: cadre });
      if (!_.isEmpty(checkCadre)) {
        throw new Meteor.Error(`${cadre} already in the system`);
      }
      const newCadre = new Cadre();
      newCadre.cadre = cadre;
      newCadre.cadreType = cadreType;
      newCadre.cadreRank = cadreRankArray;
      newCadre.save();
    } else {
      //we are editing a cadre.
      const editCadre = Cadre.findOne(cadreId);
      if (!_.isEmpty(editCadre)) {
        editCadre.cadre = cadre;
        editCadre.cadreType = cadreType;
        editCadre.cadreRank = cadreRankArray;
        editCadre.save();
      }
    }
    //let's upadte the designation table
    const designations = Designations.find({}).fetch();
    cadreRankArray.map(rankArray => {
      const { rank } = rankArray;
      const isMatch = SearchArray(rank, designations, "rank");
      console.log(`${isMatch} || ${rank}`);
      if (isMatch == -1) {
        //it is not saved yet
        const newDesignation = new Designation({
          rank: rank,
          type: cadreType
        });
        newDesignation.save();
      }
    });
    return;
  }
});
