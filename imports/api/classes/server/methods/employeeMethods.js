import {Meteor} from "meteor/meteor";
import {
    employeeDataFetchFunction,
    getUniqueEmployeeCount,
    reviewsEmployeeDataFetchFunction
} from "../utilities";
import {
    EmployeeDataFetch,
    EmployeeCollection,
    EmployeeCount,
    FirstEmployeeDataFetch,
    FirstEmployeeCollection
} from "../../../common";

Meteor.methods({
    [EmployeeDataFetch]: function (query) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = EmployeeCollection;
        return employeeDataFetchFunction(collectionName, {query});
    },

    [FirstEmployeeDataFetch]: function (query) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = FirstEmployeeCollection;
        return reviewsEmployeeDataFetchFunction(collectionName, {query});
    },

    [EmployeeCount]: function () {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = EmployeeCollection;
        return getUniqueEmployeeCount(collectionName);
    }
});
