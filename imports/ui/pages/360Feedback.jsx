/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import FeedbackBody from "./parts/360FeedbackBody";
import {withTracker} from "meteor/react-meteor-data";
import {AttendanceDataFetch} from "../../api/common";
import moment from "moment";

const LoginWatcherName = "360feedback-watcher";

export class Feedback extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.state = {
            attendancesData: []
        };
    }

    // componentDidMount() {
    //     this.getAttendancesData();
    //     LoginWatcher.getAttendancesData();
    // }

    logoutUserFeedback() {
        localStorage.removeItem("authenticated");
        window.location.href = "/";
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

    render() {
        const {user} = this.props;

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
                        <Siidebar
                            user={user}
                            logout={this.logoutUserFeedback}
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
                                        <FeedbackBody />
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
})(Feedback);
