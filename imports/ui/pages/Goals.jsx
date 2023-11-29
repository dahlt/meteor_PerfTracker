/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import Client from "../../api/classes/client/Client";
import {withTracker} from "meteor/react-meteor-data";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import GoalItem from "./parts/GoalItem";
import GoalSummary from "./parts/GoalSummary";
import GoalAddModal from "./parts/GoalAddModal";
import {
    GoalDataFetch,
    GoalsComment,
    GoalsDelete,
    GoalsInsert,
    GoalsUpdate,
    GoalsUsersFetch
} from "../../api/common";

const LoginWatcherName = "goals-watcher";

export class Goals extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.toggleModal = this.toggleModal.bind(this);
        this.goalInsert = this.goalInsert.bind(this);
        this.goalUpdate = this.goalUpdate.bind(this);
        this.goalDelete = this.goalDelete.bind(this);
        this.goalComment = this.goalComment.bind(this);
        this.goalDataGet = this.goalDataGet.bind(this);
        this.goalUsersFetch = this.goalUsersFetch.bind(this);
        this.state = {
            showModal: false,
            goalsData: [],
            goalsUsers: [],
            isGoalUpdated: false,
            showSelectMenu: false,
            selectedOption: "All"
        };
    }

    logoutUserGoals() {
        localStorage.removeItem("authenticated");
        window.location.href = "/";
    }

    toggleModal = () => {
        this.setState((prevState) => ({
            showModal: !prevState.showModal
        }));
    };

    toggleSelectMenu() {
        this.setState((prevState) => ({
            showSelectMenu: !prevState.showSelectMenu
        }));
    }

    handleOptionChange(event) {
        const selectedOption = event.target.value;
        this.setState({selectedOption});
        // console.log(selectedOption);
    }

    goalInsert(goalData) {
        //console.log(goalData);

        LoginWatcher.Parent.callFunc(GoalsInsert, goalData)
            .then(() => {
                // console.log("Goal data inserted.");
                this.setState({isGoalUpdated: true});
            })
            .catch((err) => {
                // console.log("Error inserting goal data:", err);
                return err;
            });
    }

    goalUsersFetch() {
        //console.log(goalData);

        LoginWatcher.Parent.callFunc(GoalsUsersFetch)
            .then((result) => {
                // console.log("Goal data inserted.");
                this.setState({goalsUsers: result});
            })
            .catch((err) => {
                // console.log("Error inserting goal data:", err);
                return err;
            });
    }

    goalUpdate(goalId, goalData) {
        // console.log("Goals goalUpdate: ", goalId, goalData);
        LoginWatcher.Parent.callFunc(GoalsUpdate, {goalId, goalData})
            .then(() => {
                // console.log("Goal data commented.");
                this.goalDataGet();
            })
            .catch((err) => {
                // console.log("Error commenting goal data:", err);
                return err;
            });
    }

    goalComment(goalId, commentor, message) {
        //console.log("Goals goalComment: ", goalId, commentor, message);
        LoginWatcher.Parent.callFunc(GoalsComment, {
            goalId,
            commentor,
            message
        })
            .then(() => {
                // console.log("Goal comments added.");
                this.goalDataGet();
            })
            .catch((err) => {
                // console.log("Error adding comments:", err);
                return err;
            });
    }

    goalDelete(goalId) {
        //console.log(goalData);

        LoginWatcher.Parent.callFunc(GoalsDelete, goalId)
            .then(() => {
                // console.log("Goal data deleted.");
                this.goalDataGet();
            })
            .catch((err) => {
                // console.log("Error deleting goal data:", err);
                return err;
            });
    }

    goalDataGet() {
        LoginWatcher.Parent.callFunc(GoalDataFetch)
            .then((result) => {
                this.setState({goalsData: result});
            })
            .catch((err) => {
                //console.log("Error fetching goal data:", err);
                return err;
            });
    }

    componentDidMount() {
        const queryParams = new URLSearchParams(window.location.search);
        const authorizationCode = queryParams.get("code");
        const userId = Meteor.userId();
        // console.log(authorizationCode);
        // console.log(userId);

        if (authorizationCode && userId) {
            fetch("http://localhost:3002/token-exchange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({authorizationCode, userId}) // Include userId in the request body
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Token Exchange Response Successful");
                    window.location.href = "/goals";
                })
                .catch((error) => {
                    console.error("Token Exchange Error:", error);
                });
        }
        this.goalDataGet();
        this.goalUsersFetch();
        // LoginWatcher.getGoalsData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.showModal !== this.state.showModal) {
            this.goalDataGet();
        }
    }

    render() {
        const {user} = this.props;
        const {
            showModal,
            goalsData,
            showSelectMenu,
            selectedOption,
            goalsUsers
        } = this.state;

        console.log("user", user);
        console.log("goalsUsers", goalsUsers);
        //console.log(goalsItems);
        //console.log(goalsData);

        if (user) {
            LoginWatcher.listen(Client.user()._id.toString());
            return (
                <div>
                    {/* <h1>Goals</h1> */}
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
                                logout={this.logoutUserGoals}
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
                                                    Goals
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
                                                    Goals
                                                </h1>
                                            </div>
                                        </div>
                                        <div className="ry_body pb-0">
                                            <div className="ry_bodytop">
                                                <div className="ry_bodytop_left">
                                                    <h1 className="ry_h2-display1">
                                                        All Goals
                                                    </h1>
                                                    <div className="ry_arrowdown">
                                                        <img
                                                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f22d72fcff739ae70c277_icon_arrow.svg"
                                                            loading="lazy"
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                                <div className="ry_bodytop_right">
                                                    <a
                                                        href="#"
                                                        className="ry_icon-btn-style1 light mr-10 w-inline-block"
                                                        onClick={this.toggleSelectMenu.bind(
                                                            this
                                                        )}
                                                    >
                                                        <img
                                                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647eef8aec75fb8b58e0fc0c_icon_filter.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="icon-btn_asset"
                                                        />
                                                        <div>Filter</div>
                                                    </a>
                                                    {showSelectMenu && (
                                                        <div className="select-menu">
                                                            <select
                                                                value={
                                                                    this.state
                                                                        .selectedOption
                                                                }
                                                                onChange={this.handleOptionChange.bind(
                                                                    this
                                                                )}
                                                            >
                                                                <option value="All">
                                                                    All
                                                                </option>
                                                                <option value="On Track">
                                                                    On Track
                                                                </option>
                                                                <option value="Behind">
                                                                    Behind
                                                                </option>
                                                                <option value="At Risk">
                                                                    At Risk
                                                                </option>
                                                            </select>
                                                        </div>
                                                    )}
                                                    <a
                                                        data-w-id="bfd1bb1a-b812-55c4-35f4-30b7f4515628"
                                                        href="#"
                                                        className="ry_icon-btn-style1 w-inline-block"
                                                        onClick={
                                                            this.toggleModal
                                                        }
                                                    >
                                                        <img
                                                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647eeef43d800823119afa9f_icon_add-white.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="icon-btn_asset"
                                                        />
                                                        <div>Add</div>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ry_bodycontainer">
                                                <GoalItem
                                                    goalItem={goalsData}
                                                    goalUpdateFunction={
                                                        this.goalUpdate
                                                    }
                                                    goalAddCommentFunction={
                                                        this.goalComment
                                                    }
                                                    goalDeleteFunction={
                                                        this.goalDelete
                                                    }
                                                    selectedOption={
                                                        selectedOption
                                                    }
                                                />
                                                <GoalSummary
                                                    goalsData={goalsData}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showModal && (
                            <GoalAddModal
                                toggleModal={this.toggleModal}
                                handleGoalInsert={this.goalInsert}
                                goalUsers={goalsUsers}
                            />
                        )}
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
})(Goals);
