/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

export default class InsightsTopCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todayHours: 0,
            todayMinutes: 0,
            yesterdayHours: 0,
            yesterdayMinutes: 0,
            thisWeekHours: 0,
            thisWeekMinutes: 0,
            activeProjects: 0,
            averageProductivity: 0,
            chartInstance: null,
            allHours: []
        };
    }

    componentDidMount() {
        const {attendanceItem, attendanceHoursCalculate} = this.props;
        this.computeAttendanceHours(
            attendanceItem,
            attendanceHoursCalculate
        ).then(() => {
            this.createChart();
        });
    }

    async componentDidUpdate(prevProps) {
        const {attendanceItem, attendanceHoursCalculate} = this.props;
        if (attendanceItem !== prevProps.attendanceItem) {
            await this.computeAttendanceHours(
                attendanceItem,
                attendanceHoursCalculate
            );
            this.createChart();
        }
    }

    createChart = () => {
        const {chartInstance, allHours} = this.state;

        // Destroy the existing Chart instance if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        const ctx = document.getElementById("attendanceChart").getContext("2d");

        const sortDates = (dates) => {
            return dates.sort((a, b) => new Date(a) - new Date(b));
        };

        // Extract the dates and attendance hours from attendanceData
        const {attendanceItem} = this.props;
        const dates = attendanceItem.map((data) => data.createdAt);
        const sortedDates = sortDates(dates);
        const attendanceHours = allHours.map(
            (hoursData) => hoursData.hours + hoursData.minutes / 60
        );

        Chart.register(
            CategoryScale,
            LinearScale,
            BarController,
            BarElement,
            Tooltip,
            Legend
        );

        const datasets = [
            {
                label: "Productive",
                data: [],
                backgroundColor: "rgba(0, 255, 0, 0.6)",
                stack: "stack"
            },
            {
                label: "Unproductive",
                data: [],
                backgroundColor: "rgba(255, 0, 0, 0.6)",
                stack: "stack"
            },
            {
                label: "Neutral",
                data: [],
                backgroundColor: "rgba(128, 128, 128, 0.6)",
                stack: "stack"
            }
        ];

        attendanceItem.forEach((item, index) => {
            const performanceData = item.performance;
            const productive = performanceData.find(
                (data) => "productive" in data
            );
            const unproductive = performanceData.find(
                (data) => "unproductive" in data
            );
            const neutral = performanceData.find((data) => "neutral" in data);

            const productiveValue = productive ? productive.productive : 0;
            const unproductiveValue = unproductive
                ? unproductive.unproductive
                : 0;
            const neutralValue = neutral ? neutral.neutral : 0;

            const totalLoggedHours = attendanceHours[index];

            const totalValue =
                productiveValue + unproductiveValue + neutralValue;

            const productivePercentage = (productiveValue / totalValue) * 100;
            const unproductivePercentage =
                (unproductiveValue / totalValue) * 100;
            const neutralPercentage = (neutralValue / totalValue) * 100;

            datasets[0].data.push(
                (productivePercentage / 100) * totalLoggedHours
            );
            datasets[1].data.push(
                (unproductivePercentage / 100) * totalLoggedHours
            );
            datasets[2].data.push((neutralPercentage / 100) * totalLoggedHours);
        });

        const newChartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: sortedDates,
                datasets
            },
            options: {
                scales: {
                    x: {
                        type: "category",
                        stacked: true // Enable stacking for the x-axis (dates)
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        max: 10,
                        ticks: {
                            callback: (value) => {
                                const hours = Math.floor(value);
                                const minutes = Math.round((value % 1) * 60);
                                return `${hours}h ${minutes}m`;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        mode: "index", // Show tooltips for each stacked bar
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                const datasetIndex = context.datasetIndex;
                                const dataset =
                                    context.chart.data.datasets[datasetIndex];
                                const dataPoint =
                                    dataset.data[context.dataIndex];
                                const labels = [
                                    "Productive",
                                    "Unproductive",
                                    "Neutral"
                                ];
                                const percentage =
                                    (dataPoint /
                                        attendanceHours[context.dataIndex]) *
                                    100;
                                const formattedPercentage = percentage
                                    .toFixed(2)
                                    .replace(/\.00$/, "");
                                return `${labels[datasetIndex]}: ${formattedPercentage}%`;
                            }
                        }
                    },
                    legend: {
                        display: true,
                        labels: {
                            generateLabels: (chart) => {
                                const data = chart.data;
                                if (
                                    data.labels.length &&
                                    data.datasets.length
                                ) {
                                    return data.datasets.flatMap(
                                        (dataset, datasetIndex) => ({
                                            text: dataset.label,
                                            fillStyle: dataset.backgroundColor
                                        })
                                    );
                                }
                                return [];
                            }
                        }
                    }
                }
            }
        });

        newChartInstance.update();

        this.setState({chartInstance: newChartInstance});
    };

    computeAttendanceHours(attendanceItem, attendanceHoursCalculate) {
        return new Promise((resolve, reject) => {
            let todayHours = 0;
            let todayMinutes = 0;
            let yesterdayHours = 0;
            let yesterdayMinutes = 0;
            let thisWeekHours = 0;
            let thisWeekMinutes = 0;
            let activeProjects = 0;
            let productivityYesterday = 0;
            let productivityToday = 0;
            let productivityLastWeek = 0;
            let productivitySum = 0;
            let productivityCount = 0;
            let allHours = []; // Array to store the computed hours

            const promises = attendanceItem.map((attendanceData) => {
                const {loggedInTime} = attendanceData.attendance[0];
                const {loggedOutTime} = attendanceData.attendance[1];

                return attendanceHoursCalculate(loggedInTime, loggedOutTime)
                    .then((result) => {
                        // Update the state with computed hours
                        if (attendanceData.createdAt === "2023-07-12") {
                            todayHours += result.hours;
                            todayMinutes += result.minutes;
                            if (
                                attendanceData.performance &&
                                attendanceData.performance.length > 0
                            ) {
                                const todayPerformance =
                                    attendanceData.performance.find(
                                        (perf) =>
                                            Object.keys(perf)[0] ===
                                            "productive"
                                    );
                                if (todayPerformance) {
                                    productivityToday =
                                        todayPerformance.productive;
                                }
                            }
                        } else if (attendanceData.createdAt === "2023-07-11") {
                            yesterdayHours += result.hours;
                            yesterdayMinutes += result.minutes;
                            if (
                                attendanceData.performance &&
                                attendanceData.performance.length > 0
                            ) {
                                const yesterdayPerformance =
                                    attendanceData.performance.find(
                                        (perf) =>
                                            Object.keys(perf)[0] ===
                                            "productive"
                                    );
                                if (yesterdayPerformance) {
                                    productivityYesterday =
                                        yesterdayPerformance.productive;
                                }
                            }
                        }

                        // Compute the hours for this week
                        const createdAtDate = new Date(
                            attendanceData.createdAt
                        );
                        const currentDate = new Date();
                        const daysDifference = Math.floor(
                            (currentDate - createdAtDate) /
                                (1000 * 60 * 60 * 24)
                        );

                        if (daysDifference <= 6) {
                            thisWeekHours += result.hours;
                            thisWeekMinutes += result.minutes;
                            if (
                                attendanceData.performance &&
                                attendanceData.performance.length > 0
                            ) {
                                const weekPerformance =
                                    attendanceData.performance.find(
                                        (perf) =>
                                            Object.keys(perf)[0] ===
                                            "productive"
                                    );
                                if (weekPerformance) {
                                    const productivity =
                                        weekPerformance.productive;
                                    productivitySum += productivity;
                                    productivityCount++;
                                }
                            }
                        }

                        // Update the count of active projects
                        activeProjects = attendanceData.activeProjects;

                        // Store the computed hours in the allHours array
                        allHours.push({
                            hours: result.hours,
                            minutes: result.minutes
                        });
                    })
                    .catch((error) => {
                        console.log("Error computing attendance hours:", error);
                    });
            });

            Promise.all(promises)
                .then(() => {
                    // Update the state with the computed hours and allHours array
                    this.setState(
                        {
                            todayHours,
                            todayMinutes,
                            yesterdayHours,
                            yesterdayMinutes,
                            thisWeekHours,
                            thisWeekMinutes,
                            activeProjects,
                            productivityYesterday,
                            productivityToday,
                            productivityLastWeek,
                            averageProductivity:
                                productivitySum / productivityCount || 0,
                            allHours
                        },
                        () => {
                            resolve(); // Resolve the promise after updating the state
                        }
                    );
                })
                .catch(reject);
        });
    }

    render() {
        const {
            todayHours,
            todayMinutes,
            yesterdayHours,
            yesterdayMinutes,
            thisWeekHours,
            thisWeekMinutes,
            activeProjects,
            productivityYesterday,
            productivityToday,
            averageProductivity,
            allHours
        } = this.state;

        const formattedAverageProductivity = averageProductivity.toFixed(2);

        return (
            <div className="reports_top-card_container">
                <div className="card_dashboard_top _w-33">
                    <div className="card_dashboard_top-left justify-spacebetween">
                        <div className="div-block-382">
                            <div className="card_dashboard-label">Today</div>
                            <div className="ry_p-style1">
                                <span className="span-green">
                                    {productivityToday}%
                                </span>{" "}
                                today
                            </div>
                        </div>
                        <h1 className="ry_h3-display1 weight-semibold">
                            {todayHours}h {todayMinutes}m
                        </h1>
                    </div>
                    <div className="card-dashboard_top-right horizontal">
                        <div className="ry_p-style1">
                            <span className="span-darkblue">
                                {activeProjects}
                            </span>{" "}
                            Active Projects
                        </div>
                    </div>
                </div>
                <div className="card_dashboard_top _w-33">
                    <div className="card_dashboard_top-left justify-spacebetween">
                        <div className="div-block-382">
                            <div className="card_dashboard-label">
                                Yesterday
                            </div>
                            <div className="ry_p-style1">
                                <span className="span-red">
                                    {productivityYesterday}%
                                </span>{" "}
                                yesterday
                            </div>
                        </div>
                        <h1 className="ry_h3-display1 weight-semibold">
                            {yesterdayHours}h {yesterdayMinutes}m
                        </h1>
                    </div>
                    <div className="card-dashboard_top-right horizontal">
                        <div className="ry_p-style1">
                            <span className="span-darkblue">
                                {activeProjects}
                            </span>{" "}
                            Active Projects
                        </div>
                    </div>
                </div>
                <div className="card_dashboard_top _w-33">
                    <div className="card_dashboard_top-left justify-spacebetween">
                        <div className="div-block-382">
                            <div className="card_dashboard-label">
                                This Week
                            </div>
                            <div className="ry_p-style1">
                                <span className="span-red">
                                    {formattedAverageProductivity}%
                                </span>{" "}
                                this week
                            </div>
                        </div>
                        <h1 className="ry_h3-display1 weight-semibold">
                            {thisWeekHours}h {thisWeekMinutes}m
                        </h1>
                    </div>
                    <div className="card-dashboard_top-right horizontal">
                        <div className="ry_p-style1">
                            <span className="span-darkblue">
                                {activeProjects}
                            </span>{" "}
                            Active Projects
                        </div>
                    </div>
                </div>
                <canvas id="attendanceChart" width="400" height="200"></canvas>
            </div>
        );
    }
}
