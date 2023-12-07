/* eslint-disable camelcase */
/* eslint-disable no-console */
import {Meteor} from "meteor/meteor";
import fetch from "node-fetch";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import DB from "../imports/api/DB";

// const discoveryEndpoint = process.env.DISCOVERY_ENDPOINT;
// const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;
// const redirectUri = process.env.REDIRECT_URI;

const discoveryEndpoint =
    "https://account.hubstaff.com/.well-known/openid-configuration";
const clientId = "4vLUl9d_pj-PUCL5XiQlXtqlh3Mx4eB2G_je0WsvVYo";
const clientSecret =
    "2niLtpuhOx2X4d1OL0dsqK2VjE38jGj-AdUaADQOn4I9_ZV6jLvWi3djCGMgPuGzbyQJ-Cx8zjcehBFqutG9_Q";
const redirectUri = "http://localhost:3000/goals";

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.post("/token-exchange", async (req, res) => {
    // console.log("discoveryEndpoint", discoveryEndpoint);
    // console.log("clientId", clientId);
    // console.log("clientSecret", clientSecret);
    // console.log("redirectUri", redirectUri);
    const authorizationCode = req.body.authorizationCode;
    const userId = req.body.userId;
    //console.log("authorizationCode:", authorizationCode);
    const response = await fetch(discoveryEndpoint);
    const discoveryConfig = await response.json();
    // console.log("discoveryConfig:", discoveryConfig);

    const tokenEndpoint = discoveryConfig.token_endpoint;
    //console.log("tokenEndpoint:", tokenEndpoint);
    const tokenResponse = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
                `${clientId}:${clientSecret}`
            ).toString("base64")}`
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code: authorizationCode,
            redirect_uri: redirectUri
        })
    });

    //console.log("tokenResponse:", tokenResponse);

    const tokenData = await tokenResponse.json();

    // Log the token response and send it as a response to the client
    //console.log("Token Response:", tokenData);

    if (userId) {
        DB.UserTokensCollection.insert({
            userId: userId,
            tokenData: tokenData
        });

        Meteor.users.update({_id: userId}, {$set: {"profile.tokenData": true}});
    }

    res.json(tokenData);
});

// app.post("/refresh-token", async (req, res) => {
//     const refreshToken = req.body.refreshToken;

//     console.log("refreshToken", refreshToken);

//     const response = await fetch("https://account.hubstaff.com/access_tokens", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Authorization: `Basic ${Buffer.from(
//                 `${clientId}:${clientSecret}`
//             ).toString("base64")}`
//         },
//         body: new URLSearchParams({
//             grant_type: "refresh_token",
//             refresh_token: refreshToken
//         })
//     });

//     if (response.ok) {
//         // Parse the JSON response only if the status is okay
//         const tokenData = await response.json();
//         console.log("Refreshed Token Response:", tokenData);

//         res.json(tokenData);
//     } else {
//         console.error(
//             "Failed to refresh token. Response Status:",
//             response.status
//         );

//         // Handle the error accordingly
//         res.status(response.status).send("Failed to refresh token");
//     }
// });

app.listen(3002, () => {
    console.log("Token exchange server listening on port 3002");
});
