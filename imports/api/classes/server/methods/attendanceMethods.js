/* eslint-disable no-console */
import {Meteor} from "meteor/meteor";
import {
    AttendanceCollection,
    AttendanceDataFetch,
    AttendanceHoursCount,
    FirstAttendanceCollection,
    FirstAttendanceDataFetch
} from "../../../common";
import {
    attendanceDataFetchFunction,
    calculateTimeDifference,
    insightsDataFetchFunction
} from "../utilities";

Meteor.methods({
    [AttendanceDataFetch]: function (request) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = AttendanceCollection;
        const query = request.query;
        const lastbasis = request.lastbasis;
        //console.log("methods:", collectionName, query, lastbasis);
        return attendanceDataFetchFunction(collectionName, query, lastbasis);
    },

    [FirstAttendanceDataFetch]: function (query) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = FirstAttendanceCollection;
        return insightsDataFetchFunction(collectionName, {query});
    },

    [AttendanceHoursCount]: function (attendanceHours) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        return calculateTimeDifference(attendanceHours);
    }
});
