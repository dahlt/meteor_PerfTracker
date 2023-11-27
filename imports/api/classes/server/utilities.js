/* eslint-disable no-console */
import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import RedisVent from "../server/RedisVent";
import DB from "../../DB";
import moment from "moment";
import {ObjectId} from "mongodb";

export const usersInsertFunction = function (data) {
    const existingUser = Meteor.users.findOne({
        "emails.address": data.email
    });

    if (!existingUser) {
        // Create the user with the verification code
        const userId = Accounts.createUser({
            profile: {name: `${data.name}`},
            email: `${data.email}`,
            password: `${data.password}`
        });

        Accounts.emailTemplates.siteName = "PerfTracker";
        Accounts.emailTemplates.from =
            "Performance Tracker App <accounts@example.com>";

        Accounts.emailTemplates.verifyEmail = {
            subject() {
                return "Activate your account now!";
            },
            text(user, url) {
                return `Hello! Verify your e-mail by following this link: ${url} Thank you!`;
            }
        };

        // Send the verification email
        Accounts.sendVerificationEmail(userId, data.email, {userId});
    } else {
        console.log("User already exists");
    }
};

export const getUniqueEmployeeCount = function (collectionName) {
    const collection = DB[collectionName];
    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    const distinctNames = collection.rawCollection().distinct("fullName");
    return distinctNames
        .then((result) => {
            const count = result.length;
            //console.log(count);
            return count;
        })
        .catch((error) => {
            // console.log("Error fetching unique employee count:", error);
            throw error;
        });
};

export const goalsInsertFunction = function (collectionName, goalData) {
    const collection = DB[collectionName];

    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    try {
        const sanitizedName = goalData.owner
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "");

        const formattedCreatedAt = moment(goalData.startDate).format(
            "YYYYMMDD"
        );

        const goalDetails = {
            userId: goalData.userId,
            owner: goalData.owner,
            title: goalData.title,
            progress: goalData.progress,
            startDate: goalData.startDate,
            comments: [],
            completionDate: goalData.completionDate,
            createdAt: goalData.createdAt,
            index1: `${sanitizedName}${formattedCreatedAt}`
        };

        // Calculate status based on progress and completion date
        goalDetails.status = calculateStatus(
            goalDetails.progress,
            goalDetails.completionDate
        );

        const userId = goalData.userId;
        // console.log(userId);
        RedisVent.Goals.triggerInsert("goals", userId, {
            goalDetails: goalDetails
        });

        collection.rawCollection().insertOne(goalDetails);
    } catch (error) {
        // console.error(error);
    }
};

export const deleteGoalFunction = function (collectionName, goalId) {
    const collection = DB[collectionName];

    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    // Convert goalId to ObjectId if it's a string
    if (typeof goalId === "string") {
        goalId = new ObjectId(goalId);
    }

    try {
        collection.rawCollection().deleteOne({_id: goalId});
    } catch (error) {
        // console.error(error);
        throw new Meteor.Error("Error deleting goal.");
    }
};

export const addCommentFunction = function (
    collectionName,
    {goalId, commentor, message}
) {
    const collection = DB[collectionName];

    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    // Convert goalId to ObjectId if it's a string
    if (typeof goalId === "string") {
        goalId = new ObjectId(goalId);
    }

    try {
        collection.rawCollection().updateOne(
            {_id: goalId},
            {
                $push: {
                    comments: {
                        commentor: commentor,
                        message: message
                    }
                }
            }
        );

        // console.log("commentor:", commentor);
        // console.log("message:", message);
    } catch (error) {
        // console.error(error);
        throw new Meteor.Error("Error adding comment to goal.");
    }
};

// eslint-disable-next-line func-style
function calculateStatus(progress, completionDate) {
    const daysLeft = moment(completionDate).diff(moment(), "days");

    if (daysLeft <= 3 && progress < 50) {
        return "At Risk";
    } else if (daysLeft <= 7 && progress < 50) {
        return "Behind";
    } else {
        return "On Track";
    }
}

export const goalsUpdateFunction = function (
    collectionName,
    {goalId, goalData}
) {
    const collection = DB[collectionName];

    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    // Convert goalId to ObjectId if it's a string
    if (typeof goalId === "string") {
        goalId = new ObjectId(goalId);
    }

    // console.log("goalData:", goalData); // Check if goalData is logged correctly
    // console.log("goalId: ", goalId);

    try {
        const updatedGoal = {
            $set: {
                title: goalData?.title,
                progress: goalData?.progress,
                startDate: goalData?.startDate,
                completionDate: goalData?.completionDate
            }
        };

        // Calculate status based on progress and completion date
        updatedGoal.$set.status = calculateStatus(
            goalData.progress,
            goalData.completionDate
        );

        collection.rawCollection().updateOne({_id: goalId}, updatedGoal);
    } catch (error) {
        // console.error(error);
        throw new Meteor.Error("Error updating goal data.");
    }
};

