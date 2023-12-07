/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import FeedbackBody from "./parts/360FeedbackBody";
import {withTracker} from "meteor/react-meteor-data";
import {
    AttendanceDataFetch,
    FeedbackFetch,
    FeedbackSubmit
} from "../../api/common";
import moment from "moment";
import Select from "react-select";
import {GoalsUsersFetch} from "../../api/common";

const LoginWatcherName = "360feedback-watcher";

export class Feedback extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.activityUsersFetch = this.activityUsersFetch.bind(this);
        this.feedbackDataFetch = this.feedbackDataFetch.bind(this);
        this.state = {
            attendancesData: [],
            activityUsers: [],
            owner: [],
            feedbackData: [],
            communication: "",
            teamwork: "",
            integrity: "",
            accountability: "",
            notes: ""
        };
    }

    componentDidMount() {
        this.activityUsersFetch();
        this.feedbackDataFetch();
    }

    logoutUserFeedback() {
        localStorage.removeItem("authenticated");
        window.location.href = "/";
    }

    activityUsersFetch() {
        //console.log(goalData);

        LoginWatcher.Parent.callFunc(GoalsUsersFetch)
            .then((result) => {
                // Filter out 'Admin' from the result array
                const filteredUsers = result.filter(
                    (user) => user.name !== "Admin"
                );

                this.setState({activityUsers: filteredUsers});
            })
            .catch((err) => {
                // console.log("Error inserting goal data:", err);
                return err;
            });
    }

    feedbackDataFetch() {
        const userId = Meteor.userId();

        console.log("userId", userId);

        LoginWatcher.Parent.callFunc(FeedbackFetch, userId)
            .then((result) => {
                this.setState({feedbackData: result});
            })
            .catch((err) => {
                // console.log("Error inserting goal data:", err);
                return err;
            });
    }

    getAttendancesData() {
        LoginWatcher.Parent.callFunc(AttendanceDataFetch)
            .then((result) => {
                this.setState({attendancesData: result});
            })
            .catch((err) => {
                return err;
            });
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic to submit the form data
        const communication = e.target.communication.value;
        const teamwork = e.target.teamwork.value;
        const integrity = e.target.integrity.value;
        const accountability = e.target.accountability.value;
        const userId = this.state.owner[0].id;

        // Filter out empty values
        const feedbackData = {
            communication: communication || undefined,
            teamwork: teamwork || undefined,
            integrity: integrity || undefined,
            accountability: accountability || undefined,
            userId: userId,
            notes: this.state.notes || undefined
        };

        console.log("feedbackData", feedbackData);

        LoginWatcher.Parent.callFunc(FeedbackSubmit, feedbackData)
            .then(() => {
                console.log("Feedback submitted");
            })
            .catch((err) => {
                // console.log("Error inserting goal data:", err);
                return err;
            });

        this.setState({
            communication: "",
            teamwork: "",
            integrity: "",
            accountability: "",
            owner: [],
            notes: ""
        });
    };

    render() {
        const {user} = this.props;
        const {activityUsers, owner, feedbackData} = this.state;

        //console.log("feedbackData", feedbackData);
        if (!user || !user.profile) {
            // User data is not available yet, render loading or handle accordingly
            return <div className="loading-spinner"></div>;
        }

        const isAdmin = user.profile.isAdmin === true;

        const ownerOptions = activityUsers.map((user) => ({
            value: user.name,
            label: user.name,
            key: user.name,
            id: user.userId
        }));

        if (owner.length > 0) {
            const selectedId = owner[0].id;

            console.log("owner chosen:", selectedId);
        }

        return (
            <div className="ry_app-main-wrapper-style2">
                <div
                    data-w-id="ac3afbcf-65d0-1e1e-7bef-fe7812f0d460"
                    className="icon_main-menu"
                >
                    <img
                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647edc411cb7ba0f95e2d178_icon_menu.svg"
                        loading="lazy"
                        alt=""
                    />
                </div>
                <TopNavigation />
                <div className="ry_main-section-style1">
                    <Siidebar user={user} logout={this.logoutUserFeedback} />
                    <div className="ry_main-style1">
                        <div className="ry_main-style1_container">
                            <div className="section-style1 mt-0">
                                <div className="ry_dashboard_top mb-10">
                                    <div className="ry_breadcrumbs_container mb-0">
                                        <a
                                            href="#"
                                            className="ry_breadcrumbs-style1"
                                        >
                                            Reports
                                        </a>
                                        <div className="ry_breadcrumbsdivider">
                                            /
                                        </div>
                                        <a
                                            href="#"
                                            className="ry_breadcrumbs-style1"
                                        >
                                            360° Feedback
                                        </a>
                                    </div>
                                    <div className="ry_headercontainer">
                                        <h1 className="ry_h1-display1 text-white">
                                            360° Feedback
                                        </h1>
                                    </div>
                                </div>
                                <div className="ry_body pb-0">
                                    <div className="ry_bodytop">
                                        <div className="ry_bodytop_left">
                                            <h1 className="ry_h2-display1 mr-10">
                                                Results
                                            </h1>
                                            <p className="ry_p-style1 mb-0 text-darkblue text-semibold">
                                                as of{" "}
                                                {moment().format(
                                                    "MMM D, YYYY, h:mm a"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {!isAdmin ? (
                                        <FeedbackBody
                                            feedbackData={feedbackData}
                                            user={user.profile.name}
                                        />
                                    ) : (
                                        <form
                                            onSubmit={this.handleSubmit}
                                            className="feedback-form"
                                        >
                                            <Select
                                                options={ownerOptions}
                                                value={this.state.owner}
                                                isMulti
                                                onChange={(selectedOptions) =>
                                                    this.setState({
                                                        owner: selectedOptions
                                                    })
                                                }
                                            />
                                            <label htmlFor="communication">
                                                Communication (1-10):
                                            </label>
                                            <input
                                                type="number"
                                                id="communication"
                                                name="communication"
                                                min="1"
                                                max="10"
                                                value={this.state.communication}
                                                onChange={
                                                    this.handleInputChange
                                                }
                                                required
                                            />

                                            <label htmlFor="teamwork">
                                                Teamwork (1-10):
                                            </label>
                                            <input
                                                type="number"
                                                id="teamwork"
                                                name="teamwork"
                                                min="1"
                                                max="10"
                                                value={this.state.teamwork}
                                                onChange={
                                                    this.handleInputChange
                                                }
                                                required
                                            />

                                            <label htmlFor="integrity">
                                                Integrity (1-10):
                                            </label>
                                            <input
                                                type="number"
                                                id="integrity"
                                                name="integrity"
                                                min="1"
                                                max="10"
                                                value={this.state.integrity}
                                                onChange={
                                                    this.handleInputChange
                                                }
                                                required
                                            />

                                            <label htmlFor="accountability">
                                                Accountability (1-10):
                                            </label>
                                            <input
                                                type="number"
                                                id="accountability"
                                                name="accountability"
                                                min="1"
                                                max="10"
                                                value={
                                                    this.state.accountability
                                                }
                                                onChange={
                                                    this.handleInputChange
                                                }
                                                required
                                            />

                                            <label htmlFor="notes">
                                                Notes:
                                            </label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                value={this.state.notes}
                                                onChange={
                                                    this.handleInputChange
                                                }
                                                rows="4"
                                                cols="50"
                                            />

                                            <button type="submit">
                                                Submit
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    LoginWatcher.initiateWatch(LoginWatcherName);
    return {
        user: LoginWatcher.UsersData
    };
})(Feedback);
