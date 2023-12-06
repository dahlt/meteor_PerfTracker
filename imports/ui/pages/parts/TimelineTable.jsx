/* eslint-disable react/prop-types */
import React, {Component} from "react";

class TimelineTable extends Component {
    daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    convertDurationToMinutes = (durationString) => {
        if (!durationString) return 0;

        const durationRegex = /(\d+):(\d+):(\d+)/;
        const match = durationString.match(durationRegex);

        if (!match || match.length !== 4) return 0;

        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);

        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return 0;

        return hours * 60 + minutes + seconds / 60;
    };

    convertMinutesToDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);

        return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
            2,
            "0"
        )}`;
    };

    getWeekNumber = (date) => {
        // Adjust the date to consider Monday as the first day of the week
        date.setHours(0, 0, 0, 0);
        const day = date.getDay();
        const mondayDate = new Date(date);
        mondayDate.setDate(date.getDate() - day + (day === 0 ? -6 : 1));

        const oneJan = new Date(mondayDate.getFullYear(), 0, 1);
        const timeDiff = mondayDate - oneJan;
        const dayOfYear = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
        const weekNum = Math.floor(dayOfYear / 7) + 1;
        return weekNum;
    };

    getDateByDay = (day, weekNumber) => {
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const dayOfMonth = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${dayOfMonth}`;
        };

        const today = new Date();
        const currentYear = today.getFullYear();
        const firstDayOfYear = new Date(currentYear, 0, 1);
        const firstDayOfFirstWeek = firstDayOfYear.getDay();
        const dayOffset = (weekNumber - 1) * 7 + this.daysOfWeek.indexOf(day);
        const targetDate = new Date(firstDayOfYear);
        targetDate.setDate(
            firstDayOfYear.getDate() + dayOffset - firstDayOfFirstWeek
        );
        return formatDate(targetDate);
    };

    render() {
        const {employeeData, hoursData, isAdmin} = this.props;

        console.log(isAdmin, employeeData);
        const weeklyHoursData = {};

        hoursData.forEach((hoursEntry) => {
            const weekNumber = this.getWeekNumber(
                new Date(hoursEntry.originalDate)
            );
            if (!weeklyHoursData[weekNumber]) {
                weeklyHoursData[weekNumber] = [];
            }
            weeklyHoursData[weekNumber].push(hoursEntry);
        });

        return (
            <div
                className="ry_tablecontainer"
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
                                    const totalDuration = entries.reduce(
                                        (total, entry) => {
                                            const durationInMinutes =
                                                entry.tracked
                                                    ? this.convertDurationToMinutes(
                                                          entry.tracked
                                                      )
                                                    : 0;
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
                                                    <div className="table-text">
                                                        {!isAdmin
                                                            ? employeeData
                                                                  .profile.name
                                                            : employeeData}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rb-table-col _15">
                                                <div className="rb-table-cell">
                                                    <div className="table-text">
                                                        {entries.length > 0
                                                            ? entries[0]
                                                                  .projectName
                                                            : ""}
                                                    </div>
                                                </div>
                                            </div>
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
                                                                                entry.originalDate ===
                                                                                this.getDateByDay(
                                                                                    day,
                                                                                    weekNumber
                                                                                )
                                                                        );
                                                                    const durationInMinutes =
                                                                        entry
                                                                            ? this.convertDurationToMinutes(
                                                                                  entry.tracked
                                                                              )
                                                                            : 0;
                                                                    return this.convertMinutesToDuration(
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

export default TimelineTable;
