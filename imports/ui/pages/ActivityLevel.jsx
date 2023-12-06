/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import ReportsTopCards from "./cards/ReportsTopCards";
import DateExport from "./parts/DateExport";
import ActivityLevelBody from "./parts/ActivityLevelBody";
import {withTracker} from "meteor/react-meteor-data";
import moment from "moment";
import {startOfWeek, endOfWeek} from "date-fns";
import Select from "react-select";
import {GoalsUsersFetch} from "../../api/common";

const LoginWatcherName = "activityLevel-watcher";

export class ActivityLevel extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.activitiesDataGet = this.activitiesDataGet.bind(this);
        this.activityUsersFetch = this.activityUsersFetch.bind(this);
        this.timelineTableRef = React.createRef();
        const currentDateMinusTwo = new Date();
        currentDateMinusTwo.setDate(currentDateMinusTwo.getDate() - 2);

        const initialStartDate = startOfWeek(currentDateMinusTwo, {
            weekStartsOn: 1
        });
        const initialEndDate = endOfWeek(currentDateMinusTwo, {
            weekStartsOn: 1
        });

        this.state = {
            owner: [],
            startDate: initialStartDate,
            endDate: initialEndDate,
            employeesHoursData: [],
            activityUsers: [],
            userActivitiesData: [],
            activitiesCardData: null,
            isLoading: true
        };
    }

    logoutUserActivityLevel() {
        localStorage.removeItem("authenticated");
        window.location.href = "/";
    }

    handleDateChange = (newStartDate, newEndDate) => {
        this.setState({
            startDate: newStartDate,
            endDate: newEndDate
        });
        const userId = Meteor.userId();
        // Call activitiesDataGet with the new dates
        //console.log(newStartDate, newEndDate);
        this.activitiesDataGet(userId, newStartDate, newEndDate);
    };

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

    activitiesDataGet(userId, startDate, endDate) {
        //console.log(userId, startDate, endDate);
        LoginWatcher.getActivitiesData(userId, startDate, endDate)
            .then((result) => {
                //console.log(result);
                this.setState({
                    userActivitiesData: result.extractedData,
                    activitiesCardData: result.summary
                });
            })
            .catch((err) => {
                console.log("Error:", err);
                return err;
            });
    }

    componentDidMount() {
        const formattedStartDate = moment(this.state.startDate).format(
            "YYYY-MM-DD"
        );
        const formattedEndDate = moment(this.state.endDate).format(
            "YYYY-MM-DD"
        );

        console.log(formattedStartDate, formattedEndDate);
        const userId = Meteor.userId();
        const startDate = formattedStartDate;
        const endDate = formattedEndDate;

        console.log(startDate, endDate);
        this.activitiesDataGet(userId, startDate, endDate);
        this.activityUsersFetch();
    }

    render() {
        const {user} = this.props;
        const {userActivitiesData, activitiesCardData, activityUsers, owner} =
            this.state;

        console.log(userActivitiesData);
        console.log("activityUsers", activityUsers);

        if (!user || !user.profile) {
            // User data is not available yet, render loading or handle accordingly
            return <div className="loading-spinner"></div>;
        }

        const isAdmin = user.profile.isAdmin === true;
        //console.log(user);
        // Convert goalUsers array to options array for react-select
        const ownerOptions = activityUsers.map((user) => ({
            value: user.name,
            label: user.name,
            key: user.name,
            id: user.userId
        }));

        let adminUserActivitiesData;
        if (owner.length > 0) {
            console.log("owner chosen:", owner[0].id);

            const selectedId = owner[0].id;

            adminUserActivitiesData = userActivitiesData
                .filter((dataItem) => dataItem.userId === selectedId)
                .sort((a, b) => {
                    // Convert the dates to JavaScript Date objects for comparison
                    const dateA = new Date(a.originalDate);
                    const dateB = new Date(b.originalDate);

                    // Compare the dates
                    return dateB - dateA;
                });

            console.log("adminUserActivitiesData", adminUserActivitiesData);
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
                    <Siidebar
                        user={user}
                        logout={this.logoutUserActivityLevel}
                    />
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
                                            Activity Level
                                        </a>
                                    </div>
                                    <div className="ry_headercontainer">
                                        <h1 className="ry_h1-display1 text-white">
                                            Activity Level
                                        </h1>
                                    </div>
                                </div>
                                <div className="ry_body pb-0">
                                    {isAdmin ? (
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
                                    ) : null}

                                    {!isAdmin ? (
                                        <>
                                            {!userActivitiesData.length ? (
                                                <div className="loading-spinner"></div>
                                            ) : (
                                                <>
                                                    <ReportsTopCards
                                                        hoursData={
                                                            activitiesCardData
                                                        }
                                                    />
                                                    <div className="ry_bodycontainer flex-vertical">
                                                        <DateExport
                                                            startDate={
                                                                this.state
                                                                    .startDate
                                                            }
                                                            endDate={
                                                                this.state
                                                                    .endDate
                                                            }
                                                            onDateChange={
                                                                this
                                                                    .handleDateChange
                                                            }
                                                        />
                                                        <ActivityLevelBody
                                                            employeeData={
                                                                this.props.user
                                                            }
                                                            hoursData={
                                                                userActivitiesData
                                                            }
                                                            loadMore={
                                                                this
                                                                    .loadMoreAttendancesData
                                                            }
                                                            startDate={
                                                                this.state
                                                                    .startDate
                                                            }
                                                            endDate={
                                                                this.state
                                                                    .endDate
                                                            }
                                                            filterCriteria={
                                                                this.state
                                                                    .filterCriteria
                                                            }
                                                            ref={
                                                                this
                                                                    .activityLevelBodyRef
                                                            }
                                                        />
                                                    </div>
                                                </>
                                            )}{" "}
                                        </>
                                    ) : (
                                        <>
                                            {!adminUserActivitiesData ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    Please choose a user to
                                                    display data
                                                </div>
                                            ) : (
                                                <>
                                                    {/* <ReportsTopCards
                                                        hoursData={
                                                            activitiesCardData
                                                        }
                                                    /> */}
                                                    <div className="ry_bodycontainer flex-vertical">
                                                        {/* <DateExport
                                                            startDate={
                                                                this.state
                                                                    .startDate
                                                            }
                                                            endDate={
                                                                this.state
                                                                    .endDate
                                                            }
                                                            onDateChange={
                                                                this
                                                                    .handleDateChange
                                                            }
                                                        /> */}
                                                        <ActivityLevelBody
                                                            employeeData={
                                                                !isAdmin
                                                                    ? this.props
                                                                          .user
                                                                          .name
                                                                    : owner[0]
                                                                          .value
                                                            }
                                                            hoursData={
                                                                adminUserActivitiesData
                                                            }
                                                            loadMore={
                                                                this
                                                                    .loadMoreAttendancesData
                                                            }
                                                            startDate={
                                                                this.state
                                                                    .startDate
                                                            }
                                                            endDate={
                                                                this.state
                                                                    .endDate
                                                            }
                                                            filterCriteria={
                                                                this.state
                                                                    .filterCriteria
                                                            }
                                                            ref={
                                                                this
                                                                    .activityLevelBodyRef
                                                            }
                                                            isAdmin={isAdmin}
                                                        />
                                                    </div>
                                                </>
                                            )}{" "}
                                        </>
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
        //goalsItems: LoginWatcher.Goals,
    };
})(ActivityLevel);
