/* eslint-disable no-console */
import Watcher from "./Watcher";
import Client from "./Client";
import RedisVent from "./RedisVent";
import {
    EmployeeDataFetch,
    GoalDataFetch,
    ReviewDataFetch,
    AttendanceDataFetch,
    FeedbackDataFetch,
    FirstEmployeeDataFetch,
    ActivitiesFetch
} from "../../common";

class LoginWatcher extends Watcher {
    #db = null;
    #db2 = null;
    #db3 = null;
    #db4 = null;
    #db5 = null;
    #db6 = null;
    #db7 = null;
    #db8 = null;
    #authenticated = false;
    #lastbasis = null;
    #listen = null;

    constructor(parent) {
        super(parent);
        RedisVent.Attachment.prepareCollection("goals");
        RedisVent.Attachment.prepareCollection("attendance");
        RedisVent.Attachment.prepareCollection("reviews");
        RedisVent.Attachment.prepareCollection("employees");
        RedisVent.Attachment.prepareCollection("firstEmployees");
        RedisVent.Attachment.prepareCollection("feedback");
        RedisVent.Attachment.prepareCollection("activities");
        RedisVent.Attachment.prepareCollection("activitiesCard");
        this.#db = RedisVent.Attachment.getCollection("goals");
        this.#db2 = RedisVent.Attachment.getCollection("attendance");
        this.#db3 = RedisVent.Attachment.getCollection("reviews");
        this.#db4 = RedisVent.Attachment.getCollection("employees");
        this.#db5 = RedisVent.Attachment.getCollection("feedback");
        this.#db6 = RedisVent.Attachment.getCollection("firstEmployees");
        this.#db7 = RedisVent.Attachment.getCollection("activities");
        this.#db8 = RedisVent.Attachment.getCollection("activitiesCard");
    }

    get UsersData() {
        return Client.user();
    }

    get DB() {
        return this.#db;
    }

    get Goals() {
        return this.#db.find({}).fetch();
    }

    get Reviews() {
        const result = this.#db3.find({}).fetch();
        //console.log(result);
        return result;
    }

    get Employees() {
        //console.log("Employees called");
        const result = this.#db4.find({}).fetch();
        //console.log(result);

        return result;
    }

    set Lastbasis(value) {
        this.#lastbasis = value;
    }

    get Lastbasis() {
        //console.log(this.#lastbasis);
        return this.#lastbasis;
    }

    get Attendance() {
        return this.#db2.find({}).fetch();
    }

    get Feedback() {
        return this.#db5.find({}).fetch();
    }

