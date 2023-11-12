import { Meteor } from "meteor/meteor";
import { usersInsertFunction } from "../utilities";
import { UsersInsert } from "../../../common";

Meteor.methods({
    [UsersInsert]: function (data) {
        usersInsertFunction(data);
    }
});
