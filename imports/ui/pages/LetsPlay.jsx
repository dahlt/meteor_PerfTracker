/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import {withTracker} from "meteor/react-meteor-data";
import moment from "moment";

const LoginWatcherName = "exchange-watcher";

export class LetsPlay extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.state = {
            activeTab: "Leaderboard" // Default active tab
        };
    }

    // componentDidMount() {
    //     this.getAttendancesData();
    //     LoginWatcher.getAttendancesData();
    // }

    logoutExchangeCenter() {
        localStorage.removeItem("authenticated");
        window.location.href = "/";
    }

    changeTab(tabName) {
        this.setState({
            activeTab: tabName
        });
    }
    render() {
        const {user} = this.props;

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
                                        <div>
                                            <h2>Rewards</h2>
                                            {/* Placeholder data */}
                                            <p>1. Gift Card - 50 points</p>
                                            <p>2. Movie Ticket - 30 points</p>
                                        </div>
                                    )}

                                    {/* Exchange Center */}
                                    {this.state.activeTab ===
                                        "Exchange Center" && (
                                        <div>
                                            <h2>Exchange Center</h2>
                                            {/* Placeholder data */}
                                            <p>
                                                Exchange your points for
                                                exciting rewards!
                                            </p>
                                        </div>
                                    )}

                                    {/* Point System */}
                                    {this.state.activeTab ===
                                        "Point System" && (
                                        <div>
                                            <h2>Point System</h2>
                                            {/* Placeholder data */}
                                            <p>
                                                Earn points by completing tasks
                                                and activities.
                                            </p>
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
