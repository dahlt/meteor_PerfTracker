import {Meteor} from "meteor/meteor";
import {
    fetchAllUserPoints,
    fetchFeedbackFormData,
    submitFeedbackFormFunction,
    usersInsertFunction
} from "../utilities";
import {
    AllUserPointsFetch,
    FeedbackFormFetch,
    FeedbackFormSubmit,
    UsersInsert
} from "../../../common";

Meteor.methods({
    [UsersInsert]: function (data) {
        usersInsertFunction(data);
    },

    [FeedbackFormSubmit]: function (feedbackData) {
        submitFeedbackFormFunction(feedbackData);
    },
    [FeedbackFormFetch]: function () {
        try {
            const data = fetchFeedbackFormData();
            return data;
        } catch (error) {
            throw new Meteor.Error(
                "api-request-error",
                "API Request Error",
                error
            );
        }
    },
    [AllUserPointsFetch]: function () {
        try {
            const data = fetchAllUserPoints();
            return data;
        } catch (error) {
            throw new Meteor.Error(
                "api-request-error",
                "API Request Error",
                error
            );
        }
    }
});
