/* eslint-disable no-console */
import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import Server from "../imports/api/classes/server/Server";
import "../imports/api/classes/server/methods/registry";
import "../imports/api/classes/server/publications/registry";

Meteor.startup(async () => {
    process.env.MAIL_URL =
        "smtps://gdplays001@gmail.com:wjrhfgrkbbdlemqw@smtp.gmail.com:465";

    Accounts.onEmailVerificationLink((token, done) => {
        // Use the token to find the user and update the 'verified' field
        Meteor.users.update(
            {
                "services.email.verificationTokens.token": token
            },
            {
                $set: {
                    "emails.$.verified": true,
                    "services.email.verificationTokens.$.verified": true
                }
            },
            (error) => {
                if (error) {
                    console.log("Error updating user:", error);
                } else {
                    console.log("User verified successfully");
                    done();
                }
            }
        );
    });
    Server.run();
});
