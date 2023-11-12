import { Meteor } from "meteor/meteor";
import {
    FeedbackCollection,
    FeedbackDataFetch
} from "../../../common";
import {
    feedbackDataFetchFunction
} from "../utilities";

Meteor.methods({
    [FeedbackDataFetch]: function (query) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = FeedbackCollection;
        return feedbackDataFetchFunction(collectionName, { query });
    }
});