    listen(userId) {
        if (!this.#listen) {
            // console.log("listening", userId);
            this.#listen = RedisVent.Goals.listen(
                "goals",
                userId,
                ({event}) => {
                    // console.log("listen:", event, data);

                    switch (event) {
                        case "insert":
                        case "update":
                        case "remove":
                    }
                    this.activateWatcher();
                }
            );
        }
    }

    async getActivitiesData(userId, startDate, endDate) {
        try {
            const request = {userId, startDate, endDate};
            const data = await this.Parent.callFunc(ActivitiesFetch, request);
            console.log(data);

            if (data) {
                console.log("if statement called");
                data.extractedData.forEach((item) => {
                    const uniqueIdentifier = `${item.originalDate}-${item.projectName}`;
                    const existingItem = this.#db7.findOne({uniqueIdentifier});

                    if (!existingItem) {
                        // Add the unique identifier to the data before insertion
                        item.uniqueIdentifier = uniqueIdentifier;

                        this.#db7.insert(item);
                        console.log("Inserted data", item);
                    }
                });

                // Prepare a unique identifier for the summary entry
                const summaryUniqueIdentifier = `${data.summary.startDate}-${data.summary.endDate}`;
                const existingSummary = this.#db8.findOne({
                    uniqueIdentifier: summaryUniqueIdentifier
                });

                if (!existingSummary) {
                    // Add the unique identifier to the data before insertion
                    data.summary.uniqueIdentifier = summaryUniqueIdentifier;

                    // Insert the summary into the second collection (db2)
                    this.#db8.insert(data.summary);
                    console.log("Inserted summary data in db2", data.summary);
                }

                this.activateWatcher();
            }

            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getFeedbackData() {
        try {
            const data = await this.Parent.callFunc(FeedbackDataFetch);
            // console.log(data);
            if (data?.data?.length) {
                data.data.forEach((item) => {
                    const {_id, ...rest} = item;
                    const existingReview = this.#db5.findOne({_id});
                    if (!existingReview) {
                        this.#db5.insert({...rest, _id});
                    }
                });
                this.activateWatcher();
            }
            return data;
        } catch (error) {
            // console.log(error);
            return null;
        }
    }

    async getAttendancesData() {
        // console.log("getReviewsData called");
        //console.log(this.#lastbasis);
        const query = {};
        const lastbasis = this.#lastbasis;
        //console.log("old lastbasis:", lastbasis);
        const request = {query, lastbasis};
        try {
            const data = await this.Parent.callFunc(
                AttendanceDataFetch,
                request
            );
            console.log("watcher data:", data);
            if (data?.data?.length) {
                data.data.forEach((item) => {
                    const {_id, ...rest} = item;
                    const existingReview = this.#db2.findOne({_id});
                    if (!existingReview) {
                        this.#db2.insert({...rest, _id});
                    }
                });
                this.#lastbasis = data.lastbasis;
                //console.log("new lastbasis:", this.#lastbasis);
                this.activateWatcher();
            }

            return data;
        } catch (error) {
            // console.log(error);
            return null;
        }
    }

    getGoalsData() {
        // console.log("getGoalsData called");
        const query = {};
        this.Parent.callFunc(GoalDataFetch, {
            query,
            lastbasis: this.#lastbasis
        }).then((data) => {
            // console.log(data);
            if (data?.data?.length) {
                data.data.forEach((item) => {
                    const {_id, ...rest} = item;
                    this.#db.insert({...rest, _id});
                });
                // console.log(data.lastbasis);
                this.#lastbasis = data.lastbasis;

                this.activateWatcher();
            }
        });
    }

    async getReviewsData() {
        const query = {};
        const lastbasis = this.#lastbasis;
        //console.log(lastbasis);
        const request = {query, lastbasis};

        try {
            const data = await this.Parent.callFunc(ReviewDataFetch, request);
            //console.log(data);
            if (data?.data?.length) {
                data.data.forEach((item) => {
                    const {_id, ...rest} = item;
                    const existingReview = this.#db3.findOne({_id});
                    if (!existingReview) {
                        this.#db3.insert({...rest, _id});
                    }
                });
                this.#lastbasis = data.lastbasis;
                console.log(this.#lastbasis);
                this.activateWatcher();
            }
            return data;
        } catch (error) {
            // console.log(error);
            return null;
        }
    }

    async getEmployeeData() {
        // console.log("getReviewsData called");
        // console.log(this.#lastbasis);

        try {
            const data = await this.Parent.callFunc(EmployeeDataFetch);
            //console.log(data);
            if (data?.data?.length) {
                data.data.forEach((item) => {
                    const {_id, ...rest} = item;
                    const existingReview = this.#db4.findOne({_id});
                    if (!existingReview) {
                        this.#db4.insert({...rest, _id});
                    }
                });

                this.activateWatcher();
            }
            return data;
        } catch (error) {
            // console.log(error);
            return null;
        }
    }

    async getFirstEmployeeData() {
        // console.log("getReviewsData called");
        // console.log(this.#lastbasis);

        try {
            const data = await this.Parent.callFunc(FirstEmployeeDataFetch);
            //console.log(data);
            if (data?.data?.length) {
                data.data.forEach((item) => {
                    const {_id, ...rest} = item;
                    const existingReview = this.#db6.findOne({_id});
                    if (!existingReview) {
                        this.#db6.insert({...rest, _id});
                    }
                });

                this.activateWatcher();
            }
            return data;
        } catch (error) {
            // console.log(error);
            return null;
        }
    }

    loginWithPassword(email, password) {
        return new Promise((resolve, reject) => {
            this.Parent.login(email, password, (err) => {
                if (err) reject(err);
                else {
                    this.setAuthenticated(true);
                    resolve();
                }
            });
        });
    }

    logoutUser() {
        return new Promise((resolve, reject) => {
            this.Parent.logout((err) => {
                if (err) reject(err);
                else {
                    // console.log("logging out");
                    resolve();
                }
            });
        });
    }

    setAuthenticated(value) {
        this.#authenticated = value;
        console.log(this.#authenticated);
        localStorage.setItem("authenticated", value);
    }

    isAuthenticated() {
        const storedValue = localStorage.getItem("authenticated");
        return storedValue === "true"; // Convert stored value to a boolean
    }
}

export default new LoginWatcher(Client);
