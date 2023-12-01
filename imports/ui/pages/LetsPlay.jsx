/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import {withTracker} from "meteor/react-meteor-data";
import moment from "moment";
import {startOfWeek, endOfWeek} from "date-fns";
import {PointsExchange} from "../../api/common";

const LoginWatcherName = "exchange-watcher";

export class LetsPlay extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.activitiesDataGet = this.activitiesDataGet.bind(this);
        this.pointsExchange = this.pointsExchange.bind(this);
        const currentDateMinusTwo = new Date();
        currentDateMinusTwo.setDate(currentDateMinusTwo.getDate() - 2);

        const initialStartDate = startOfWeek(currentDateMinusTwo, {
            weekStartsOn: 1
        });
        const initialEndDate = endOfWeek(currentDateMinusTwo, {
            weekStartsOn: 1
        });
        this.state = {
            activeTab: "Leaderboard", // Default active tab
            startDate: initialStartDate,
            endDate: initialEndDate,
            pointsAcquiredSummary: [],
            pointsAvailableForExchange: [],
            totalCredits: [],
            isLoading: true
        };
    }

    componentDidMount() {
        const formattedStartDate = moment(this.state.startDate).format(
            "YYYY-MM-DD"
        );
        const formattedEndDate = moment(this.state.endDate).format(
            "YYYY-MM-DD"
        );

        //console.log(formattedStartDate, formattedEndDate);
        const userId = Meteor.userId();
        const startDate = formattedStartDate;
        const endDate = formattedEndDate;

        //console.log(startDate, endDate);
        this.activitiesDataGet(userId, startDate, endDate);
    }

    logoutExchangeCenter() {
        localStorage.removeItem("authenticated");
        window.location.href = "/";
    }

    activitiesDataGet(userId, startDate, endDate) {
        //console.log(userId, startDate, endDate);
        LoginWatcher.getActivitiesData(userId, startDate, endDate)
            .then((result) => {
                console.log(result);
                this.setState({
                    pointsAcquiredSummary:
                        result.pointsSummary.totalPointsAcquired,
                    pointsAvailableForExchange:
                        result.pointsSummary.totalPointsAvailableForExchange,
                    totalCredits: result.pointsSummary.totalCredits
                });
            })
            .catch((err) => {
                console.log("Error:", err);
                return err;
            });
    }

    pointsExchange() {
        const userId = Meteor.userId();
        //console.log(userId, startDate, endDate);
        LoginWatcher.Parent.callFunc(PointsExchange, userId)
            .then(() => {
                console.log("Exchange Successful!");

                const formattedStartDate = moment(this.state.startDate).format(
                    "YYYY-MM-DD"
                );
                const formattedEndDate = moment(this.state.endDate).format(
                    "YYYY-MM-DD"
                );

                //console.log(formattedStartDate, formattedEndDate);
                const startDate = formattedStartDate;
                const endDate = formattedEndDate;

                //console.log(startDate, endDate);
                this.activitiesDataGet(userId, startDate, endDate);
            })
            .catch((err) => {
                console.log("Error:", err);
                return err;
            });
    }

    changeTab(tabName) {
        this.setState({
            activeTab: tabName
        });
    }
    render() {
        const {user} = this.props;
        const {
            pointsAcquiredSummary,
            pointsAvailableForExchange,
            totalCredits
        } = this.state;
        //console.log("pointsAcquiredSummary", pointsAcquiredSummary);

        if (!user || !user.profile) {
            // User data is not available yet, render loading or handle accordingly
            return <div className="loading-spinner"></div>;
        }

        const rewardsList = [
            {
                title: "Out of Country Trip for 2",
                description: "",
                requirement: "20,000 Cr."
            },
            {
                title: "Iphone 15 Pro Max Fully Paid",
                description: "",
                requirement: "15,000 Cr."
            },
            {
                title: "New Workstation Equipment",
                description: "Desks, Keyboards, Chairs etc.",
                requirement: "10,000 Cr."
            },
            {
                title: "Youtube/Netflix/Spotify",
                description: "1-Year Subscription",
                requirement: "5,000 Cr."
            },
            {title: "Paid Day-Off", description: "", requirement: "50 Cr."},
            {
                title: "Strike Removal",
                description: "",
                requirement: "75 Cr."
            },
            {
                title: "Cash Bonus Worth 1K",
                description: "",
                requirement: "100 Cr."
            },
            {
                title: "Free Meals Worth 1K",
                description: "",
                requirement: "100 Cr."
            },
            {
                title: "Double Break for 2 Weeks",
                description: "",
                requirement: "150 Cr."
            },
            {
                title: "Half-Day Friday for 1 Month",
                description: "",
                requirement: "200 Cr."
            }
        ];
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
                    <Siidebar user={user} logout={this.logoutExchangeCenter} />
                    <div className="ry_main-style1">
                        <div className="ry_main-style1_container">
                            <div className="section-style1 mt-0">
                                <div className="ry_dashboard_top mb-10">
                                    <div className="ry_headercontainer">
                                        <h1 className="ry_h1-display1 text-white">
                                            Let's Play
                                        </h1>
                                    </div>
                                </div>
                                {/* Render tabs */}
                                <div className="ry_tabs_container">
                                    <div
                                        className={`ry_tab ${
                                            this.state.activeTab ===
                                            "Leaderboard"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            this.changeTab("Leaderboard")
                                        }
                                    >
                                        Leaderboard
                                    </div>
                                    <div
                                        className={`ry_tab ${
                                            this.state.activeTab === "Rewards"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            this.changeTab("Rewards")
                                        }
                                    >
                                        Rewards
                                    </div>
                                    <div
                                        className={`ry_tab ${
                                            this.state.activeTab ===
                                            "Exchange Center"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            this.changeTab("Exchange Center")
                                        }
                                    >
                                        Exchange Center
                                    </div>
                                    <div
                                        className={`ry_tab ${
                                            this.state.activeTab ===
                                            "Point System"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            this.changeTab("Point System")
                                        }
                                    >
                                        Point System
                                    </div>
                                </div>

                                {/* Render the content of all tabs */}
                                <div className="ry_tab_content">
                                    {/* Leaderboard */}
                                    {this.state.activeTab === "Leaderboard" && (
                                        <div>
                                            <h2>Leaderboard</h2>
                                            {/* Placeholder data */}
                                            <p>John Doe - Points: 100</p>
                                            <p>Jane Doe - Points: 80</p>
                                        </div>
                                    )}

                                    {/* Rewards */}
                                    {this.state.activeTab === "Rewards" && (
                                        <div
                                            style={{
                                                maxHeight: "60vh",
                                                overflowY: "auto"
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    marginLeft: "70%"
                                                }}
                                            >
                                                Credits:{" "}
                                                <span style={{color: "red"}}>
                                                    {totalCredits}
                                                </span>
                                            </h4>
                                            {rewardsList.map(
                                                (reward, index) => (
                                                    <div
                                                        key={index}
                                                        className="reward-entry"
                                                    >
                                                        <h3>
                                                            {reward.title}{" "}
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "20px",
                                                                    fontWeight:
                                                                        "normal",
                                                                    color: "red"
                                                                }}
                                                            >
                                                                (
                                                                {
                                                                    reward.requirement
                                                                }
                                                                )
                                                            </span>
                                                        </h3>
                                                        {reward.description && (
                                                            <p>
                                                                {
                                                                    reward.description
                                                                }
                                                            </p>
                                                        )}

                                                        <div
                                                            className="ry_form-btn_containers2"
                                                            style={{
                                                                display: "flex"
                                                            }}
                                                        >
                                                            <button
                                                                type="button"
                                                                className="ry_btn-style2 w-button"
                                                                style={{
                                                                    backgroundColor:
                                                                        "darkred",
                                                                    marginBottom:
                                                                        "5px"
                                                                }}
                                                            >
                                                                Claim
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {/* Exchange Center */}
                                    {this.state.activeTab ===
                                        "Exchange Center" && (
                                        <div>
                                            <h3>
                                                Total Points Acquired:{" "}
                                                <span style={{color: "red"}}>
                                                    {pointsAcquiredSummary}
                                                </span>
                                            </h3>
                                            <h3>
                                                Total Points Available for
                                                Exchange:{" "}
                                                <span style={{color: "red"}}>
                                                    {pointsAvailableForExchange}
                                                </span>
                                            </h3>
                                            <h3>
                                                Total Credits:{" "}
                                                <span style={{color: "red"}}>
                                                    {totalCredits}
                                                </span>
                                            </h3>
                                            <div className="ry_form-btn_containers2">
                                                <button
                                                    className="ry_btn-style1 w-button"
                                                    onClick={
                                                        this.pointsExchange
                                                    }
                                                    type="button"
                                                >
                                                    Exchange
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Point System */}
                                    {this.state.activeTab ===
                                        "Point System" && (
                                        <div>
                                            <h2 style={{textAlign: "center"}}>
                                                Information Sheet
                                            </h2>
                                            <div
                                                style={{
                                                    borderBottom:
                                                        "1px solid black"
                                                }}
                                            >
                                                <h3>Attendance (daily):</h3>
                                                <p>
                                                    9 hours a day{" "}
                                                    <span
                                                        style={{color: "red"}}
                                                    >
                                                        (10 points)
                                                    </span>
                                                </p>
                                                <p>
                                                    Present status
                                                    <span
                                                        style={{color: "red"}}
                                                    >
                                                        (10 points)
                                                    </span>
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    borderBottom:
                                                        "1px solid black"
                                                }}
                                            >
                                                <h3>Performance (daily):</h3>
                                                <p>
                                                    50% Productivity and Above
                                                    <span
                                                        style={{color: "red"}}
                                                    >
                                                        (10 points)
                                                    </span>
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    borderBottom:
                                                        "1px solid black"
                                                }}
                                            >
                                                <h3>Goals (difficulty):</h3>
                                                <p>
                                                    Easy
                                                    <span
                                                        style={{color: "red"}}
                                                    >
                                                        (15 points)
                                                    </span>
                                                </p>
                                                <p>
                                                    Normal
                                                    <span
                                                        style={{color: "red"}}
                                                    >
                                                        (30 points)
                                                    </span>
                                                </p>
                                                <p>
                                                    Hard
                                                    <span
                                                        style={{color: "red"}}
                                                    >
                                                        (50 points)
                                                    </span>
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    borderBottom:
                                                        "1px solid black"
                                                }}
                                            >
                                                <h3>Exchange Rate:</h3>
                                                <p>
                                                    100 Points =
                                                    <span
                                                        style={{color: "red"}}
                                                    >
                                                        {" "}
                                                        1 Credit
                                                    </span>
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    <span
                                                        style={{
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        Note:
                                                    </span>{" "}
                                                    If you are a new user,
                                                    please load all your data in
                                                    one of the reports page
                                                    <br /> to compute your
                                                    accurate points acquired for
                                                    your attendance. Thank you!
                                                </p>
                                            </div>
                                        </div>
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
})(LetsPlay);
