/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import ReportsTopCards from "./cards/ReportsTopCards";
import AttendanceBody from "./parts/AttendanceBody";
import DateExport from "./parts/DateExport";
import moment from "moment";
import {startOfWeek, endOfWeek} from "date-fns";
import {withTracker} from "meteor/react-meteor-data";

const LoginWatcherName = "attendance-watcher";

export class Attendance extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.activitiesDataGet = this.activitiesDataGet.bind(this);
        this.attendanceBodyRef = React.createRef();
        const currentDateMinusTwo = new Date();
        currentDateMinusTwo.setDate(currentDateMinusTwo.getDate() - 2);

        const initialStartDate = startOfWeek(currentDateMinusTwo, {
            weekStartsOn: 1
        });
        const initialEndDate = endOfWeek(currentDateMinusTwo, {
            weekStartsOn: 1
        });
        this.state = {
            startDate: initialStartDate,
            endDate: initialEndDate,
            attendancesData: [],
            userActivitiesData: [],
            activitiesCardData: null,
            isLoading: true
        };
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
    }

    logoutUserAttendance() {
        LoginWatcher.logoutUser();
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

    render() {
        const {user} = this.props;
        const {userActivitiesData, isLoading, attendancesData} = this.state;

        console.log(userActivitiesData);
        if (!user || !user.profile) {
            // User data is not available yet, render loading or handle accordingly
            return <div className="loading-spinner"></div>;
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
                    <Siidebar user={user} logout={this.logoutUserAttendance} />
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
                                            Attendance
                                        </a>
                                    </div>
                                    <div className="ry_headercontainer">
                                        <h1 className="ry_h1-display1 text-white">
                                            Attendance
                                        </h1>
                                    </div>
                                </div>
                                <div className="ry_body pb-0">
                                    {!isLoading ? (
                                        <div className="loading-spinner"></div>
                                    ) : (
                                        <>
                                            <ReportsTopCards
                                                hoursData={attendancesData}
                                            />
                                            <div className="ry_bodycontainer flex-vertical">
                                                <DateExport
                                                    startDate={
                                                        this.state.startDate
                                                    }
                                                    endDate={this.state.endDate}
                                                    onDateChange={
                                                        this.handleDateChange
                                                    }
                                                />
                                                <AttendanceBody
                                                    employeeData={
                                                        this.props.user
                                                    }
                                                    attendancesData={
                                                        userActivitiesData
                                                    }
                                                    loadMore={
                                                        this
                                                            .loadMoreAttendancesData
                                                    }
                                                    startDate={
                                                        this.state.startDate
                                                    }
                                                    endDate={this.state.endDate}
                                                    filterCriteria={
                                                        this.state
                                                            .filterCriteria
                                                    }
                                                    ref={this.attendanceBodyRef}
                                                />
                                            </div>
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
})(Attendance);
