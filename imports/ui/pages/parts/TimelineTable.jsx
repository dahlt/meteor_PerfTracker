/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import XLSX from "xlsx";
import FileSaver from "file-saver";

export default class TimelineTable extends Component {
    // Array representing days of the week including Saturday and Sunday
    daysOfWeek = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

    // Helper function to convert duration to minutes
    convertDurationToMinutes = (durationString) => {
        if (!durationString) return 0;

        const durationRegex = /(\d+) hr (\d+) mins/;
        const match = durationString.match(durationRegex);

        if (!match || match.length !== 3) return 0;

        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);

        if (isNaN(hours) || isNaN(minutes)) return 0;

        return hours * 60 + minutes;
    };

    // Helper function to convert minutes to duration
    convertMinutesToDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hrs === 0 && mins === 0) {
            return "00:00";
        }

        const hrsStr = hrs > 0 ? `${hrs} hrs` : "";
        const minsStr = mins > 0 ? `${mins} mins` : "";

        return `${hrsStr} ${minsStr}`.trim();
    };

    // Helper function to get the date by the day of the week and week number
    getDateByDay = (day, weekNumber) => {
        const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
        //console.log("firstDayOfYear:", firstDayOfYear);
        const firstDayOfFirstWeek = firstDayOfYear.getDay(); // Remove the "+ 1" here
        //console.log("firstDayOfFirstWeek:", firstDayOfFirstWeek);
        const dayOffset = (weekNumber - 1) * 7 + this.daysOfWeek.indexOf(day);
        //console.log("dayOffset:", dayOffset);
        const targetDate = new Date(firstDayOfYear);
        targetDate.setDate(
            firstDayOfYear.getDate() + dayOffset - firstDayOfFirstWeek
        ); // Remove the "+ dayOffset" here
        //console.log("targetDate:", targetDate);
        const formattedDate = targetDate.toISOString().split("T")[0];
        // console.log("formattedDate:", formattedDate);
        return formattedDate;
    };

    // Function to get the week number from a date
    getWeekNumber = (date) => {
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const timeDiff = date - oneJan;
        const dayOfYear = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
        const weekNum = Math.floor(dayOfYear / 7) + 1; // Use Math.floor to get the correct week number
        return weekNum;
    };

    render() {
        const {employeeData, hoursData} = this.props;

        // Create an object to store hours data per week
        const weeklyHoursData = {};

        hoursData.forEach((hoursEntry) => {
            const weekNumber = this.getWeekNumber(
                new Date(hoursEntry.createdAt)
            );
            if (!weeklyHoursData[weekNumber]) {
                weeklyHoursData[weekNumber] = [];
            }
            weeklyHoursData[weekNumber].push(hoursEntry);
        });

        return (
            <div
                id="timelineContainer"
                className="ry_tablecontainer"
                onScroll={this.handleScroll}
                style={{overflowY: "auto", maxHeight: "500px"}}
            >
                <div className="card_table">
                    <div className="rb-table students">
                        <div className="rb-table-hd">
                            <div className="rb-table-col stretch">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Name</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rb-table-col _15">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Project</div>
                                    </div>
                                </div>
                            </div>
                            {/* Map through days of the week for header cells */}
                            {this.daysOfWeek.map((day) => (
                                <div key={day} className="rb-table-col _10">
                                    <div className="rb-table-cell">
                                        <div className="table-header-div">
                                            <div>{day}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="rb-table-col _10">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Total</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rb-table-content">
                            {Object.entries(weeklyHoursData).map(
                                ([weekNumber, entries]) => {
                                    // Calculate total duration for the week
                                    const totalDuration = entries.reduce(
                                        (total, entry) => {
                                            const durationInMinutes =
                                                entry.duration
                                                    ? this.convertDurationToMinutes(
                                                          entry.duration
                                                      )
                                                    : 0;
                                            //console.log("durationInMinutes:", durationInMinutes);
                                            return total + durationInMinutes;
                                        },
                                        0
                                    );

                                    return (
                                        <div
                                            key={weekNumber}
                                            href="#"
                                            className="rb-table-row"
                                        >
                                            <div className="rb-table-col stretch"></div>
                                            <div className="rb-table-col _15">
                                                <div className="rb-table-cell">
                                                    <div className="table-text">
                                                        <div>
                                                            {
                                                                employeeData.projectName
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Map through days of the week for duration cells */}
                                            {this.daysOfWeek.map((day) => (
                                                <div
                                                    key={day}
                                                    className="rb-table-col _10"
                                                >
                                                    <div className="rb-table-cell">
                                                        <div className="table-text">
                                                            <div>
                                                                {(() => {
                                                                    const entry =
                                                                        entries.find(
                                                                            (
                                                                                entry
                                                                            ) =>
                                                                                entry.createdAt.startsWith(
                                                                                    this.getDateByDay(
                                                                                        day,
                                                                                        weekNumber
                                                                                    )
                                                                                )
                                                                        );
                                                                    const durationInMinutes =
                                                                        entry
                                                                            ? this.convertDurationToMinutes(
                                                                                  entry.duration
                                                                              )
                                                                            : 0;
                                                                    return durationInMinutes ===
                                                                        0
                                                                        ? "00:00"
                                                                        : this.convertMinutesToDuration(
                                                                              durationInMinutes
                                                                          );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="rb-table-col _10">
                                                <div className="rb-table-cell">
                                                    <div className="table-text">
                                                        <div>
                                                            {this.convertMinutesToDuration(
                                                                totalDuration
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
