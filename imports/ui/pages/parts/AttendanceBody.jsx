/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, {Component} from "react";

export default class AttendanceBody extends Component {
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

    render() {
        const {attendancesData, employeeData} = this.props;
        console.log(attendancesData);
        //console.log(attendancesData.attendanceStatus);

        return (
            <div
                id="attendanceContainer"
                className="ry_bodycontainer"
                // onScroll={this.handleScroll}
                // style={{overflowY: "auto", maxHeight: "500px"}}
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
                                {attendancesData.map((item, index) => (
                                    <div
                                        href="#"
                                        className="rb-table-row"
                                        key={index}
                                    >
                                        <div className="rb-table-col stretch">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>
                                                        {
                                                            employeeData.profile
                                                                .name
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>{item.date}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div
                                                    className={`ry_badge-style1 ${this.getStatusColor(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>{item.created_at}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>{item.updated_at}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _10">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>{item.tracked}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _10">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>
                                                        {" "}
                                                        <span
                                                            style={{
                                                                color:
                                                                    parseInt(
                                                                        item.overall,
                                                                        10
                                                                    ) > 50
                                                                        ? "green"
                                                                        : "red"
                                                            }}
                                                        >
                                                            {item.overall}
                                                        </span>
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
