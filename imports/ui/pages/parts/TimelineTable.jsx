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

    exportToExcel = () => {
        const {employeeData, hoursData} = this.props;
        const sortedHoursData = hoursData.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        // Prepare data for export
        const data = [];
        const weeklyHoursData = {};

        sortedHoursData.forEach((hoursEntry) => {
            const entryDate = new Date(hoursEntry.createdAt);
            const weekNumber = this.getWeekNumber(entryDate);

            if (!weeklyHoursData[weekNumber]) {
                weeklyHoursData[weekNumber] = {
                    name: employeeData.fullName,
                    team: employeeData.team,
                    sat: "",
                    sun: "",
                    mon: "",
                    tue: "",
                    wed: "",
                    thu: "",
                    fri: "",
                    total: 0
                };
            }

            const dayOfWeek = this.daysOfWeek[entryDate.getDay()];
            weeklyHoursData[weekNumber][dayOfWeek.toLowerCase()] =
                hoursEntry.duration;
            weeklyHoursData[weekNumber].total += this.convertDurationToMinutes(
                hoursEntry.duration
            );
        });

        // Convert weeklyHoursData object to an array for export
        for (const weekNumber in weeklyHoursData) {
            data.push([
                weeklyHoursData[weekNumber].name,
                weeklyHoursData[weekNumber].team,
                weeklyHoursData[weekNumber].sat,
                weeklyHoursData[weekNumber].sun,
                weeklyHoursData[weekNumber].mon,
                weeklyHoursData[weekNumber].tue,
                weeklyHoursData[weekNumber].wed,
                weeklyHoursData[weekNumber].thu,
                weeklyHoursData[weekNumber].fri,
                this.convertMinutesToDuration(weeklyHoursData[weekNumber].total)
            ]);
        }

        const worksheet = XLSX.utils.aoa_to_sheet([
            [
                "Name",
                "Team",
                "Sat",
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Total"
            ],
            ...data
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Timeline");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        FileSaver.saveAs(blob, "timeline.xlsx");
    };

    handleScroll = () => {
        clearTimeout(this.debounceTimer); // Clear any previous timer
        this.debounceTimer = setTimeout(() => {
            const {loadMore} = this.props;
            const container = document.getElementById("timelineContainer");

            if (
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 20
            ) {
                loadMore();
            }
        }, 200); // Adjust the debounce delay as needed (in milliseconds)
    };

    render() {
        const {employeeData, hoursData, startDate, endDate, filterCriteria} =
            this.props;

        // Apply the totalHours filter (if filterCriteria is present)
        let filteredHoursData = hoursData;
        if (filterCriteria) {
            const {totalHours, totalHoursFilterType} = filterCriteria;

            filteredHoursData = filteredHoursData.filter((hoursEntry) => {
                // Extract the hours number from the duration string
                const durationRegex = /(\d+) hr/;
                const match = hoursEntry.duration.match(durationRegex);
                const entryTotalHours = match ? parseInt(match[1], 10) : 0;

                if (totalHoursFilterType === "higher") {
                    return entryTotalHours > totalHours;
                } else if (totalHoursFilterType === "lower") {
                    return entryTotalHours < totalHours;
                }

                return true; // Return true if no filter criteria or invalid filter type
            });
        }

        // Apply the date filter (if startDate and endDate are available)
        if (startDate && endDate) {
            const nextDayEndDate = new Date(endDate);
            nextDayEndDate.setDate(nextDayEndDate.getDate() + 1);

            filteredHoursData = filteredHoursData.filter((hoursEntry) => {
                const entryDate = new Date(hoursEntry.createdAt);
                return entryDate >= startDate && entryDate < nextDayEndDate;
            });
        }

        // Create an object to store hours data per week
        const weeklyHoursData = {};

        filteredHoursData.forEach((hoursEntry) => {
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
                                            <div className="rb-table-col stretch">
                                                <div className="rb-table-cell">
                                                    <div className="div-block-398">
                                                        <div className="ry_person-style2">
                                                            <img
                                                                src={
                                                                    employeeData[0]
                                                                        .profilePicture
                                                                }
                                                                loading="lazy"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="table-text">
                                                            <div>
                                                                {
                                                                    employeeData[0]
                                                                        .fullName
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rb-table-col _15">
                                                <div className="rb-table-cell">
                                                    <div className="table-text">
                                                        <div>
                                                            {
                                                                employeeData[0]
                                                                    .team
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
