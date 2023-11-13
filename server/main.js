/* eslint-disable no-console */
import {Meteor} from "meteor/meteor";
import Server from "../imports/api/classes/server/Server";
import "../imports/api/classes/server/methods/registry";
import "../imports/api/classes/server/publications/registry";

Meteor.startup(async () => {
    process.env.MAIL_URL =
        "smtps://gdplays001@gmail.com:wjrhfgrkbbdlemqw@smtp.gmail.com:465";

    Server.run();
});
