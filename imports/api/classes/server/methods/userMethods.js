import {Meteor} from "meteor/meteor";
import {
    fetchFeedbackFormData,
    submitFeedbackFormFunction,
    usersInsertFunction
} from "../utilities";
import {
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
    }
});
