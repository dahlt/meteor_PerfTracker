/* eslint-disable no-console */
/* eslint-disable indent-legacy */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";

export default class ActivityLevelBody extends Component {
    daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
                                    const totalPercentage = entries.reduce(
                                        (total, entry) => {
                                            const percentage =
                                                entry.overall ?? 0;
                                            return (
                                                total + parseInt(percentage, 10)
                                            );
                                        },
                                        0
                                    );

                                    const averagePercentage =
                                        entries.length > 0
                                            ? (
                                                  totalPercentage /
                                                  entries.length
                                              ).toFixed(2)
                                            : 0;

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
                                                                    const percentage =
                                                                        entry &&
                                                                        entry.overall
                                                                            ? parseInt(
                                                                                  entry.overall,
                                                                                  10
                                                                              )
                                                                            : 0;
                                                                    return (
                                                                        <span
                                                                            style={{
                                                                                color:
                                                                                    percentage >
                                                                                    50
                                                                                        ? "green"
                                                                                        : "red"
                                                                            }}
                                                                        >
                                                                            {`${percentage}%`}
                                                                        </span>
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
                                                            {" "}
                                                            <span
                                                                style={{
                                                                    color:
                                                                        averagePercentage >
                                                                        50
                                                                            ? "green"
                                                                            : "red"
                                                                }}
                                                            >
                                                                {`${averagePercentage}%`}
                                                            </span>
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
