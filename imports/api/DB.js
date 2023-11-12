import {Mongo} from "meteor/mongo";

const FirstEmployeeCollection = new Mongo.Collection("firstEmployeeCollection");
const FirstAttendanceCollection = new Mongo.Collection(
    "firstAttendanceCollection"
);
const EmployeeCollection = new Mongo.Collection("employeeCollection");
const GoalCollection = new Mongo.Collection("goalCollection");
const AttendanceCollection = new Mongo.Collection("attendanceCollection");
const ReviewsCollection = new Mongo.Collection("reviewsCollection");
const FeedbackCollection = new Mongo.Collection("feedbackCollection");

export default {
    FirstEmployeeCollection,
    FirstAttendanceCollection,
    EmployeeCollection,
    GoalCollection,
    AttendanceCollection,
    ReviewsCollection,
    FeedbackCollection
};
