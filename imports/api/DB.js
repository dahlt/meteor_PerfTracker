import {Mongo} from "meteor/mongo";
const UserTokensCollection = new Mongo.Collection("usersTokenCollection");
const EmployeeCollection = new Mongo.Collection("employeeCollection");
const GoalCollection = new Mongo.Collection("goalCollection");
const AttendanceCollection = new Mongo.Collection("attendanceCollection");
const FeedbackCollection = new Mongo.Collection("feedbackCollection");

export default {
    UserTokensCollection,
    EmployeeCollection,
    GoalCollection,
    AttendanceCollection,
    FeedbackCollection
};
