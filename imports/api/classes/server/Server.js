/* eslint-disable no-console */
import DB from "../../DB";
import RedisVent from "./RedisVent";
import moment from "moment";
import {faker} from "@faker-js/faker";

class Server {
    #settings = null;
    constructor(settings) {
        this.#settings = settings;
    }

    get Config() {
        return this.#settings;
    }

    startRedis() {
        return new Promise((resolve) => {
            RedisVent.publish();
            // console.log("Redis ready!", red);
            resolve();
        });
    }

    employeeAttendance = [
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "08:00:00"},
                {loggedOutTime: "17:00:00"}
            ],

            performance: [{productive: 80}, {unproductive: 15}, {neutral: 5}],
            activeProjects: 15,

            createdAt: "2023-07-01"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "09:00:00"},
                {loggedOutTime: "16:00:00"}
            ],

            performance: [{productive: 65}, {unproductive: 15}, {neutral: 20}],
            activeProjects: 15,

            createdAt: "2023-07-02"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "08:30:00"},
                {loggedOutTime: "18:00:00"}
            ],

            performance: [{productive: 70}, {unproductive: 20}, {neutral: 10}],
            activeProjects: 15,

            createdAt: "2023-07-03"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "08:00:00"},
                {loggedOutTime: "12:00:00"}
            ],

            performance: [{productive: 60}, {unproductive: 15}, {neutral: 25}],
            activeProjects: 15,

            createdAt: "2023-07-04"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "10:00:00"},
                {loggedOutTime: "18:00:00"}
            ],

            performance: [{productive: 70}, {unproductive: 15}, {neutral: 15}],
            activeProjects: 15,

            createdAt: "2023-07-05"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "08:00:00"},
                {loggedOutTime: "16:00:00"}
            ],

            performance: [{productive: 80}, {unproductive: 15}, {neutral: 5}],
            activeProjects: 15,

            createdAt: "2023-07-06"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "09:00:00"},
                {loggedOutTime: "15:00:00"}
            ],

            performance: [{productive: 40}, {unproductive: 25}, {neutral: 35}],
            activeProjects: 15,

            createdAt: "2023-07-07"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "10:00:00"},
                {loggedOutTime: "18:00:00"}
            ],

            performance: [{productive: 60}, {unproductive: 20}, {neutral: 20}],
            activeProjects: 15,

            createdAt: "2023-07-08"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "08:00:00"},
                {loggedOutTime: "18:00:00"}
            ],

            performance: [{productive: 80}, {unproductive: 20}, {neutral: 0}],
            activeProjects: 15,

            createdAt: "2023-07-09"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "00:00:00"},
                {loggedOutTime: "00:00:00"}
            ],

            performance: [{productive: 0}, {unproductive: 0}, {neutral: 0}],
            activeProjects: 15,

            createdAt: "2023-07-10"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "12:00:00"},
                {loggedOutTime: "15:00:00"}
            ],

            performance: [{productive: 50}, {unproductive: 20}, {neutral: 30}],
            activeProjects: 15,

            createdAt: "2023-07-11"
        },
        {
            employeeName: "Christine Zara",
            attendance: [
                {loggedInTime: "10:00:00"},
                {loggedOutTime: "14:00:00"}
            ],

            performance: [{productive: 90}, {unproductive: 5}, {neutral: 5}],
            activeProjects: 15,

            createdAt: "2023-07-12"
        }
    ];

    initDB() {
        return new Promise((resolve) => {
            if (!DB.FirstAttendanceCollection.find().fetch().length) {
                DB.FirstAttendanceCollection.createIndex({index1: 1});
                const attendanceData = this.employeeAttendance;
                attendanceData.forEach((attendance) => {
                    //console.log(employee);
                    try {
                        const sanitizedName = attendance.employeeName
                            .toLowerCase()
                            .replace(/[^\w\s]/gi, "")
                            .replace(/\s+/g, "");
                        const formattedCreatedAt = moment(
                            attendance.createdAt
                        ).format("YYYYMMDD");
                        const employeeAttendanceDetails = {
                            employeeName: attendance.employeeName,
                            attendance: attendance.attendance,
                            performance: attendance.performance,
                            activeProjects: attendance.activeProjects,
                            createdAt: attendance.createdAt,
                            index1: `${sanitizedName}${formattedCreatedAt}`
                        };
                        //console.log(employeeDetails);
                        DB.FirstAttendanceCollection.rawCollection().insertOne(
                            employeeAttendanceDetails
                        );
                    } catch (error) {
                        console.error(
                            "Validation failed for attendance item:",
                            attendance
                        );
                        console.error(error);
                    }
                });
            } else {
                console.log(
                    "FirstAttendanceCollection already contain data. Skipping insertion."
                );
                resolve();
            }

            if (!DB.FirstEmployeeCollection.find().fetch().length) {
                DB.FirstEmployeeCollection.createIndex({index1: 1});

                const removeSpecialCharacters = (str) => {
                    return str.replace(/[^\w\s]/gi, "");
                };

                const feeder = () => {
                    const fullname = faker.person.fullName();
                    const modifiedFullname = removeSpecialCharacters(fullname)
                        .replace(/[-\s]+/g, "")
                        .toLowerCase();
                    const index1 = `${modifiedFullname}${moment().format(
                        "YYYYMMDD"
                    )}`;
                    const data = {
                        fullname: fullname,
                        profilePicture: faker.image.avatar(),
                        reviews: [
                            {
                                sent: 0
                            },
                            {
                                received: 0
                            }
                        ],
                        createdAt: moment().toDate(),
                        index1: index1
                    };
                    return data;
                };
                for (let i = 0; i < 20; i++) {
                    const data = feeder();
                    //console.log(data);
                    DB.FirstEmployeeCollection.rawCollection().insertOne(data);
                }
            } else {
                console.log(
                    "FirstEmployeeCollection already contain data. Skipping insertion."
                );
                resolve();
            }

            if (!DB.EmployeeCollection.find().fetch().length) {
                DB.EmployeeCollection.createIndex({index1: 1});

                const teams = [
                    "Accounting Department",
                    "HR Department",
                    "Graphics Department",
                    "Developers Department"
                ];

                const removeSpecialCharacters = (str) => {
                    return str
                        .replace(/[^\w\s]/gi, "")
                        .replace(/\s+/g, "")
                        .toLowerCase();
                };

                for (let i = 0; i < 200; i++) {
                    const fullName = faker.person.fullName();
                    const team = faker.helpers.arrayElement(teams);
                    const createdAt = moment().toDate();
                    const profilePicture = faker.image.avatar();
                    const index1 = `${removeSpecialCharacters(
                        fullName
                    )}${removeSpecialCharacters(team)}${moment(
                        createdAt
                    ).format("YYYYMMDD")}`;
                    const hiredDate = moment(faker.date.past()).format(
                        "YYYY-MM-DD"
                    ); // Generate a random past date for hiredDate

                    const data = {
                        fullName,
                        profilePicture,
                        team,
                        hiredDate, // Add the hiredDate field to the data object
                        createdAt,
                        index1
                    };
                    DB.EmployeeCollection.rawCollection().insertOne(data);
                }
            } else {
                console.log(
                    "EmployeeCollection already contain data. Skipping insertion."
                );
                resolve();
            }

            if (!DB.AttendanceCollection.find().fetch().length) {
                DB.AttendanceCollection.createIndex({index1: 1});
                const employees = DB.EmployeeCollection.find().fetch();
                const startDate = moment("2022-01-01").startOf("month");
                const endDate = moment();
                const generateRandomTime = () => {
                    const hours = Math.floor(Math.random() * 11) + 8; // Generate random hours between 8 and 18
                    const minutes = Math.floor(Math.random() * 60);
                    return moment({hours, minutes}).format("HH:mm");
                };
                const removeSpecialCharacters = (str) => {
                    return str
                        .replace(/[^\w\s]/gi, "")
                        .replace(/\s+/g, "")
                        .toLowerCase();
                };
                employees.forEach((employee) => {
                    const {
                        _id: employeeId,
                        fullName,
                        profilePicture,
                        team
                    } = employee;
                    let currentDate = moment(startDate);
                    while (currentDate.isSameOrBefore(endDate, "day")) {
                        const attendanceDate =
                            moment(currentDate).format("YYYY-MM-DD");
                        let loggedInTime,
                            loggedOutTime,
                            duration,
                            activeHours,
                            attendanceStatus;
                        // Check if it's a weekday (Monday to Friday)
                        if (currentDate.day() >= 1 && currentDate.day() <= 5) {
                            loggedInTime = generateRandomTime();
                            loggedOutTime = generateRandomTime();
                            // Check if loggedInTime is greater than loggedOutTime and swap the values if necessary
                            if (
                                moment(loggedInTime, "HH:mm").isAfter(
                                    moment(loggedOutTime, "HH:mm")
                                )
                            ) {
                                const temp = loggedInTime;
                                loggedInTime = loggedOutTime;
                                loggedOutTime = temp;
                            }
                            const durationMinutes = moment(
                                loggedOutTime,
                                "HH:mm"
                            ).diff(moment(loggedInTime, "HH:mm"), "minutes");
                            const durationHours = Math.floor(
                                durationMinutes / 60
                            );
                            const durationMinutesRemaining =
                                durationMinutes % 60;
                            duration = `${durationHours} hr ${durationMinutesRemaining} mins`;

                            const activeHoursMinutes = Math.floor(
                                Math.random() * durationMinutes
                            );
                            const activeHoursHours = Math.floor(
                                activeHoursMinutes / 60
                            );
                            const activeHoursMinutesRemaining =
                                activeHoursMinutes % 60;
                            activeHours = `${activeHoursHours} hr ${activeHoursMinutesRemaining} mins`;

                            attendanceStatus = "Present";
                        } else {
                            loggedInTime = "00:00";
                            loggedOutTime = "00:00";
                            duration = "0 hr 0 mins";
                            activeHours = "0 hr 0 mins";
                            attendanceStatus = "Weekend";
                        }

                        const createdAt = attendanceDate;

                        const index1 = `${removeSpecialCharacters(
                            fullName
                        )}${moment(createdAt).format("YYYYMMDD")}`;

                        const data = {
                            employeeId,
                            employeeName: fullName,
                            profilePicture,
                            team,
                            loggedInTime,
                            loggedOutTime,
                            duration,
                            activeHours,
                            attendanceStatus,
                            createdAt,
                            index1
                        };

                        DB.AttendanceCollection.rawCollection().insertOne(data);

                        currentDate.add(1, "day");
                    }
                });
            } else {
                console.log(
                    "AttendanceCollection already contains data. Skipping insertion."
                );
            }

            if (!DB.FeedbackCollection.find().fetch().length) {
                DB.FeedbackCollection.createIndex({employeeId: 1});

                const employees = DB.EmployeeCollection.find().fetch();

                const startDate = moment().startOf("month");

                const removeSpecialCharacters = (str) => {
                    return str
                        .replace(/[^\w\s]/gi, "")
                        .replace(/\s+/g, "")
                        .toLowerCase();
                };

                employees.forEach((employee) => {
                    const {
                        _id: employeeId,
                        fullName,
                        profilePicture,
                        team,
                        hiredDate
                    } = employee;

                    for (let i = 0; i < 2; i++) {
                        // console.log("Loop iteration:", i);
                        let currentDate = moment(startDate);
                        const attendanceDate =
                            moment(currentDate).format("YYYY-MM-DD");

                        const index1 = `${removeSpecialCharacters(
                            fullName
                        )}${removeSpecialCharacters(team)}${moment(
                            attendanceDate
                        ).format("YYYYMMDD")}`;

                        let reviewCycle;
                        if (i === 0) {
                            reviewCycle = "Jan 1 - Mar 31, 2023";
                        } else {
                            reviewCycle = "Apr 1 - Jun 30, 2023";
                        }

                        const invited = faker.number.int({min: 1, max: 15});
                        const done = faker.number.int({min: 1, max: invited});
                        const notResponded = faker.number.int({
                            min: 0,
                            max: invited - done
                        });
                        const declined = invited - (done + notResponded);

                        const surveyProgress = {
                            invited: invited,
                            done: done,
                            "not responded": notResponded,
                            declined: declined
                        };
                        // console.log("SURVEY", surveyProgress);

                        const totalAverage = {
                            communication: [],
                            teamwork: [],
                            integrity: [],
                            accountability: []
                        };

                        // Calculate the total average for each feedback category based on surveyProgress.done
                        const feedback = {};

                        for (const category in totalAverage) {
                            const scores = Array.from(
                                {length: surveyProgress.done},
                                () => faker.number.int({min: 1, max: 5})
                            );
                            const numSurveysDone = Math.min(
                                scores.length,
                                surveyProgress.done
                            );
                            const sum = scores
                                .slice(0, numSurveysDone)
                                .reduce((acc, score) => acc + score, 0);
                            const average =
                                numSurveysDone === 0 ? 0 : sum / numSurveysDone;
                            feedback[category] = average;
                            // console.log("scores:", scores);
                        }
                        // console.log("FEEDBACK", feedback);
                        const self = faker.number.float({
                            min: 1,
                            max: 10,
                            precision: 0.1
                        });
                        const manager = faker.number.float({
                            min: 1,
                            max: 10,
                            precision: 0.1
                        });
                        const directReports = faker.number.float({
                            min: 1,
                            max: 10,
                            precision: 0.1
                        });

                        const communicationData = {
                            self: self,
                            manager: manager,
                            directReports: directReports
                        };

                        const response = faker.word.words(5);

                        let createdDate;
                        if (i === 0) {
                            createdDate = "2023-03-31";
                        } else {
                            createdDate = "2023-06-30";
                        }

                        const data = {
                            employeeId,
                            employeeName: fullName,
                            profilePicture,
                            team,
                            hiredDate,
                            reviewCycle,
                            surveyProgress,
                            feedback,
                            communicationData,
                            response,
                            createdAt: moment(createdDate).format("YYYY-MM-DD"),
                            index1
                        };

                        DB.FeedbackCollection.rawCollection().insertOne(data);

                        // console.log("Data:", data); // Print the data object being inserted into the collection
                        // console.log("----------------------------------");
                    }
                });
            } else {
                console.log(
                    "FeedbackCollection already contains data. Skipping insertion."
                );
            }

            if (!DB.ReviewsCollection.find().fetch().length) {
                //console.log("ReviewsCollection called");
                DB.ReviewsCollection.createIndex({index1: 1});
                const removeSpecialCharacters = (str) => {
                    return str
                        .replace(/[^\w\s]/gi, "")
                        .replace(/\s+/g, "")
                        .toLowerCase();
                };
                const getRandomEmployeeId = () => {
                    const employees = DB.FirstEmployeeCollection.find().fetch();
                    const randomIndex = Math.floor(
                        Math.random() * employees.length
                    );
                    const randomEmployee = employees[randomIndex];
                    return randomEmployee._id;
                };
                const feeder = () => {
                    let senderId, receiverId;
                    do {
                        senderId = getRandomEmployeeId();
                        receiverId = getRandomEmployeeId();
                    } while (senderId === receiverId);
                    const sender = DB.FirstEmployeeCollection.findOne(senderId);
                    const receiver =
                        DB.FirstEmployeeCollection.findOne(receiverId);
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
                        reviewMessage: faker.lorem.sentence(),
                        createdAt: moment().toDate(),
                        index1: `${moment().format(
                            "YYYYMMDDHHmm"
                        )}${removeSpecialCharacters(
                            sender.fullname
                        )}${removeSpecialCharacters(receiver.fullname)}`,
                        type: "public" // Set the type as "public" by default
                    };
                    // Update reviews array for sender
                    DB.FirstEmployeeCollection.update(
                        {_id: senderId},
                        {$inc: {"reviews.0.sent": 1}}
                    );
                    // Update reviews array for receiver
                    DB.FirstEmployeeCollection.update(
                        {_id: receiverId},
                        {$inc: {"reviews.1.received": 1}}
                    );
                    return data;
                };
                for (let i = 0; i < 50; i++) {
                    const data = feeder();
                    //console.log(data);
                    DB.ReviewsCollection.rawCollection().insertOne(data);
                }
            } else {
                console.log(
                    "Collections already contain data. Skipping insertion."
                );
                resolve();
            }
        });
    }

    run() {
        return Promise.all([this.startRedis(), this.initDB()]).then(() => {
            // console.log("Server is ready...");
        });
    }
}

export default new Server(Meteor.settings);
