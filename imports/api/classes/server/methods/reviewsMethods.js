import { Meteor } from "meteor/meteor";
import {
    ReviewsCollection,
    ReviewDataFetch,
    ReviewsInsert,
    ReviewsComment,
    ReviewsLikes,
    ReviewsDislikes
} from "../../../common";

import {
    addReviewCommentFunction,
    decrementLikesCount,
    incrementLikesCount,
    reviewInsertFunction,
    reviewsDataFetchFunction
} from "../utilities";

Meteor.methods({
    [ReviewDataFetch]: function (request) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = ReviewsCollection;
        const query = request.query;
        const lastbasis = request.lastbasis;
        //console.log("method call: ", query, lastbasis);
        return reviewsDataFetchFunction(collectionName, query, lastbasis);
    },

    [ReviewsInsert]: function (reviewData) {
        //console.log("method called", reviewData);
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = ReviewsCollection;
        return reviewInsertFunction(collectionName, reviewData);
    },

    [ReviewsComment]: function (reviewId, reviewData) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = ReviewsCollection;
        return addReviewCommentFunction(collectionName, reviewId, reviewData);
    },

    [ReviewsLikes]: function (reviewId) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = ReviewsCollection;
        return incrementLikesCount(collectionName, reviewId);
    },

    [ReviewsDislikes]: function (reviewId) {
        if (!this.userId) {
            // console.log("userId", this.userId);
            throw new Meteor.Error("Not authorized.");
        }

        const collectionName = ReviewsCollection;
        return decrementLikesCount(collectionName, reviewId);
    }
});