export const goalDataFetchFunction = function (collectionName, query = {}) {
    const collection = DB[collectionName];
    if (!collection) {
        throw new Error(`Collection '${collectionName}' not found.`);
    }

    const data = collection.find(query).fetch();
    //console.log("data:", data);
    return data;
};

export const insightsDataFetchFunction = function (collectionName, query = {}) {
    const collection = DB[collectionName];
    if (!collection) {
        throw new Error(`Collection '${collectionName}' not found.`);
    }

    const data = collection.find(query).fetch();
    //console.log("data:", data);
    return data;
};

export const reviewsEmployeeDataFetchFunction = function (
    collectionName,
    query = {}
) {
    const collection = DB[collectionName];
    if (!collection) {
        throw new Error(`Collection '${collectionName}' not found.`);
    }
    const data = collection.find(query).fetch();
    // console.log(data);
    return data;
};

export const employeeDataFetchFunction = function (
    collectionName,
    query = {},
    limit = 1
) {
    const username = Meteor.user().profile;

    const removeSpecialCharacters = (str) => {
        return str
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "")
            .toLowerCase();
    };

    const collection = DB[collectionName];
    if (!collection) {
        throw new Error(`Collection '${collectionName}' not found.`);
    }

    if (collection.find(query).fetch().length) {
        const pipeline = [];
        const match = {index1: {$regex: removeSpecialCharacters(username)}};

        pipeline.push({$match: match});
        pipeline.push({$limit: limit});

        return collection
            .rawCollection()
            .aggregate(pipeline)
            .toArray()
            .then((result) => {
                const values = {};
                if (result?.length) {
                    values.data = result.map((item) => ({
                        ...item,
                        _id: item._id.toString()
                    }));
                }

                //console.log(values);
                return values;
            })
            .catch((err) => {
                // console.log(err);
                return err;
            });
    }
};

export const attendanceDataFetchFunction = function (
    collectionName,
    query = {},
    lastbasis = null,
    limit = 50
) {
    const username = Meteor.user().profile;
    console.log("Name", username);

    const collection = DB[collectionName];

    const removeSpecialCharacters = (str) => {
        return str
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "")
            .toLowerCase();
    };

    if (!collection) {
        throw new Error(`Collection '${collectionName}' not found.`);
    }

    if (collection.find(query).fetch().length) {
        const pipeline = [];
        const match = {index1: {$regex: removeSpecialCharacters(username)}};

        if (lastbasis) match.index1.$lt = lastbasis;
        pipeline.push({$match: match});
        pipeline.push({$sort: {index1: -1}});
        pipeline.push({$limit: limit});

        return collection
            .rawCollection()
            .aggregate(pipeline)
            .toArray()
            .then((result) => {
                const values = {};
                if (result?.length) {
                    values.data = result.map((item) => ({
                        ...item,
                        _id: item._id.toString()
                    }));

                    values.lastbasis = result[result.length - 1].index1;
                }

                //console.log(values);
                return values;
            })
            .catch((err) => {
                // console.log(err);
                return err;
            });
    }
};

// eslint-disable-next-line func-style
export function calculateTimeDifference(attendanceHours) {
    const loggedInTime = attendanceHours.loggedInTime;
    const loggedOutTime = attendanceHours.loggedOutTime;
    //console.log(loggedInTime, loggedOutTime);

    // Convert the time strings into Moment objects.
    const loggedInTimeMoment = moment(loggedInTime, "HH:mm:ss");
    const loggedOutTimeMoment = moment(loggedOutTime, "HH:mm:ss");
    //console.log(loggedInTimeMoment, loggedOutTimeMoment);

    // Calculate the difference between the two times.
    const timeDifference = loggedOutTimeMoment - loggedInTimeMoment;

    const timeDifferenceInMoment = moment(timeDifference);

    const hours = Math.floor(timeDifferenceInMoment.valueOf() / 3600000);
    const minutes = Math.floor(
        (timeDifferenceInMoment.valueOf() % 3600000) / 60000
    );

    //console.log(hours, minutes);

    // Return the hours and minutes.
    return {hours, minutes};
}

// eslint-disable-next-line consistent-return
export const reviewsDataFetchFunction = function (
    collectionName,
    query = {},
    lastbasis = null,
    limit = 5
) {
    const collection = DB[collectionName];
    if (!collection) {
        throw new Error(`Collection '${collectionName}' not found.`);
    }

    if (collection.find(query).fetch().length) {
        //console.log(lastbasis);
        const pipeline = [];
        const match = {index1: {$regex: ""}};

        if (lastbasis) match.index1.$lt = lastbasis;
        pipeline.push({$match: match});
        pipeline.push({$sort: {index1: -1}});
        pipeline.push({$limit: limit});

        return collection
            .rawCollection()
            .aggregate(pipeline)
            .toArray()
            .then((result) => {
                const values = {};
                if (result?.length) {
                    values.data = result.map((item) => ({
                        ...item,
                        _id: item._id.toString()
                    }));

                    values.lastbasis = result[result.length - 1].index1;
                }

                //console.log(values);
                return values;
            })
            .catch((err) => {
                // console.log(err);
                return err;
            });
    }
};

