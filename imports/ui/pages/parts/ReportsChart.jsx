/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, {Component} from "react";
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Tooltip
} from "chart.js";

export default class ReportsChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTimePeriod: "ThisWeek"
        };
    }

    calculateProductivityPercentage = (hoursEntry) => {
        const {duration, activeHours} = hoursEntry;

        if (duration === "0 hr 0 mins") {
            return 0;
        }

        const durationParts = duration.split(" ");
        const totalDurationHours = parseInt(durationParts[0], 10);
        const totalDurationMinutes = parseInt(durationParts[2], 10);

        const activeHoursParts = activeHours.split(" ");
        const totalActiveHours = parseInt(activeHoursParts[0], 10);
        const totalActiveMinutes = parseInt(activeHoursParts[2], 10);

        const totalDurationInMinutes =
            totalDurationHours * 60 + totalDurationMinutes;
        const totalActiveInMinutes = totalActiveHours * 60 + totalActiveMinutes;

        const productivityPercentage =
            (totalActiveInMinutes / totalDurationInMinutes) * 100;
        return productivityPercentage;
    };

    getTop5Members = () => {
        const {hoursData} = this.props;
        const currentTime = new Date();
        const lastWeek = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate() - 7
        );
        const lastMonth = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth() - 1,
            currentTime.getDate()
        );
        let startDate = new Date();
        let endDate = new Date(); // Add this variable for the end date

        if (this.state.selectedTimePeriod === "ThisWeek") {
            startDate = lastWeek;
            endDate = currentTime; // Use current time as the end date for this week
        } else if (this.state.selectedTimePeriod === "LastWeek") {
            const lastWeekStart = new Date(
                lastWeek.getFullYear(),
                lastWeek.getMonth(),
                lastWeek.getDate() - 7
            );
            startDate = lastWeekStart;
            endDate = lastWeek; // Use the end of last week as the end date
        } else if (this.state.selectedTimePeriod === "Monthly") {
            startDate = lastMonth;
            endDate = currentTime; // Use current time as the end date for the monthly period
        }

        console.log("Selected Time Period:", this.state.selectedTimePeriod);
        console.log("Data range:", startDate, endDate); // Log the start and end dates

        // Filter hoursData based on the selected time period
        const filteredHoursData = hoursData.filter((hoursEntry) => {
            const entryDate = new Date(hoursEntry.createdAt);
            return entryDate >= startDate && entryDate <= endDate;
        });

        // Calculate productivity percentage for each hours entry
        const hoursDataWithPercentage = filteredHoursData.map((hoursEntry) => ({
            ...hoursEntry,
            productivityPercentage:
                this.calculateProductivityPercentage(hoursEntry)
        }));

        // Sort the hoursDataWithPercentage array in descending order based on productivity percentage
        const sortedHoursData = hoursDataWithPercentage.sort(
            (a, b) => b.productivityPercentage - a.productivityPercentage
        );

        // Get the top 5 entries
        const top5Entries = sortedHoursData.slice(0, 5);

        return top5Entries;
    };

    handleTimePeriodChange = (event) => {
        const selectedTimePeriod = event.target.value;
        this.setState({selectedTimePeriod}, () => {
            if (this.chart) {
                this.chart.destroy();
            }
            this.createChart();
        });
    };

    createChart = () => {
        Chart.register(
            CategoryScale,
            LinearScale,
            BarController,
            BarElement,
            Tooltip
        );
        const top5Entries = this.getTop5Members();
        const memberNames = top5Entries.map((entry) => entry.createdAt);
        const productivityPercentages = top5Entries.map((entry) =>
            this.calculateProductivityPercentage(entry)
        );

        const ctx = document.getElementById("myChart").getContext("2d");
        this.chart = new Chart(ctx, {
            type: "bar", // Use bar chart type
            data: {
                labels: memberNames, // Use member names as labels
                datasets: [
                    {
                        label: "Productivity Percentage",
                        data: productivityPercentages,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100 // Set the max value of the y-axis to 100 for percentage
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.formattedValue;
                                const roundedValue = Number(value).toFixed(2);
                                return `${roundedValue}%`;
                            }
                        }
                    }
                }
            }
        });
    };

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate() {
        if (this.chart) {
            this.chart.destroy();
        }

        this.createChart();
    }

    render() {
        const {hoursData} = this.props;
        console.log(hoursData);
        return (
            <div className="div-block-399">
                <div className="card_dashboard _w-100">
                    <div className="w-form">
                        <form
                            id="email-form-2"
                            name="email-form-2"
                            data-name="Email Form 2"
                            method="get"
                        >
                            <div className="ry_cardtop">
                                <div className="card_dashboard-label">
                                    Top Performances
                                </div>
                                <div>
                                    <select
                                        id="field-3"
                                        name="field-3"
                                        data-name="Field 3"
                                        className="ry_selectfieldsmall w-select"
                                        value={this.state.selectedTimePeriod}
                                        onChange={this.handleTimePeriodChange}
                                    >
                                        <option value="ThisWeek">
                                            This Week
                                        </option>
                                        <option value="LastWeek">
                                            Last Week
                                        </option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="ry_barchart">
                                <canvas
                                    id="myChart"
                                    width="400"
                                    height="200"
                                ></canvas>
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
