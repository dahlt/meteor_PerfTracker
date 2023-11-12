/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import Client from "../../api/classes/client/Client";
import {withTracker} from "meteor/react-meteor-data";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import InsightsTopCards from "./parts/InsightsTopCards";
import {AttendanceHoursCount, FirstAttendanceDataFetch} from "../../api/common";

const LoginWatcherName = "goals-watcher";

export class Insights extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.attendanceHoursCompute = this.attendanceHoursCompute.bind(this);
        this.state = {
            attendanceData: []
        };
    }

    logoutUserInsights() {
        LoginWatcher.logoutUser();
    }

    attendanceDataGet() {
        LoginWatcher.Parent.callFunc(FirstAttendanceDataFetch)
            .then((result) => {
                this.setState({attendanceData: result});
            })
            .catch((err) => {
                // console.log("Error fetching attendance data:", err);
                return err;
            });
    }

    attendanceHoursCompute(loggedInTime, loggedOutTime) {
        const attendanceHours = {
            loggedInTime,
            loggedOutTime
        };

        return new Promise((resolve, reject) => {
            LoginWatcher.Parent.callFunc(AttendanceHoursCount, attendanceHours)
                .then((result) => {
                    //console.log(result);
                    resolve(result); // Resolve the outer promise with the result
                })
                .catch((err) => {
                    // console.log("Error computing attendance hours:", err);
                    reject(err); // Reject the outer promise with the error
                });
        });
    }

    componentDidMount() {
        this.attendanceDataGet();
        // LoginWatcher.getGoalsData();
    }

    render() {
        const {user} = this.props;
        const {attendanceData} = this.state;

        if (user) {
            LoginWatcher.listen(Client.user()._id.toString());
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
                            logout={this.logoutUserInsights}
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
                                                Productivity
                                            </a>
                                            <div className="ry_breadcrumbsdivider">
                                                /
                                            </div>
                                            <a
                                                href="#"
                                                className="ry_breadcrumbs-style1"
                                            >
                                                Insights
                                            </a>
                                        </div>
                                        <div className="ry_headercontainer">
                                            <h1 className="ry_h1-display1 text-white">
                                                Insights
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="ry_body pb-0">
                                        <InsightsTopCards
                                            attendanceItem={attendanceData}
                                            attendanceHoursCalculate={
                                                this.attendanceHoursCompute
                                            }
                                        />
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
        //goalsItems: LoginWatcher.Goals,
    };
})(Insights);
