/* eslint-disable consistent-return */
/* eslint-disable no-inner-declarations */
/* eslint-disable func-style */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable indent-legacy */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import RedisVent from "../server/RedisVent";
import DB from "../../DB";
import fetch from "node-fetch";
import moment from "moment";
import {ObjectId} from "mongodb";

export const usersInsertFunction = function (data) {
    const existingUser = Meteor.users.findOne({
        "emails.address": data.email
    });

    if (!existingUser) {
        const adminPassword = Meteor.settings.adminPassword;

        // Create the user with the verification code
        const userId = Accounts.createUser({
            profile: {
                name: `${data.name}`,
                isAdmin: adminPassword === data.password ? true : false
            },
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

export const getAllUserNamesWithIds = function () {
    // Fetch all users from the database
    const users = Meteor.users.find({}, {fields: {profile: 1}}).fetch();

    // Extract names and userIds from the user profiles
    const userNamesWithIds = users.map((user) => ({
        userId: user._id,
        name: user.profile && user.profile.name
    }));

    // Filter out entries with undefined or null names
    const validUserNamesWithIds = userNamesWithIds.filter(
        (entry) => entry.name
    );

    return validUserNamesWithIds;
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

    //console.log("goalData", goalData);

    try {
        // Concatenate names of all owners into a single string

        const owners = goalData.owner.map((dataItem) => {
            return dataItem.value;
        });

        //console.log("owners:", owners);
        const sanitizedOwnersString = owners
            .map((owner) => owner.trim()) // Trim names
            .join("-"); // You can use any separator you prefer

        const formattedCreatedAt = moment(goalData.startDate).format(
            "YYYYMMDD"
        );

        //console.log("sanitizedOwnersString", sanitizedOwnersString);

        const goalDetails = {
            userId: goalData.userId,
            owner: sanitizedOwnersString,
            title: goalData.title,
            description: goalData.description,
            difficulty: goalData.difficulty,
            progress: goalData.progress,
            points: 0,
            startDate: goalData.startDate,
            comments: [],
            completionDate: goalData.completionDate,
            createdAt: formattedCreatedAt,
            index1: `${sanitizedOwnersString}${formattedCreatedAt}`
        };

        // Calculate status based on progress and completion date
        goalDetails.status = calculateStatus(
            goalDetails.progress,
            goalDetails.completionDate
        );

        //console.log("goalDetails", goalDetails);

        // const userId = goalData.userId;
        // RedisVent.Goals.triggerInsert("goals", userId, {
        //     goalDetails: goalDetails
        // });

        collection.rawCollection().insertOne(goalDetails);
    } catch (error) {
        // Handle error
        console.error(error);
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

export const completeGoalFunction = async (collectionName, goalId) => {
    const collection = DB[collectionName];

    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    // Convert goalId to ObjectId if it's a string
    if (typeof goalId === "string") {
        goalId = new ObjectId(goalId);
    }

    try {
        const selectedGoal = await collection
            .rawCollection()
            .findOne({_id: goalId});

        console.log("selectedGoal", selectedGoal);

        const selectedGoalUserID = selectedGoal.userId;

        const completedGoalDifficulty = selectedGoal.difficulty.value;

        //console.log("completedGoalDifficulty:", completedGoalDifficulty);

        let points = 0;

        if (completedGoalDifficulty === "Easy") {
            points += 15;
        } else if (completedGoalDifficulty === "Normal") {
            points += 30;
        } else if (completedGoalDifficulty === "Hard") {
            points += 50;
        }

        const updatedGoal = {
            $set: {
                status: "Completed",
                progress: "100",
                points: points
            }
        };

        collection.rawCollection().updateOne({_id: goalId}, updatedGoal);

        calculatePointsSummary(selectedGoalUserID);

        //console.log("selectedGoal2:", selectedGoal);
    } catch (error) {
        console.error(error);
        throw new Meteor.Error("Error completing goal.");
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

export const goalsUpdateFunction = async (
    collectionName,
    {goalId, goalData}
) => {
    const collection = DB[collectionName];

    if (!collection) {
        throw new Error(`Invalid collection name: ${collectionName}`);
    }

    // Convert goalId to ObjectId if it's a string
    if (typeof goalId === "string") {
        goalId = new ObjectId(goalId);
    }

    //console.log("goalData:", goalData); // Check if goalData is logged correctly
    //console.log("goalId: ", goalId);

    const selectedGoal = await collection
        .rawCollection()
        .findOne({_id: goalId});

    const selectedGoalUserID = selectedGoal.userId;

    try {
        const owners = goalData?.owner.map((dataItem) => {
            return dataItem.value;
        });

        //console.log("owners:", owners);
        const sanitizedOwnersString = owners
            .map((owner) => owner.trim()) // Trim names
            .join("-"); // You can use any separator you prefer

        const updatedGoal = {
            $set: {
                owner: sanitizedOwnersString,
                title: goalData?.title,
                description: goalData?.description,
                difficulty: goalData?.difficulty,
                points: 0,
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

        calculatePointsSummary(selectedGoalUserID);
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
    console.log("Data", username);

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

export const fetchUserAccessToken = async (userId) => {
    try {
        const userData = DB.UserTokensCollection.find({
            userId: userId
        }).fetch();

        if (userData.length > 0) {
            const accessToken = userData[0].tokenData.access_token;
            //console.log(accessToken);
            return accessToken;
        } else {
            console.log("User data not found.");
            return null;
        }
    } catch (error) {
        throw new Error("Access Token Fetch Error:", error);
    }
};

export const fetchOrganizationID = async (accessToken) => {
    try {
        const userId = Meteor.user();
        //console.log(accessToken);

        console.log("userId", userId);

        // Check if the cached organization ID exists and is still valid
        const cachedOrganization = DB.UserTokensCollection.findOne({
            userId: userId
        });

        //console.log("cachedOrganization", cachedOrganization);

        if (cachedOrganization && cachedOrganization.expiry > new Date()) {
            return cachedOrganization.organizationID;
        } else {
            // If not found or expired, make the API request
            const url = "https://api.hubstaff.com/v2/organizations";
            //console.log("url", url);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            //console.log("response", response);
            const data = await response.json();
            const organizationID = data.organizations[0].id;

            // Calculate the expiry timestamp (1 week from now)
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);

            // Update or insert the cached organization ID in the collection with the expiry timestamp
            DB.UserTokensCollection.upsert(
                {userId: userId},
                {
                    $set: {
                        userId: userId,
                        organizationID,
                        expiry
                    }
                }
            );

            return organizationID;
        }
    } catch (error) {
        console.error("API Request Error:", error);
        throw new Error("API Request Error:", error);
    }
};

export const fetchProjectName = async (accessToken) => {
    try {
        const userId = Meteor.userId(); // Use Meteor.userId() to get the current user's ID

        // Check if the cached project name exists and is still valid
        const cachedProject = DB.UserTokensCollection.findOne({
            userId: userId
        });

        if (cachedProject && cachedProject.projectExpiry > new Date()) {
            return cachedProject.projectName;
        } else {
            const organizationId = await fetchOrganizationID(accessToken); // Use the cached organization ID

            // Make the API request using the cached organization ID
            const url = `https://api.hubstaff.com/v2/organizations/${organizationId}/projects`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const data = await response.json();

            const projectName = data.projects[0].name;

            // Calculate the expiry timestamp (1 week from now)
            const projectExpiry = new Date();
            projectExpiry.setDate(projectExpiry.getDate() + 7);

            // Update or insert the cached project name in the collection with the expiry timestamp
            DB.UserTokensCollection.upsert(
                {userId: userId},
                {
                    $set: {
                        userId: userId,
                        projectName: projectName,
                        projectExpiry: projectExpiry
                    }
                }
            );

            return projectName;
        }
    } catch (error) {
        throw new Error("API Request Error: " + error.message);
    }
};

function secondsToHoursMinutes(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60; // Calculate remaining seconds
    return `${hours}:${minutes}:${remainingSeconds}`; // Include seconds
}

function convertToPHTime(utcTime) {
    const utcDate = new Date(utcTime);
    const phTime = new Date(
        utcDate.toLocaleString("en-US", {timeZone: "Asia/Manila"})
    );
    return phTime.toLocaleString();
}

function calculatePercentage(overall, tracked) {
    return Math.round((overall / tracked) * 100) + "%";
}

// Function to format date as "Mon, Aug 25"
const formatToDayMonthDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = {weekday: "short", month: "short", day: "numeric"};
    return date.toLocaleDateString("en-US", options);
};

// Function to format time as "hh:mm AM/PM"
const formatToHourMinuteTime = (inputTime) => {
    const time = new Date(inputTime);
    const options = {hour: "numeric", minute: "numeric", hour12: true};
    return time.toLocaleTimeString("en-US", options);
};

export const calculateSummary = (data) => {
    // Get the originalDate from the first and last items in the data array
    //console.log("data", data);
    const startDate = data.length > 0 ? data[0].originalDate : null;
    const endDate = data.length > 0 ? data[data.length - 1].originalDate : null;

    // Convert tracked time to total seconds and calculate the total tracked time
    //console.log("calculateSummaryData", data);
    const totalTrackedSeconds = data.reduce((acc, activity) => {
        const [hours, minutes, seconds] = activity.tracked
            .split(":")
            .map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
    }, 0);
    const totalTrackedHoursMinutes = secondsToHoursMinutes(totalTrackedSeconds);

    // Calculate the average overall percentage
    const totalOverallPercentage = data.reduce(
        (acc, activity) => acc + parseFloat(activity.overall),
        0
    );
    const averageOverallPercentage = totalOverallPercentage / data.length;

    // Calculate the average of all tracked times
    // Calculate the average of all tracked times
    const averageTrackedSeconds = totalTrackedSeconds / data.length;

    // Round down to the nearest whole number of seconds
    const roundedAverageTrackedSeconds = Math.floor(averageTrackedSeconds);

    // Convert the rounded average tracked time to hours, minutes, and seconds
    const averageTrackedHoursMinutes = secondsToHoursMinutes(
        roundedAverageTrackedSeconds
    );

    // Calculate the difference from 45 hours
    let durationComparisonTotalSeconds = totalTrackedSeconds - 45 * 3600;

    // Handle negative duration separately
    let durationComparisonSign = "";
    let durationComparisonHours = 0;
    let durationComparisonMinutes = 0;
    let durationComparisonSeconds = 0;

    if (durationComparisonTotalSeconds < 0) {
        durationComparisonSign = "-";
        durationComparisonTotalSeconds = Math.abs(
            durationComparisonTotalSeconds
        );
    }

    // Convert durationComparison to hours, minutes, and seconds
    durationComparisonHours = Math.floor(durationComparisonTotalSeconds / 3600);
    durationComparisonMinutes = Math.floor(
        (durationComparisonTotalSeconds % 3600) / 60
    );
    durationComparisonSeconds = durationComparisonTotalSeconds % 60;

    //console.log("totalTrackedHoursMinutes", totalTrackedHoursMinutes);
    //console.log("averageTrackedHoursMinutes", averageTrackedHoursMinutes);

    //console.log("averageOverallPercentage", averageOverallPercentage);
    return {
        totalTracked: totalTrackedHoursMinutes,
        averageTracked: averageTrackedHoursMinutes,
        averageOverallPercentage: averageOverallPercentage.toFixed(2) + "%", // Convert to percentage
        startDate: startDate,
        endDate: endDate,
        durationComparison: `${durationComparisonSign}${durationComparisonHours}:${durationComparisonMinutes}:${durationComparisonSeconds}` // Include seconds
    };
};

export const calculatePointsSummary = (userId) => {
    const existingUserData = DB.UserActivitiesCollection.find(
        {userId: userId} // Match the userId
    ).fetch();

    const existingGoalData = DB.GoalCollection.find(
        {userId: userId} // Match the userId
    ).fetch();

    // console.log("existingGoalData:", existingGoalData);

    // const GoalOwnersUserId = existingGoalData.map((dataItem) => {
    //     const ownerNames = dataItem.owner.split("-");
    //     console.log("ownerNames", ownerNames);

    //     const ownerId = ownerNames.map((name, index) => {
    //         const data = Meteor.users.findOne({"profile.name": name});
    //         return data._id;
    //     });

    //     return ownerId;
    // });

    // console.log("GoalsOwnersUserId", GoalOwnersUserId);

    // Extract points from UserActivitiesCollection
    const userActivityPointsArray = existingUserData.map((dataItem) => {
        return dataItem.points;
    });

    // Extract points from GoalCollection
    const goalPointsArray = existingGoalData.map((goalItem) => {
        return goalItem.points;
    });

    // Combine both points arrays
    const combinedPointsArray = [
        ...userActivityPointsArray,
        ...goalPointsArray
    ];

    // Calculate the total points
    const totalPoints = combinedPointsArray.reduce(
        (total, points) => total + points,
        0
    );

    const pointsSummaryInitial = {
        userId: userId,
        totalPointsAcquired: totalPoints,
        totalCredits: 0,
        totalPointsAvailableForExchange: totalPoints
    };

    const existingData = DB.UserPointsCreditsCollection.find(
        {userId: userId} // Match the userId
    ).fetch();

    if (existingData.length > 0) {
        console.log("existingData:", existingData);

        const existingDataCopy = {...existingData[0]}; // Create a copy

        if (existingDataCopy.totalPointsAcquired === totalPoints) {
            return existingDataCopy;
        } else {
            const difference =
                totalPoints - existingDataCopy.totalPointsAcquired;
            console.log("difference:", difference);

            existingDataCopy.totalPointsAcquired += difference;
            existingDataCopy.totalPointsAvailableForExchange += difference;

            // Update the entry
            DB.UserPointsCreditsCollection.update(
                {userId: userId},
                existingDataCopy
            );

            return existingDataCopy;
        }
    } else {
        // Insert new entry
        DB.UserPointsCreditsCollection.insert(pointsSummaryInitial);
        return pointsSummaryInitial;
    }

    //console.log("Total Points:", totalPoints);
};

export const calculatePointsRankUp = (userId) => {
    const existingUserData = DB.UserPointsCreditsCollection.find(
        {},
        {sort: {totalPointsAcquired: -1}} // Sort in descending order of totalPointsAcquired
    ).fetch();

    //console.log("existingUserData:", existingUserData);

    const userIndex = existingUserData.findIndex(
        (userData) => userData.userId === userId
    );

    //console.log("userIndex:", userIndex);

    let pointsNeededToRankUp;

    if (userIndex !== 0 && userIndex < existingUserData.length) {
        const currentUserPoints =
            existingUserData[userIndex].totalPointsAcquired;
        const nextUserPoints =
            existingUserData[userIndex - 1].totalPointsAcquired;

        pointsNeededToRankUp = nextUserPoints - currentUserPoints;

        //console.log("Points needed to rank up:", pointsNeededToRankUp);

        return pointsNeededToRankUp;
    } else {
        return (pointsNeededToRankUp = 0);
    }
};

export const getPointsLeaderboard = () => {
    const existingData = DB.UserPointsCreditsCollection.find({}).fetch();

    if (!existingData) {
        console.error("No data found.");
        return;
    }

    const adminData = Meteor.users.findOne({
        "profile.isAdmin": true
    });

    // console.log("points data:", existingData);

    // console.log("adminData:", adminData);
    const existingDataNoAdmin = existingData.filter((dataItem) => {
        return dataItem.userId !== adminData._id;
    });

    const userData = existingDataNoAdmin.map((dataItem) => {
        //console.log(dataItem.userId);

        const user = Meteor.users.findOne({
            _id: dataItem.userId
        });

        const username = user.profile.name;
        //console.log(username);

        let userPoints = 0;
        if (dataItem.userId === user._id) {
            userPoints = dataItem.totalPointsAcquired;
            //console.log("userPoints", userPoints);
        }

        return {username, userPoints};
    });
    // Sort the array based on userPoints in descending order
    userData.sort((a, b) => b.userPoints - a.userPoints);

    const topThreeUsernames = userData.slice(0, 3);

    const topThreeNames = topThreeUsernames.map((dataItem) => {
        return dataItem.username;
    });

    console.log(topThreeNames);
    return topThreeNames;
};

export const exchangePointsToCredits = (userId) => {
    const existingData = DB.UserPointsCreditsCollection.findOne({
        userId: userId
    });

    if (!existingData) {
        console.error(`No data found for userId: ${userId}`);
        return;
    }

    const totalPointsAvailableForExchange =
        existingData.totalPointsAvailableForExchange;
    const exchangeRate = 100; // 100 points = 1 credit

    console.log(
        "totalPointsAvailableForExchange",
        totalPointsAvailableForExchange
    );

    // Calculate the number of credits to be added (including decimal)
    const creditsToAdd = totalPointsAvailableForExchange / exchangeRate;

    console.log("Credits to add:", creditsToAdd);

    // Update the data in the collection
    DB.UserPointsCreditsCollection.update(
        {userId: userId},
        {
            $set: {
                totalCredits: existingData.totalCredits + creditsToAdd,
                totalPointsAvailableForExchange: 0 // All points are exchanged
            }
        }
    );

    console.log("Exchange completed successfully!");
};

export const fetchActivitiesData = async (
    userId,
    startDateParam,
    endDateParam,
    maxRetries = 3
) => {
    try {
        const existingUser = Meteor.users.findOne({
            _id: userId
        });

        console.log("existingUser", existingUser);

        const isAdmin = existingUser.profile.isAdmin === true;

        console.log("isAdmin:", isAdmin);

        if (isAdmin === true) {
            const allActivitiesData = DB.UserActivitiesCollection.find(
                {}
            ).fetch();

            console.log("allActivitiesData", allActivitiesData);

            return {
                extractedData: allActivitiesData,
                summary: calculateSummary(allActivitiesData)
                // pointsSummary: calculatePointsSummary(userId)
            };
        } else {
            //console.log("startDateParam", startDateParam);
            //console.log("endDateParam", endDateParam);
            const accessToken = await fetchUserAccessToken(userId);
            //console.log("accessToken", accessToken);
            const organizationId = await fetchOrganizationID(accessToken);
            //console.log("organizationId", organizationId);
            const projectName = await fetchProjectName(accessToken);
            //console.log("projectName", projectName);

            const currentDateString = moment().format("YYYY-MM-DD");
            //console.log("currentDateStr", currentDateString);

            // Calculate the day before the current date
            const dayBeforeCurrentDate = moment()
                .subtract(2, "days")
                .format("YYYY-MM-DD");
            //console.log("dayBeforeCurrentDate", dayBeforeCurrentDate);

            // Check if data exists for the day before the current date
            const hasDataForDayBefore =
                DB.UserActivitiesCollection.find({
                    originalDate: dayBeforeCurrentDate
                }).fetch().length > 0;

            //console.log("startDateParam", startDateParam);
            //console.log("endDateParam", endDateParam);

            const startDate = moment(startDateParam).format("YYYY-MM-DD");
            const endDate = moment(endDateParam).format("YYYY-MM-DD");

            // If the current date is within the range, adjust the endDate
            let adjustedEndDate = endDate;

            if (
                startDate <= currentDateString &&
                currentDateString <= endDate
            ) {
                adjustedEndDate = moment()
                    .subtract(2, "days")
                    .format("YYYY-MM-DD");
            }

            let adjustedStartDate = startDate;

            if (adjustedEndDate < startDate) {
                const weekStart = moment(adjustedEndDate)
                    .subtract(moment(adjustedEndDate).isoWeekday() - 1, "days")
                    .startOf("day"); // Get the start of the day
                adjustedStartDate = weekStart.format("YYYY-MM-DD");
            }

            //console.log("adjustedEndDate", adjustedEndDate);
            //console.log("adjustedStartDate", adjustedStartDate);

            if (!hasDataForDayBefore) {
                const url = `https://api.hubstaff.com/v2/organizations/${organizationId}/activities/daily?date[start]=${adjustedStartDate}T00:00:00Z&date[stop]=${adjustedEndDate}T00:00:00Z&organization_id=${organizationId}`;

                let retryCount = 0;

                while (retryCount < maxRetries) {
                    try {
                        const response = await fetch(url, {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });

                        const data = await response.json();

                        const extractedData = data.daily_activities.map(
                            (activity) => {
                                const hoursWorked = activity.tracked / 3600;
                                // Calculate the difference from 9 hours
                                const expectedWorkingHours = 9;
                                const totalTrackedSeconds = activity.tracked;
                                const trackedHours = Math.floor(
                                    totalTrackedSeconds / 3600
                                );
                                const trackedMinutes = Math.floor(
                                    (totalTrackedSeconds % 3600) / 60
                                );
                                const trackedSeconds = totalTrackedSeconds % 60;

                                let durationComparisonTotalSeconds =
                                    totalTrackedSeconds -
                                    expectedWorkingHours * 3600;

                                // Handle negative duration separately
                                let durationComparisonSign = "";
                                let durationComparisonHours = 0;
                                let durationComparisonMinutes = 0;
                                let durationComparisonSeconds = 0;

                                if (durationComparisonTotalSeconds < 0) {
                                    durationComparisonSign = "-";
                                    durationComparisonTotalSeconds = Math.abs(
                                        durationComparisonTotalSeconds
                                    );
                                }

                                // Convert durationComparison to hours, minutes, and seconds
                                durationComparisonHours = Math.floor(
                                    durationComparisonTotalSeconds / 3600
                                );
                                durationComparisonMinutes = Math.floor(
                                    (durationComparisonTotalSeconds % 3600) / 60
                                );
                                durationComparisonSeconds =
                                    durationComparisonTotalSeconds % 60;

                                let points = 0;

                                const trackedHoursString =
                                    secondsToHoursMinutes(activity.tracked);

                                const overallPercString = calculatePercentage(
                                    activity.overall,
                                    activity.tracked
                                );

                                // console.log(
                                //     "trackedHoursString",
                                //     trackedHoursString
                                // );

                                console.log(
                                    "overallPercString",
                                    overallPercString
                                );

                                // Remove the '%' character and convert the remaining string to a number
                                const overallPercentage =
                                    parseFloat(overallPercString);

                                //console.log("overallPercentage", overallPercentage);

                                const trackedHoursData = parseInt(
                                    trackedHoursString.substring(0, 2),
                                    10
                                );
                                //console.log("trackedHoursData", trackedHoursData);

                                // Compare with 9 hours
                                const isTrackedTimeGreaterOrEqual =
                                    trackedHours >= 9;

                                // console.log(
                                //     "isTrackedTimeGreaterOrEqual",
                                //     isTrackedTimeGreaterOrEqual
                                // );

                                const status = activity.tracked
                                    ? "Present"
                                    : "Absent";

                                if (
                                    isTrackedTimeGreaterOrEqual === true &&
                                    status === "Present" &&
                                    overallPercentage >= 50
                                ) {
                                    points += 30;
                                } else if (
                                    isTrackedTimeGreaterOrEqual === true &&
                                    status === "Present" &&
                                    overallPercentage < 50
                                ) {
                                    points += 20;
                                } else if (
                                    isTrackedTimeGreaterOrEqual === false &&
                                    status === "Present"
                                ) {
                                    points += 10;
                                } else if (
                                    isTrackedTimeGreaterOrEqual === false &&
                                    status === "Absent"
                                ) {
                                    points += 0;
                                }

                                return {
                                    userId: userId,
                                    tracked: secondsToHoursMinutes(
                                        activity.tracked
                                    ),
                                    overall: calculatePercentage(
                                        activity.overall,
                                        activity.tracked
                                    ),
                                    originalDate: activity.date,
                                    date: formatToDayMonthDate(activity.date),
                                    projectName: projectName,
                                    status: activity.tracked
                                        ? "Present"
                                        : "Absent",
                                    durationComparison: `${durationComparisonSign}${durationComparisonHours}:${durationComparisonMinutes}:${durationComparisonSeconds}`, // Include seconds
                                    points: points,
                                    created_at: formatToHourMinuteTime(
                                        activity.created_at
                                    ), // Format time
                                    updated_at: formatToHourMinuteTime(
                                        activity.updated_at
                                    ) // Format time
                                };
                            }
                        );
                        //console.log("extractedData", extractedData);

                        // After fetching data from the API, save it to the collection
                        extractedData.forEach((dataItem) => {
                            DB.UserActivitiesCollection.insert(dataItem);
                        });

                        const summary = calculateSummary(extractedData);

                        //console.log("Summary:", summary);

                        const pointsSummary = calculatePointsSummary(userId);

                        //console.log(pointsSummary);

                        return {extractedData, summary, pointsSummary};
                    } catch (error) {
                        console.error(
                            `Attempt ${retryCount + 1} failed with error:`,
                            error
                        );
                    }
                }
            }

            // Check if data already exists in the collection for the given date range
            const existingData = DB.UserActivitiesCollection.find({
                $and: [
                    {userId: userId}, // Match the userId
                    {
                        originalDate: {
                            $gte: adjustedStartDate,
                            $lte: adjustedEndDate
                        }
                    } // Match the date range
                ]
            }).fetch();

            if (existingData.length > 0) {
                console.log(
                    "Data already exists in collection for the given date range"
                );
                //console.log("existingData:", existingData);
                return {
                    extractedData: existingData,
                    summary: calculateSummary(existingData),
                    pointsSummary: calculatePointsSummary(userId)
                };
            }

            const url = `https://api.hubstaff.com/v2/organizations/${organizationId}/activities/daily?date[start]=${adjustedStartDate}T00:00:00Z&date[stop]=${adjustedEndDate}T00:00:00Z&organization_id=${organizationId}`;

            let retryCount = 0;

            while (retryCount < maxRetries) {
                try {
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });

                    const data = await response.json();

                    const extractedData = data.daily_activities.map(
                        (activity) => {
                            const hoursWorked = activity.tracked / 3600;

                            // Calculate the difference from 9 hours
                            const expectedWorkingHours = 8;
                            const totalTrackedSeconds = activity.tracked;
                            const trackedHours = Math.floor(
                                totalTrackedSeconds / 3600
                            );
                            const trackedMinutes = Math.floor(
                                (totalTrackedSeconds % 3600) / 60
                            );
                            const trackedSeconds = totalTrackedSeconds % 60;

                            let durationComparisonTotalSeconds =
                                totalTrackedSeconds -
                                expectedWorkingHours * 3600;

                            // Handle negative duration separately
                            let durationComparisonSign = "";
                            let durationComparisonHours = 0;
                            let durationComparisonMinutes = 0;
                            let durationComparisonSeconds = 0;

                            if (durationComparisonTotalSeconds < 0) {
                                durationComparisonSign = "-";
                                durationComparisonTotalSeconds = Math.abs(
                                    durationComparisonTotalSeconds
                                );
                            }

                            // Convert durationComparison to hours, minutes, and seconds
                            durationComparisonHours = Math.floor(
                                durationComparisonTotalSeconds / 3600
                            );
                            durationComparisonMinutes = Math.floor(
                                (durationComparisonTotalSeconds % 3600) / 60
                            );
                            durationComparisonSeconds =
                                durationComparisonTotalSeconds % 60;

                            let points = 0;

                            const trackedHoursString = secondsToHoursMinutes(
                                activity.tracked
                            );

                            const overallPercString = calculatePercentage(
                                activity.overall,
                                activity.tracked
                            );

                            //console.log("trackedHoursString", trackedHoursString);

                            //console.log("overallPercString", overallPercString);

                            // Remove the '%' character and convert the remaining string to a number
                            const overallPercentage =
                                parseFloat(overallPercString);

                            //console.log("overallPercentage", overallPercentage);

                            const trackedHoursData = parseInt(
                                trackedHoursString.substring(0, 2),
                                10
                            );
                            //console.log("trackedHoursData", trackedHoursData);

                            // Compare with 9 hours
                            const isTrackedTimeGreaterOrEqual =
                                trackedHours >= 9;

                            // console.log(
                            //     "isTrackedTimeGreaterOrEqual",
                            //     isTrackedTimeGreaterOrEqual
                            // );

                            const status = activity.tracked
                                ? "Present"
                                : "Absent";

                            if (
                                isTrackedTimeGreaterOrEqual === true &&
                                status === "Present" &&
                                overallPercentage >= 50
                            ) {
                                points += 30;
                            } else if (
                                isTrackedTimeGreaterOrEqual === true &&
                                status === "Present" &&
                                overallPercentage < 50
                            ) {
                                points += 20;
                            } else if (
                                isTrackedTimeGreaterOrEqual === false &&
                                status === "Present"
                            ) {
                                points += 10;
                            } else if (
                                isTrackedTimeGreaterOrEqual === false &&
                                status === "Absent"
                            ) {
                                points += 0;
                            }

                            return {
                                userId: userId,
                                tracked: secondsToHoursMinutes(
                                    activity.tracked
                                ),
                                overall: calculatePercentage(
                                    activity.overall,
                                    activity.tracked
                                ),
                                originalDate: activity.date,
                                date: formatToDayMonthDate(activity.date),
                                projectName: projectName,
                                status: activity.tracked ? "Present" : "Absent",
                                durationComparison: `${durationComparisonSign}${durationComparisonHours}:${durationComparisonMinutes}:${durationComparisonSeconds}`, // Include seconds
                                points: points,
                                created_at: formatToHourMinuteTime(
                                    activity.created_at
                                ), // Format time
                                updated_at: formatToHourMinuteTime(
                                    activity.updated_at
                                ) // Format time
                            };
                        }
                    );
                    //console.log("extractedData", extractedData);

                    // After fetching data from the API, save it to the collection
                    extractedData.forEach((dataItem) => {
                        DB.UserActivitiesCollection.insert(dataItem);
                    });

                    const summary = calculateSummary(extractedData);

                    //console.log("Summary:", summary);

                    const pointsSummary = calculatePointsSummary(userId);

                    //console.log(pointsSummary);

                    return {extractedData, summary, pointsSummary};
                } catch (error) {
                    console.error(
                        `Attempt ${retryCount + 1} failed with error:`,
                        error
                    );
                }
            }
        }
    } catch (error) {
        console.error("API Request Error:", error);
        throw new Error("API Request Error:", error);
    }
};

export const submitFeedbackFormFunction = function (feedbackData) {
    console.log(feedbackData);
    // Extract feedback data
    const {
        bugs,
        importantFeatures,
        removeFeatures,
        preferredFeatures,
        username
    } = feedbackData;

    // Check if at least one feedback field is filled
    if (!(bugs || importantFeatures || removeFeatures || preferredFeatures)) {
        throw new Meteor.Error(
            "empty-feedback",
            "At least one feedback field must be filled."
        );
    }

    // Example: Insert feedback data into a Feedbacks collection
    const feedbackId = DB.UserFeedbackFormCollection.insert({
        bugs,
        importantFeatures,
        removeFeatures,
        preferredFeatures,
        username,
        createdAt: new Date()
    });

    // Return any relevant information
    console.log(feedbackId);
    return {feedbackId};
};

export const fetchFeedbackFormData = async () => {
    try {
        // Example: Fetch feedback data from the Feedbacks collection
        const feedbacks = DB.UserFeedbackFormCollection.find().fetch();
        console.log(feedbacks);
        return feedbacks;
    } catch (error) {
        throw new Error("Feedback Fetch Error:", error);
    }
};

export const submitFeedbackFunction = function (feedbackData) {
    console.log(feedbackData);
    // Extract feedback data
    const {communication, teamwork, integrity, accountability, userId} =
        feedbackData;

    // Check if at least one feedback field is filled
    if (!(communication && teamwork && integrity && accountability && userId)) {
        throw new Meteor.Error(
            "empty-feedback",
            "feedback field must be filled."
        );
    }

    // Example: Insert feedback data into a Feedbacks collection
    const feedbackId = DB.UserFeedbackCollection.insert({
        communication,
        teamwork,
        integrity,
        accountability,
        userId,
        createdAt: new Date()
    });

    // Return any relevant information
    console.log(feedbackId);
    return {feedbackId};
};

export const fetchAllUserPoints = async () => {
    try {
        // Example: Fetch feedback data from the Feedbacks collection
        const allUserPoints = DB.UserPointsCreditsCollection.find().fetch();
        console.log(allUserPoints);

        const adminData = Meteor.users.findOne({
            "profile.isAdmin": true
        });

        // console.log("points data:", existingData);

        // console.log("adminData:", adminData);
        const existingDataNoAdmin = allUserPoints.filter((dataItem) => {
            return dataItem.userId !== adminData._id;
        });

        const allUserNameAndPoints = existingDataNoAdmin.map((data) => {
            const result = Meteor.users.findOne({
                _id: data.userId
            });

            const username = result.profile.name;

            const pointsAcquired = data.totalPointsAcquired;

            return {username, pointsAcquired};
        });

        console.log(allUserNameAndPoints);
        return allUserNameAndPoints;
    } catch (error) {
        throw new Error("All User Points Fetch Error:", error);
    }
};
