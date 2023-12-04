/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, {Component} from "react";
import GoalUpdateModal from "./GoalUpdateModal";
import GoalCommentModal from "./GoalCommentModal";

export default class GoalItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showCommentModal: false,
            selectedGoal: null,
            selectedGoalId: null
        };
    }

    handleCommentAdd = (goalId, goal) => {
        this.setState({
            showCommentModal: true,
            selectedGoal: goal,
            selectedGoalId: goal._id._str
        });
    };

    handleGoalEdit = (goalId, goal) => {
        // Check if the status is "Completed"
        if (goal.status !== "Completed") {
            const selectedGoal = {...goal, _id: goal._id._str.toString()};
            this.setState({
                showModal: true,
                selectedGoal: selectedGoal,
                selectedGoalId: goal._id._str
            });
        }
    };

    handleGoalComplete = (goalId, goal) => {
        const selectedGoal = {...goal, _id: goal._id._str.toString()};

        const {goalCompleteFunction} = this.props;

        const selectedGoalId = goal._id._str;

        goalCompleteFunction(selectedGoalId);
        //this.clearForm();
    };

    toggleModal = () => {
        this.setState({showModal: false});
    };

    toggleCommentModal = () => {
        this.setState({showCommentModal: false});
    };

    getStatusColor = (status) => {
        if (status === "On Track") {
            return "#009245"; // green
        } else if (status === "Behind") {
            return "#FFC107"; // yellow
        } else if (status === "At Risk") {
            return "#FF0000"; // red
        } else if (status === "Completed") {
            return "#0000FF"; // blue
        }
        return "#009245";
    };

    calculateRemainingDays = (completionDate) => {
        const today = new Date();
        const targetDate = new Date(completionDate);
        const timeDifference = targetDate.getTime() - today.getTime();
        const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return remainingDays;
    };

    render() {
        const {
            goalItem,
            goalUpdateFunction,
            goalAddCommentFunction,
            goalDeleteFunction,
            selectedOption
        } = this.props;

        //console.log(goalItem);

        const filteredGoalItems = goalItem.filter((item) => {
            if (selectedOption === "On Track") {
                return item.status === "On Track"; // Return all items when "All" is selected
            } else if (selectedOption === "Behind") {
                return item.status === "Behind"; // Filter based on the selected option
            } else if (selectedOption === "At Risk") {
                return item.status === "At Risk";
            } else {
                return true;
            }
        });

        //const goalItems = Array.isArray(goalItem.data) ? goalItem.data : [];
        // console.log("filteredGoalItems:", filteredGoalItems);

        return (
            <div className="ry_bodycontainer_left">
                {filteredGoalItems.map((item, index) => (
                    <div className="ry_review" key={index}>
                        <div className="ry_reviewleft">
                            <div
                                className="ry_goalsstatus"
                                style={{
                                    backgroundColor: this.getStatusColor(
                                        item.status
                                    )
                                }}
                            ></div>
                        </div>
                        <div className="ry_reviewright flex-horizontal">
                            <div className="ry_reviewrighttop flex-vertical">
                                <p className="ry_p-style1 mb-0 text-darkblue">
                                    {item.status === "On Track" ||
                                    item.status === "At Risk" ||
                                    item.status === "Behind"
                                        ? `${item.title} - ${item.difficulty.value}`
                                        : `${item.title} - ${item.difficulty.value} - Completed`}
                                </p>
                                <p className="ry_p-style2">
                                    Owners: {item.owner}
                                </p>
                                <div className="ry_reviewmicro mt-10">
                                    <div
                                        className="ry_reviewmicro_icon"
                                        onClick={() =>
                                            this.handleCommentAdd(
                                                item._id,
                                                item
                                            )
                                        }
                                    >
                                        <img
                                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f3b7ec8d98bb32195c8ea_review_02.svg"
                                            loading="lazy"
                                            alt=""
                                        />
                                    </div>
                                    <div>{item.comments.length}</div>
                                </div>
                            </div>
                            <div className="ry_reviewrightbottom flex-vertical">
                                <h1 className="ry_h3-display1 text-violet">
                                    {item.progress}%
                                </h1>
                                {item.status === "On Track" ||
                                item.status === "At Risk" ||
                                item.status === "Behind" ? (
                                    <p className="ry_p-style2">
                                        Ends in{" "}
                                        {this.calculateRemainingDays(
                                            item.completionDate
                                        )}{" "}
                                        days
                                    </p>
                                ) : (
                                    <p className="ry_p-style2">Ended</p>
                                )}
                                {item.status === "On Track" ||
                                item.status === "At Risk" ||
                                item.status === "Behind" ? (
                                    <div className="ry_form-btn_containers">
                                        <button
                                            onClick={() =>
                                                this.handleGoalComplete(
                                                    item._id,
                                                    item
                                                )
                                            }
                                            type="button"
                                            className="ry_btn-style2 w-button"
                                        >
                                            Complete
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div
                            className="ry_options"
                            onClick={() => this.handleGoalEdit(item._id, item)}
                        >
                            <img
                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/648048a50a92ccf7494e67f5_goals_01.svg"
                                loading="lazy"
                                alt=""
                            />
                        </div>
                    </div>
                ))}
                {this.state.showModal && (
                    <GoalUpdateModal
                        selectedGoal={this.state.selectedGoal}
                        selectedGoalId={this.state.selectedGoalId}
                        toggleModal={this.toggleModal}
                        goalUpdateFunction={goalUpdateFunction}
                        goalDeleteFunction={goalDeleteFunction}
                        goalUsers={this.props.goalUsers}
                        user={this.props.user}
                    />
                )}

                {this.state.showCommentModal && (
                    <GoalCommentModal
                        toggleModal={this.toggleCommentModal}
                        selectedGoal={this.state.selectedGoal}
                        selectedGoalId={this.state.selectedGoalId}
                        goalCommentFunction={goalAddCommentFunction}
                    />
                )}
            </div>
        );
    }
}
