/* eslint-disable react/prop-types */
import React, {Component} from "react";

export default class GoalSummary extends Component {
    render() {
        const {goalsData, user} = this.props;

        //console.log("goalsData", goalsData);

        const filteredOwnedGoalItems = goalsData.filter((item) => {
            // Check if the user's profile name is among the owners
            return item.owner.includes(user.profile.name);
        });

        const onTrackCount = filteredOwnedGoalItems.filter(
            (goal) => goal.status === "On Track"
        ).length;
        const behindCount = filteredOwnedGoalItems.filter(
            (goal) => goal.status === "Behind"
        ).length;
        const atRiskCount = filteredOwnedGoalItems.filter(
            (goal) => goal.status === "At Risk"
        ).length;
        const completedCount = filteredOwnedGoalItems.filter(
            (goal) => goal.status === "Completed"
        ).length;

        return (
            <div className="ry_bodycontainer_right">
                <div className="card_dashboard _w-100">
                    <div className="w-form">
                        <form
                            id="email-form-2"
                            name="email-form-2"
                            data-name="Email Form 2"
                            method="get"
                        >
                            <div className="ry_cardtop">
                                <div className="div-block-395">
                                    <div className="card_dashboard-label">
                                        Goals Summary
                                    </div>
                                </div>
                            </div>
                            <div className="ry_cardcontent-style1">
                                <div className="ry_cardcontent_row no-border">
                                    <div className="ry_cardcontent_rowcol">
                                        <div className="ry_goalsstatus mt-0"></div>
                                        <p className="ry_p-style1 mb-0">
                                            On Track
                                        </p>
                                    </div>
                                    <div className="ry_cardcontent_rowcol _w-10">
                                        <p className="ry_p-style1 mb-0 text-darkblue">
                                            {onTrackCount}
                                        </p>
                                    </div>
                                </div>
                                <div className="ry_cardcontent_row no-border">
                                    <div className="ry_cardcontent_rowcol">
                                        <div className="ry_goalsstatus mt-0 bg-yellow"></div>
                                        <p className="ry_p-style1 mb-0">
                                            Behind
                                        </p>
                                    </div>
                                    <div className="ry_cardcontent_rowcol _w-10">
                                        <p className="ry_p-style1 mb-0 text-darkblue">
                                            {behindCount}
                                        </p>
                                    </div>
                                </div>
                                <div className="ry_cardcontent_row no-border">
                                    <div className="ry_cardcontent_rowcol">
                                        <div className="ry_goalsstatus mt-0 bg-red"></div>
                                        <p className="ry_p-style1 mb-0">
                                            At Risk
                                        </p>
                                    </div>
                                    <div className="ry_cardcontent_rowcol _w-10">
                                        <p className="ry_p-style1 mb-0 text-darkblue">
                                            {atRiskCount}
                                        </p>
                                    </div>
                                </div>
                                <div className="ry_cardcontent_row no-border">
                                    <div className="ry_cardcontent_rowcol">
                                        <div
                                            className="ry_goalsstatus mt-0"
                                            style={{backgroundColor: "#0000FF"}}
                                        ></div>
                                        <p className="ry_p-style1 mb-0">
                                            Completed
                                        </p>
                                    </div>
                                    <div className="ry_cardcontent_rowcol _w-10">
                                        <p className="ry_p-style1 mb-0 text-darkblue">
                                            {completedCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="w-form-done">
                            <div>
                                Thank you! Your submission has been received!
                            </div>
                        </div>
                        <div className="w-form-fail">
                            <div>
                                Oops! Something went wrong while submitting the
                                form.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
