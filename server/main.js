/* eslint-disable no-console */
import {Meteor} from "meteor/meteor";
import Server from "../imports/api/classes/server/Server";
import "../imports/api/classes/server/methods/registry";
import "../imports/api/classes/server/publications/registry";
import "./token_exchange";
import {
    fetchActivitiesData,
    fetchOrganizationID,
    fetchProjectName,
    fetchUserAccessToken
} from "../imports/api/classes/server/utilities";

Meteor.startup(async () => {
    process.env.MAIL_URL =
        "smtps://gdplays001@gmail.com:wjrhfgrkbbdlemqw@smtp.gmail.com:465";

    Server.run();

    // const userId = "42xJAAmYD5b9Dn4ib";

    // const accessToken =
    //     "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJqdGkiOiJRMEhtdDRGbyIsImlzcyI6Imh0dHBzOi8vYWNjb3VudC5odWJzdGFmZi5jb20iLCJleHAiOjE3MDEyNDg5NTQsImlhdCI6MTcwMTE2MjU1NCwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBodWJzdGFmZjpyZWFkIGh1YnN0YWZmOndyaXRlIiwiYXVkIjoiNHZMVWw5ZF9wai1QVUNMNVhpUWxYdHFsaDNNeDRlQjJHX2plMFdzdlZZbyIsInN1YiI6ImJtUThHblkzLWtxY2Z4ZWdwOWVFU0RZcXM4YVloQnhvOW1NTDl0VnU4XzBQR2ZjQ3ViZFlkUEJjZHp3blZwUmV3cmk5M0ZJcjM5R2ppTU1JZ00tamxBPT0ifQ.N63W1_UwKwfUOOR8rpm1Hth1Kt59HMWk_3YRfrIH7CmDSpoh18AzQssddfzauJuyoFu5BUYaz2oYrl77pCYhVjpagUj-ZX39DOCFE_Kd3A4pmHXa6V_l2wZGCPXfFzzGJP9UzJFDKinwnEyryG774VNwwxAvys66BSNndRL7-qoLSO9Xrqw_fjf1Y3Eh74CMZKej5hZ5GWCblS7aYRpDKTC03TQmuKzvXpXj8ovKYllnjn3PADWJek6JV4p2oPRtdW8MIF75eWFg9OCpd6iuNDNIJfXX6Qsldooq-63lG2YQPvsbnZancWlPM8qvSlordIO5PlTIrvo0Cee5BRG_rw";

    // //const accessToken = await fetchUserAccessToken(userId);

    // //const projectName = await fetchProjectName(accessToken, userId);

    // const startDateParam = "2023-11-27";

    // const endDateParam = "2023-12-03";

    // const activitiesData = await fetchActivitiesData(
    //     userId,
    //     startDateParam,
    //     endDateParam
    // );

    // //console.log(accessToken);

    // //console.log(projectName);
    // console.log(activitiesData);
});
