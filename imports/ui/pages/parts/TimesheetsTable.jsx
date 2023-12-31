/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, {Component} from "react";

export default class TimesheetsTable extends Component {
    render() {
        const {hoursData, employeeData, isAdmin} = this.props;
        console.log(hoursData, employeeData);

        return (
            <div
                id="timesheetContainer"
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
                                        <div>Team</div>
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
                            <div className="rb-table-col _20">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Office Time</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rb-table-col _15">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Productivity</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rb-table-content">
                            {hoursData &&
                            hoursData.every((entry) => entry === null) ? (
                                <div>No data available</div>
                            ) : (
                                hoursData.map((hoursEntry, index) => (
                                    <div
                                        key={index}
                                        href="#"
                                        className="rb-table-row"
                                    >
                                        <div className="rb-table-col stretch">
                                            <div className="rb-table-cell">
                                                <div className="div-block-398">
                                                    <div className="table-text">
                                                        <div>
                                                            {!isAdmin
                                                                ? employeeData
                                                                      .profile
                                                                      .name
                                                                : employeeData}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>
                                                        {hoursEntry.projectName}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>{hoursEntry.date}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _20">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>
                                                        {hoursEntry.tracked}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rb-table-col _15">
                                            <div className="rb-table-cell">
                                                <div className="table-text">
                                                    <div>
                                                        <span
                                                            style={{
                                                                color:
                                                                    parseInt(
                                                                        hoursEntry.overall,
                                                                        10
                                                                    ) > 50
                                                                        ? "green"
                                                                        : "red"
                                                            }}
                                                        >
                                                            {hoursEntry.overall}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