export const reviewInsertFunction = function (collectionName, reviewData) {
    //console.log(reviewData);
    try {
        const collection = DB[collectionName];
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found.`);
        }

        collection.createIndex({index1: 1});

        const removeSpecialCharacters = (str) => {
            return str
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "")
                .toLowerCase();
        };

        const feeder = () => {
            let senderId, receiverId;

            // Extract senderId and receiverId from reviewData
            senderId = new ObjectId(reviewData.senderId);
            receiverId = new ObjectId(reviewData.receiverId);

            // console.log("Sender ID:", senderId);
            // console.log("Receiver ID:", receiverId);

            const sender = DB.FirstEmployeeCollection.findOne({_id: senderId});
            const receiver = DB.FirstEmployeeCollection.findOne({
                _id: receiverId
            });

            // console.log("Sender:", sender);
            // console.log("Receiver:", receiver);

            if (!sender || !receiver) {
                throw new Error("Sender or receiver not found.");
            }

            const comments = [];

            const data = {
                senderId: senderId,
                receiverId: receiverId,
                sender: sender.fullname,
                receiver: receiver.fullname,
                senderProfilePicture: sender.profilePicture,
                receiverProfilePicture: receiver.profilePicture,
                likesCount: 0,
                comments: comments,
                reviewMessage: reviewData.reviewMessage,
                createdAt: moment().toDate(),
                index1: `${removeSpecialCharacters(
                    sender.fullname
                )}${removeSpecialCharacters(
                    receiver.fullname
                )}${moment().format("YYYYMMDDHHmm")}`,
                type: reviewData.type
            };

            // Update reviews array for sender

            DB.FirstEmployeeCollection.rawCollection().updateOne(
                {_id: senderId},
                {$inc: {"reviews.0.sent": 1}}
            );

            // Update reviews array for receiver

            DB.FirstEmployeeCollection.rawCollection().updateOne(
                {_id: receiverId},
                {$inc: {"reviews.1.received": 1}}
            );

            return data;
        };

        const data = feeder();
        //console.log("Data:", data);
        collection.rawCollection().insertOne(data);
    } catch (error) {
        // console.error("Error:", error);
    }
};

export const addReviewCommentFunction = function (
    collectionName,
    {reviewId, commentor, message}
) {
    const collection = DB[collectionName];

    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    // Convert goalId to ObjectId if it's a string
    if (typeof reviewId === "string") {
        reviewId = new ObjectId(reviewId);
    }

    try {
        collection.rawCollection().updateOne(
            {_id: reviewId},
            {
                $push: {
                    comments: {
                        commentor: commentor,
                        message: message
                    }
                }
            }
        );

        // console.log("commentor:", commentor);
        // console.log("message:", message);
    } catch (error) {
        // console.error(error);
        throw new Meteor.Error("Error adding comment to review.");
    }
};

export const incrementLikesCount = function (collectionName, reviewId) {
    const collection = DB[collectionName];

    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    // Convert reviewId to Mongo.ObjectID if it's a string
    if (typeof reviewId === "string") {
        reviewId = new Mongo.ObjectID(reviewId);
    }

    try {
        collection.update({_id: reviewId}, {$inc: {likesCount: 1}});

        // console.log("Likes count incremented successfully:", reviewId);
    } catch (error) {
        // console.error(error);
        throw new Meteor.Error("Error incrementing likes count.");
    }
};

export const decrementLikesCount = function (collectionName, reviewId) {
    const collection = DB[collectionName];

    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    // Convert reviewId to Mongo.ObjectID if it's a string
    if (typeof reviewId === "string") {
        reviewId = new Mongo.ObjectID(reviewId);
    }

    try {
        collection.update({_id: reviewId}, {$inc: {likesCount: -1}});

        // console.log("Likes count decremented successfully:", reviewId);
    } catch (error) {
        // console.error(error);
        throw new Meteor.Error("Error decrementing likes count.");
    }
};

export const feedbackDataFetchFunction = function (collectionName) {
    const collection = DB[collectionName];
    const loggedUser = Meteor.user().profile;

    const removeSpecialCharacters = (str) => {
        return str
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "")
            .toLowerCase();
    };
    if (!collection) {
        throw new Error(`Collection '${collectionName}' not found.`);
    }
    //console.log(lastbasis);
    const pipeline = [];
    const match = {index1: {$regex: removeSpecialCharacters(loggedUser)}};
    pipeline.push({$match: match});
    return collection
        .rawCollection()
        .aggregate(pipeline)
        .toArray()
        .then((result) => {
            const values = {};
            if (result?.length) {
                values.data = result.map((item) => ({
                    ...item,
                    _id: item._id.toString()
                }));
            }
            //console.log(values);
            return values;
        })
        .catch((err) => {
            // console.log(err);
            return err;
        });
};
