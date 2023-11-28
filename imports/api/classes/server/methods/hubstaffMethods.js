/* eslint-disable max-len */
import {Meteor} from "meteor/meteor";
import {
    fetchActivitiesData,
    fetchOrganizationID,
    fetchUserAccessToken
} from "../utilities";

import {
    ActivitiesFetch,
    OrganizationIDFetch,
    UserAccessTokenFetch
} from "../../../common";

Meteor.methods({
    [UserAccessTokenFetch]: function (userId) {
        try {
            const accessToken = fetchUserAccessToken(userId);

            if (!accessToken) {
                throw new Meteor.Error(
                    "access-token-not-found",
                    "Access token not found."
                );
            }

            return accessToken;
        } catch (error) {
            throw new Meteor.Error(
                "custom-error-code",
                "Custom error message",
                error
            );
        }
    },

    [OrganizationIDFetch]: function (accessToken) {
        try {
            const data = fetchOrganizationID(accessToken);
            return data;
        } catch (error) {
            throw new Meteor.Error(
                "api-request-error",
                "API Request Error",
                error
            );
        }
    },

    [ActivitiesFetch]: function (request) {
        try {
            const userId = request.userId;
            const startDate = request.startDate;
            const endDate = request.endDate;
            const data = fetchActivitiesData(userId, startDate, endDate);
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