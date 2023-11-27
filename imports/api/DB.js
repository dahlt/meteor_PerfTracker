import {Mongo} from "meteor/mongo";

const EmployeeCollection = new Mongo.Collection("employeeCollection");
const GoalCollection = new Mongo.Collection("goalCollection");
const AttendanceCollection = new Mongo.Collection("attendanceCollection");
const FeedbackCollection = new Mongo.Collection("feedbackCollection");

export default {
    EmployeeCollection,
    GoalCollection,
    AttendanceCollection,
    FeedbackCollection
};
