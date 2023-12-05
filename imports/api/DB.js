import {Mongo} from "meteor/mongo";
const UserTokensCollection = new Mongo.Collection("usersTokenCollection");
const UserHubstaffDataCollection = new Mongo.Collection(
    "usersHubstaffDataCollection"
);
const UserActivitiesCollection = new Mongo.Collection(
    "userActivitiesCollection"
);

const UserPointsCreditsCollection = new Mongo.Collection(
    "userPointsCreditsCollection"
);

const UserPayrollCollection = new Mongo.Collection("userPayrollCollection");

const UserFeedbackCollection = new Mongo.Collection("userFeedbackCollection");

const UserFeedbackFormCollection = new Mongo.Collection(
    "userFeedbackFormCollection"
);

const UserFeedbackFilesCollection = new Mongo.Collection(
    "userFeedbackFilesCollection"
);

const EmployeeCollection = new Mongo.Collection("employeeCollection");
const GoalCollection = new Mongo.Collection("goalCollection");
const AttendanceCollection = new Mongo.Collection("attendanceCollection");
const FeedbackCollection = new Mongo.Collection("feedbackCollection");

export default {
    UserTokensCollection,
    UserHubstaffDataCollection,
    UserActivitiesCollection,
    UserPointsCreditsCollection,
    UserPayrollCollection,
    UserFeedbackCollection,
    UserFeedbackFilesCollection,
    EmployeeCollection,
    GoalCollection,
    AttendanceCollection,
    FeedbackCollection,
    UserFeedbackFormCollection
};
