/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import Client from "../../../api/classes/client/Client";
import moment from "moment";
import XLSX from "xlsx";
import FileSaver from "file-saver";

export default class AttendanceBody extends Component {
    formatDate = (date) => {
        const parsedDate = moment(date, "YYYY-MM-DD");
        return parsedDate.format("ddd, MMM D");
    };

    calculateProductivityPercentage = (activeHours, duration) => {
        const durationParts = duration.split(" ");
        const totalDurationHours = parseInt(durationParts[0], 10);
        const totalDurationMinutes = parseInt(durationParts[2], 10);

        const activeHoursParts = activeHours.split(" ");
        const totalActiveHours = parseInt(activeHoursParts[0], 10);
        const totalActiveMinutes = parseInt(activeHoursParts[2], 10);

        const totalDurationInMinutes =
            totalDurationHours * 60 + totalDurationMinutes;
        const totalActiveInMinutes = totalActiveHours * 60 + totalActiveMinutes;

        const productivityPercentage = isNaN(
            (totalActiveInMinutes / totalDurationInMinutes) * 100
        )
            ? "0%"
            : Math.round(
                  (totalActiveInMinutes / totalDurationInMinutes) * 100
              ).toString() + "%";

        return productivityPercentage;
    };

    getStatusColor = (status) => {
        if (status === "Absent") {
            return "bg-red"; // red
        } else if (status === "Weekend") {
            return "bg-yellow";
        }
        return "";
    };

    getActivityColor = (percentage) => {
        // Remove the percentage sign and convert the string to a number
        const numericPercentage = parseFloat(percentage);

        if (numericPercentage >= 60) {
            return "text-green"; // green
        } else if (numericPercentage >= 30 && numericPercentage <= 59) {
            return "text-yellow"; // yellow
        } else {
            return "text-red"; // red
        }
    };

    exportToExcel = () => {
        const {attendancesData} = this.props;
        const loggedUser = Client.user().profile;

        const filteredUser = attendancesData.filter(
            (attendance) => attendance.employeeName === loggedUser
        );

        const sortedHoursData = filteredUser.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        const data = sortedHoursData.map((hoursEntry) => [
            hoursEntry.employeeName,
            hoursEntry.createdAt,
            hoursEntry.attendanceStatus,
            hoursEntry.loggedInTime,
            hoursEntry.loggedOutTime,
            hoursEntry.duration,
            this.calculateProductivityPercentage(
                hoursEntry.activeHours,
                hoursEntry.duration
            )
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([
            [
                "Name",
                "Date",
                "Status",
                "Start Time",
                "Stop Time",
                "Duration",
                "Activity"
            ],
            ...data
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        FileSaver.saveAs(blob, "attendance.xlsx");
    };

    handleScroll = () => {
        clearTimeout(this.debounceTimer); // Clear any previous timer
        this.debounceTimer = setTimeout(() => {
            const {loadMore} = this.props;
            const container = document.getElementById("attendanceContainer");

            if (
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 20
            ) {
                loadMore();
            }
        }, 200); // Adjust the debounce delay as needed (in milliseconds)
    };

    render() {
        const {attendancesData, startDate, endDate, filterCriteria} =
            this.props;
        //console.log(attendancesData);
        //console.log(attendancesData.attendanceStatus);

        // Apply the earnings filter first (if filterCriteria is present)
        let filteredAttendancesData = attendancesData;
        if (filterCriteria) {
            const {attendanceStatus} = filterCriteria;
            if (attendanceStatus === "present") {
                const filteredPresentData = attendancesData.filter(
                    (attendance) => {
                        return attendance.attendanceStatus === "Present";
                    }
                );
                filteredAttendancesData = filteredPresentData; // Update the attendancesData array
                console.log("filtered:", filteredAttendancesData);
            } else if (attendanceStatus === "absent") {
                const filteredAbsentData = attendancesData.filter(
                    (attendance) => {
                        return attendance.attendanceStatus === "Absent";
                    }
                );
                filteredAttendancesData = filteredAbsentData; // Update the attendancesData array
            }
        }
        // Apply the date range filter (if startDate and endDate are present)
        if (startDate && endDate) {
            const nextDayEndDate = new Date(endDate);
            nextDayEndDate.setDate(nextDayEndDate.getDate() + 1);

            attendancesData.filter((hoursEntry) => {
                const entryDate = new Date(hoursEntry.createdAt);
                return entryDate >= startDate && entryDate < nextDayEndDate;
            });
        }

        // const sortedHoursData = attendancesData.sort(
        //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        // );

        return (
            <div
                id="attendanceContainer"
                className="ry_bodycontainer"
                onScroll={this.handleScroll}
                style={{overflowY: "auto", maxHeight: "500px"}}
            >
                <div className="ry_tablecontainer">
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
                                            <div>Date</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rb-table-col _15">
                                    <div className="rb-table-cell">
                                        <div className="table-header-div">
                                            <div>Status</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rb-table-col _15">
                                    <div className="rb-table-cell">
                                        <div className="table-header-div">
                                            <div>Start Time</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rb-table-col _15">
                                    <div className="rb-table-cell">
                                        <div className="table-header-div">
                                            <div>Stop Time</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rb-table-col _10">
                                    <div className="rb-table-cell">
                                        <div className="table-header-div">
                                            <div>Duration</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rb-table-col _10">
                                    <div className="rb-table-cell">
                                        <div className="table-header-div">
                                            <div>Activity</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rb-table-content">
                                {filteredAttendancesData.map((item, index) => (
                                    <div
                                        href="#"
                                        className="rb-table-row"
                                        key={index}
                                    >
                                        <div className="rb-table-col stretch">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>
                                                        {item.employeeName}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>
                                                        {this.formatDate(
                                                            item.createdAt
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div
                                                    className={`ry_badge-style1 ${this.getStatusColor(
                                                        item.attendanceStatus
                                                    )}`}
                                                >
                                                    {item.attendanceStatus}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>
                                                        {item.loggedInTime}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>
                                                        {item.loggedOutTime}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _10">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>{item.duration}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _10">
                                            <div className="rb-table-cell">
                                                <div
                                                    className={`
                                                    table-text 
                                                    ${this.getActivityColor(
                                                        this.calculateProductivityPercentage(
                                                            item.activeHours,
                                                            item.duration
                                                        )
                                                    )}`}
                                                >
                                                    <div>
                                                        {this.calculateProductivityPercentage(
                                                            item.activeHours,
                                                            item.duration
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
