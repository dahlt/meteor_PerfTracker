/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import {Chart, registerables} from "chart.js/auto";
import {Radar} from "react-chartjs-2";
import "../../../api/common";

Chart.register(...registerables);

export default class FeedbackBodyLeft extends Component {
    constructor(props) {
        super(props);
    }

    calculateTotalPoints = (data) => {
        // Sum up the points for each category
        const totalPoints = data.datasets[0].data.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
        );
        return totalPoints;
    };

    render() {
        const {feedbackData} = this.props;
        console.log("feedbackData", feedbackData);

        return (
            <div className="ry_bodycontainer_left">
                {feedbackData.map((feedback, index) => {
                    // Extract data from feedback
                    // Convert string values to numbers
                    const communication = Number(feedback.communication);
                    const teamwork = Number(feedback.teamwork);
                    const integrity = Number(feedback.integrity);
                    const accountability = Number(feedback.accountability);

                    const data = {
                        labels: [
                            "Communication",
                            "Teamwork",
                            "Integrity",
                            "Accountability"
                        ],
                        datasets: [
                            {
                                label: "Feedback Scores",
                                backgroundColor: "rgba(75,192,192,0.4)",
                                borderColor: "rgba(75,192,192,1)",
                                pointBackgroundColor: "rgba(75,192,192,1)",
                                pointBorderColor: "#fff",
                                pointHoverBackgroundColor: "#fff",
                                pointHoverBorderColor: "rgba(75,192,192,1)",
                                data: [
                                    communication,
                                    teamwork,
                                    integrity,
                                    accountability
                                ]
                            }
                        ]
                    };

                    // Calculate summary points and total
                    const summaryPoints = this.calculateTotalPoints(data);
                    const totalPoints = summaryPoints;

                    console.log("summaryPoints", summaryPoints);
                    console.log("totalPoints", totalPoints);

                    return (
                        <div key={index} className="ry_review flex-vertical">
                            <div className="ry_cardtop">
                                <div className="card_dashboard-label">
                                    Reviewer Notes
                                </div>
                            </div>
                            <div className="ry_cardbody">
                                <p className="ry_p-style1">{feedback.notes}</p>
                            </div>
                            <div className="ry_cardtop">
                                <div className="card_dashboard-label">
                                    Summary
                                </div>
                            </div>
                            <div className="ry_review flex-horizontal">
                                <div
                                    className="ry_barchart"
                                    style={{width: "400px", height: "400px"}}
                                >
                                    <Radar
                                        data={data}
                                        options={{
                                            scales: {
                                                r: {
                                                    min: 0,
                                                    max: 10 // Adjust the max value as needed
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                {/* Add a div here that shows the summary points and total */}
                                <div className="summary-container">
                                    <div className="summary-item">
                                        <p>Communication:</p>
                                        <p>{data.datasets[0].data[0]}</p>
                                    </div>
                                    <div className="summary-item">
                                        <p>Teamwork:</p>
                                        <p>{data.datasets[0].data[1]}</p>
                                    </div>
                                    <div className="summary-item">
                                        <p>Integrity:</p>
                                        <p>{data.datasets[0].data[2]}</p>
                                    </div>
                                    <div className="summary-item">
                                        <p>Accountability:</p>
                                        <p>{data.datasets[0].data[3]}</p>
                                    </div>
                                    <div className="summary-total">
                                        <p>Total Points:</p>
                                        <p>{totalPoints}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}
