/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
// import Client from "../../../api/classes/client/Client";
import moment from "moment";

export default class FeedbackBodyRight extends Component {

    render() {
        const { surveyData } = this.props;
        const latestData = surveyData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        // console.log(latestData)
        const surveyProgress = latestData.surveyProgress;
        // console.log(surveyProgress);
        return (

            <div className="ry_bodycontainer_right">
                <div className="card_dashboard _w-100">
                    <div className="card_dashboard_top-left">
                        <div className="ry_person-style1">
                            <img
                                src={latestData.profilePicture}
                                loading="lazy" alt="" />
                        </div>
                        <div className="div-block-382">
                            <h1 className="ry_h3-display1">{latestData.employeeName}</h1>
                            <div className="ry_p-style1">{latestData.team}</div>
                        </div>
                    </div>
                    <div className="ry_cardcontent-style1 mt-10">
                        <div className="ry_cardcontent_row no-border">
                            <div className="ry_cardcontent_rowcol">
                                <p className="ry_p-style1 mb-0">Hire Date</p>
                            </div>
                            <div className="ry_cardcontent_rowcol justfiy-right">
                                <p className="ry_p-style1 mb-0 text-darkblue">{moment(latestData.hiredDate).format("D MMM, YYYY")}</p>
                            </div>
                        </div>
                        <div className="ry_cardcontent_row no-border">
                            <div className="ry_cardcontent_rowcol">
                                <p className="ry_p-style1 mb-0">Review Cycle</p>
                            </div>
                            <div className="ry_cardcontent_rowcol justfiy-right">
                                <p className="ry_p-style1 mb-0 text-darkblue align-right">{latestData.reviewCycle}</p>
                            </div>
                        </div>
                        <div className="ry_linedivider"></div>
                        <div className="ry_cardtop">
                            <div className="div-block-395">
                                <div className="card_dashboard-label">Survey Progress</div>
                            </div>
                        </div>
                        <div className="ry_cardcontent_row no-border">
                            <div className="ry_cardcontent_rowcol">
                                <p className="ry_p-style1 mb-0">Invited</p>
                            </div>
                            <div className="ry_cardcontent_rowcol justfiy-right">
                                <p className="ry_p-style1 mb-0 text-darkblue">{surveyProgress["invited"]}</p>
                            </div>
                        </div>
                        <div className="ry_cardcontent_row no-border">
                            <div className="ry_cardcontent_rowcol">
                                <p className="ry_p-style1 mb-0">Done</p>
                            </div>
                            <div className="ry_cardcontent_rowcol justfiy-right">
                                <p className="ry_p-style1 mb-0 text-darkblue">
                                    {surveyProgress["done"]}
                                    ({(surveyProgress["done"] / surveyProgress["invited"] * 100).toFixed(0)}%)
                                </p>
                            </div>
                        </div>
                        <div className="ry_cardcontent_row no-border">
                            <div className="ry_cardcontent_rowcol">
                                <p className="ry_p-style1 mb-0">Not Responded</p>
                            </div>
                            <div className="ry_cardcontent_rowcol justfiy-right">
                                <p className="ry_p-style1 mb-0 text-darkblue">
                                    {surveyProgress["not responded"]}
                                    ({(surveyProgress["not responded"] / surveyProgress["invited"] * 100).toFixed(0)}%)
                                </p>
                            </div>
                        </div>
                        <div className="ry_cardcontent_row no-border">
                            <div className="ry_cardcontent_rowcol">
                                <p className="ry_p-style1 mb-0">Declined</p>
                            </div>
                            <div className="ry_cardcontent_rowcol justfiy-right">
                                <p className="ry_p-style1 mb-0 text-darkblue">{surveyProgress["declined"]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}