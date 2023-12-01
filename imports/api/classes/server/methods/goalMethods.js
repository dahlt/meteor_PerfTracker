import {Meteor} from "meteor/meteor";
import {
    GoalCollection,
    GoalDataFetch,
    GoalsComment,
    GoalsComplete,
    GoalsDelete,
    GoalsInsert,
    GoalsUpdate,
    GoalsUsersFetch
} from "../../../common";
import {
    goalsInsertFunction,
    goalDataFetchFunction,
    goalsUpdateFunction,
    addCommentFunction,
    deleteGoalFunction,
    getAllUserNames,
    completeGoalFunction
} from "../utilities";

Meteor.methods({
    [GoalsInsert]: function (goalData) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }
        const collectionName = GoalCollection;
        return goalsInsertFunction(collectionName, goalData);
    },

    [GoalsUsersFetch]: function () {
        return getAllUserNames();
    },

    [GoalsDelete]: function (goalId) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }
        const collectionName = GoalCollection;
        return deleteGoalFunction(collectionName, goalId);
    },

    [GoalsComplete]: function (goalId) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }
        console.log("goalCompleteMethod:", goalId);
        const collectionName = GoalCollection;
        return completeGoalFunction(collectionName, goalId);
    },

    [GoalsUpdate]: function (goalId, goalData) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = GoalCollection;
        return goalsUpdateFunction(collectionName, goalId, goalData);
    },

    [GoalsComment]: function (goalId, goalData) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = GoalCollection;
        return addCommentFunction(collectionName, goalId, goalData);
    },

    [GoalDataFetch]: function (query) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = GoalCollection;
        return goalDataFetchFunction(collectionName, {query});
    }
});
