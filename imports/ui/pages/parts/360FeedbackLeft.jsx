/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Tooltip,
    Legend
} from "chart.js";
import { Radar, Bar } from "react-chartjs-2";
import Client from "../../../api/classes/client/Client";
import {
    // FeedbackDataFetch
} from "../../../api/common";

export default class FeedbackBodyLeft extends Component {

    constructor(props) {
        super(props);
        this.state = {
            feedbackData: []
        };
    }

    getChartData = () => {
        const { chartData } = this.props;
        // Extract the feedback values for the employee
        const sortedData = chartData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const inputData = sortedData.map((item) => item.feedback);

        // Assuming that the first element in the chartData array is the past feedback,
        // and the second element is the latest feedback
        const pastFeedback = inputData[1];
        const latestFeedback = inputData[0];

        // Check if 'total' property already exists, if not, calculate and set the total
        if (!pastFeedback.total) {
            const pastFeedbackTotal = Object.values(pastFeedback).reduce((acc, val) => acc + val, 0);
            pastFeedback.total = pastFeedbackTotal / Object.values(pastFeedback).length;
        }

        if (!latestFeedback.total) {
            const latestFeedbackTotal = Object.values(latestFeedback).reduce((acc, val) => acc + val, 0);
            latestFeedback.total = latestFeedbackTotal / Object.values(latestFeedback).length;
        }

        // You can then use these two objects as required or return them from the function
        return { pastFeedback, latestFeedback };
    };

    createRadarChart = () => {
        const { pastFeedback, latestFeedback } = this.getChartData();


        ChartJS.register(
            RadialLinearScale,
            PointElement,
            LineElement,
            Filler,
            Tooltip,
            Legend
        );

        const data = {
            labels: [
                "Communication",
                "Teamwork",
                "Integrity",
                "Accountability",
                "Total"
            ],
            datasets: [{
                label: "Result",
                data: Object.values(latestFeedback),
                fill: true,
                backgroundColor: "rgb(0, 184, 176, 0.5)",
                borderColor: "rgb(0, 184, 176)",
                pointBackgroundColor: "rgb(0, 184, 176)",
                pointHoverBorderColor: "rgb(0, 184, 176)"
            }, {
                label: "Comparison",
                data: Object.values(pastFeedback),
                fill: true,
                backgroundColor: "rgb(183, 155, 255, 0.5)",
                borderColor: "rgb(183, 155, 255)",
                pointBackgroundColor: "rgb(183, 155, 255)",
                pointHoverBorderColor: "rgb(183, 155, 255)"
            }]
        };

        const config = {
            type: "radar",
            data: data,
            plugins: {
                legend: {
                    // display: false
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "rectRound"
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 0
                }
            },
            scales: {
                r: {
                    ticks: {
                        display: false,
                        beginAtZero: true,
                        max: 5,
                        min: 0,
                        stepSize: 1
                    }
                }
            }
        };
        return { data, config };
    };

    getCommunicationData = () => {
        const { chartData } = this.props;
        const loggedUser = Client.user().profile;
        const sortedData = chartData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        let latestEntry = null;
        for (const entry of sortedData) {
            if (entry.employeeName === loggedUser) {
                latestEntry = entry;
                break;
            }
        }

        const latestCommunicationData = latestEntry ? latestEntry.communicationData : null;

        // Get past data for the loggedUser from other entries
        const pastCommunicationData = sortedData
            .filter((entry) => entry.employeeName === loggedUser && entry !== latestEntry) // Filter out the latest entry
            .map((entry) => entry.communicationData);
        const pastData = pastCommunicationData[0];


        return { latestCommunicationData, pastData };
    };


    createBarChart = () => {
        const { latestCommunicationData, pastData } = this.getCommunicationData();
        // console.log(latestCommunicationData);
        ChartJS.register(
            CategoryScale,
            LinearScale,
            RadialLinearScale,
            PointElement,
            LineElement,
            BarElement,
            Filler,
            Tooltip,
            Legend
        );
        const barData = {
            labels: ["Self", "Manager", "Direct Reports"],
            datasets: [{
                label: "",
                data: Object.values(latestCommunicationData),
                backgroundColor: "rgb(0, 184, 176)",
                categoryPercentage: .50,
                barPercentage: .45,
                datalabels: {
                    anchor: "end",
                    align: "center",
                    labels: {
                        title: {
                            font: {
                                weight: "bold"
                            }
                        }
                    }
                }

            },
            {
                label: "",
                data: Object.values(pastData),
                backgroundColor: "rgb(183, 155, 255)",
                categoryPercentage: .50,
                barPercentage: .45,
                datalabels: {
                    anchor: "end",
                    align: "center",
                    labels: {
                        title: {
                            font: {
                                weight: "bold"
                            }
                        }
                    }
                }
            }]
        };

        const barConfig = {
            indexAxis: "y",
            responsive: true,

            elements: {
                bar: {
                    borderWidth: 0
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }

            }
        };
        return { barData, barConfig };
    };
    getLatestResponse = () => {
        const { chartData } = this.props;

        // Sort the chartData based on createdAt in descending order
        chartData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Get the latest index response
        const latestResponse = chartData.length > 0 ? chartData[0].response : null;
        return latestResponse;
    };

    componentDidMount() {
        this.getChartData();
        this.createRadarChart();
        this.createBarChart();
        this.getCommunicationData();
    }

    render() {
        const { data, config } = this.createRadarChart();
        const { barData, barConfig } = this.createBarChart();
        const { pastFeedback, latestFeedback } = this.getChartData();

        const latestResponse = this.getLatestResponse();
        const formatToDecimalOne = (number) => Number(number).toFixed(1);
        const toUpperCaseCategory = (category) => category.toUpperCase();
        return (
            <div className="ry_bodycontainer_left">
                <div className="ry_review flex-vertical">
                    <div className="ry_cardtop">
                        <div className="card_dashboard-label">Reviewee Notes</div>
                    </div>
                    <div className="ry_cardbody">
                        <p className="ry_p-style1">{latestResponse}</p>
                    </div>
                </div>
                <div className="ry_review flex-vertical">
                    <div className="ry_cardtop">
                        <div className="card_dashboard-label">Summary</div>
                    </div>
                    <div className="ry_barchart">
                        <div>
                            <Radar
                                width={300}
                                data={data}
                                options={config}

                            />
                        </div>
                        <table style={{ height: "150px" }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>RESULT</th>
                                    <th>COMPARISON</th>
                                    <th>GAP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(latestFeedback).map((category) => (
                                    <tr key={category}>
                                        <td>{toUpperCaseCategory(category)}</td>
                                        <td>{formatToDecimalOne(latestFeedback[category])}</td>
                                        <td>{formatToDecimalOne(pastFeedback[category])}</td>
                                        <td>{formatToDecimalOne(latestFeedback[category] - pastFeedback[category])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className="ry_review flex-vertical">
                    <div className="ry_cardtop">
                        <div className="card_dashboard-label">Communication</div>
                    </div>
                    <div className="ry_barchart">
                        <Bar data={barData} options={barConfig} />
                    </div>
                </div>
            </div>
        );
    }
}
