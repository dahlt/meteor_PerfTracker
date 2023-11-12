/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import {withTracker} from "meteor/react-meteor-data";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import ReportsTopCards from "./cards/ReportsTopCards";
import ReportsChart from "./parts/ReportsChart";

const LoginWatcherName = "reports-watcher";

export class Reports extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.employeesDataGet = this.employeesDataGet.bind(this);
        this.employeesHoursDataGet = this.employeesHoursDataGet.bind(this);
        this.state = {
            employeesData: [],
            employeesHoursData: []
        };
    }

    logoutUserReports() {
        LoginWatcher.logoutUser();
    }

    employeesDataGet() {
        LoginWatcher.getEmployeeData()
            .then((result) => {
                //console.log(result);
                this.setState({employeesData: result});
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    employeesHoursDataGet() {
        LoginWatcher.getAttendancesData()
            .then((result) => {
                //console.log(result);
                this.setState({employeesHoursData: result.data});
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    getMatchingEmployeeHours() {
        const {employeesData, employeesHoursData} = this.state;
        const {user} = this.props;

        if (user) {
            const matchingEmployee = employeesData.find(
                (employee) => employee.fullName === user.profile
            );

            if (matchingEmployee) {
                const matchingEmployeeHoursData = employeesHoursData.filter(
                    (hours) => hours.employeeName === matchingEmployee.fullName
                );

                return matchingEmployeeHoursData;
            }
        }

        return [];
    }

    componentDidMount() {
        this.employeesDataGet();
        this.employeesHoursDataGet();
    }

    render() {
        const {user} = this.props;
        const {employeesHoursData} = this.state;

        if (user) {
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
                        <Siidebar user={user} logout={this.logoutUserReports} />
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
                                                Overview
                                            </a>
                                        </div>
                                        <div className="ry_headercontainer">
                                            <h1 className="ry_h1-display1 text-white">
                                                Reports
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="ry_body pb-0">
                                        <ReportsTopCards
                                            hoursData={employeesHoursData}
                                        />
                                        <div className="ry_bodycontainer">
                                            <div className="card_row_container align-start">
                                                <div className="card_dashboard">
                                                    <div className="w-form">
                                                        <form
                                                            id="email-form-2"
                                                            name="email-form-2"
                                                            data-name="Email Form 2"
                                                            method="get"
                                                        >
                                                            <div className="ry_cardtop">
                                                                <div className="card_dashboard-label">
                                                                    Reports
                                                                </div>
                                                            </div>
                                                            <div className="ry_cardcontent-style1">
                                                                <a
                                                                    href="/timesheets"
                                                                    className="ry_linkblock-style1 w-inline-block"
                                                                >
                                                                    <div>
                                                                        Time
                                                                        Sheet
                                                                    </div>
                                                                </a>
                                                                <a
                                                                    href="/timeline"
                                                                    className="ry_linkblock-style1 w-inline-block"
                                                                >
                                                                    <div>
                                                                        Timeline
                                                                    </div>
                                                                </a>
                                                                <a
                                                                    href="/attendance"
                                                                    className="ry_linkblock-style1 w-inline-block"
                                                                >
                                                                    <div>
                                                                        Attendance
                                                                    </div>
                                                                </a>
                                                                <a
                                                                    href="/activity-level"
                                                                    className="ry_linkblock-style1 w-inline-block"
                                                                >
                                                                    <div>
                                                                        Activity
                                                                        Level
                                                                    </div>
                                                                </a>
                                                                <a
                                                                    href="/360-feedback"
                                                                    className="ry_linkblock-style1 w-inline-block"
                                                                >
                                                                    <div>
                                                                        360^
                                                                        Feedback
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </form>
                                                        <div className="w-form-done">
                                                            <div>
                                                                Thank you! Your
                                                                submission has
                                                                been received!
                                                            </div>
                                                        </div>
                                                        <div className="w-form-fail">
                                                            <div>
                                                                Oops! Something
                                                                went wrong while
                                                                submitting the
                                                                form.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ReportsChart
                                                    hoursData={
                                                        employeesHoursData
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div className="loading"></div>;
        }
    }
}

export default withTracker(() => {
    LoginWatcher.initiateWatch(LoginWatcherName);
    return {
        user: LoginWatcher.UsersData
    };
})(Reports);
