/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, {Component} from "react";
import XLSX from "xlsx";
import FileSaver from "file-saver";

export default class TimesheetsTable extends Component {
    calculateProductivityPercentage = (activeHours, duration) => {
        if (duration === "0 hr 0 mins") {
            return "0%";
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
            Math.round(
                (totalActiveInMinutes / totalDurationInMinutes) * 100
            ).toString() + "%";
        return productivityPercentage;
    };

    calculateEarnings = (duration) => {
        // Fixed earning rate per hour
        const hourlyRate = 18;

        if (duration === "0 hr 0 mins") {
            return "0.00";
        }

        // Extract hours and minutes from duration
        const durationParts = duration.split(" ");
        const totalDurationHours = parseInt(durationParts[0], 10);
        const totalDurationMinutes = parseInt(durationParts[2], 10);

        // Calculate total duration in minutes
        const totalDurationInMinutes =
            totalDurationHours * 60 + totalDurationMinutes;

        // Calculate earnings based on fixed rate
        const earnings = (totalDurationInMinutes / 60) * hourlyRate;

        // Format earnings to two decimal places
        return `${earnings.toFixed(2)}`;
    };

    getPercentageColor = (percentage) => {
        const numericPercentage = parseInt(percentage);
        if (numericPercentage < 50) {
            return "text-red";
        } else if (numericPercentage < 75 && numericPercentage >= 50) {
            return "text-yellow";
        } else {
            return "text-green";
        }
    };

    exportToExcel = () => {
        const {employeeData, hoursData} = this.props;
        const sortedHoursData = hoursData.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        const data = sortedHoursData.map((hoursEntry) => [
            employeeData.fullName,
            employeeData.team,
            hoursEntry.createdAt,
            hoursEntry.duration,
            this.calculateProductivityPercentage(
                hoursEntry.activeHours,
                hoursEntry.duration
            ),
            this.calculateEarnings(hoursEntry.duration)
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([
            [
                "Name",
                "Team",
                "Date",
                "Office Time",
                "Productivity",
                "Earnings ($)"
            ],
            ...data
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheets");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        FileSaver.saveAs(blob, "timesheets.xlsx");
    };

    handleScroll = () => {
        clearTimeout(this.debounceTimer); // Clear any previous timer
        this.debounceTimer = setTimeout(() => {
            const {loadMore} = this.props;
            const container = document.getElementById("timesheetContainer");

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
        console.log(hoursData);
        console.log(filterCriteria);

        let filteredHoursData = [...hoursData]; // Create a copy of the original data

        // Apply the earnings filter first (if filterCriteria is present)
        if (filterCriteria) {
            const {earnings, earningsFilterType} = filterCriteria;

            if (earningsFilterType === "higher") {
                filteredHoursData = filteredHoursData.filter((hoursEntry) => {
                    const entryEarnings = this.calculateEarnings(
                        hoursEntry.duration
                    );
                    return entryEarnings > earnings;
                });
            } else if (earningsFilterType === "lower") {
                filteredHoursData = filteredHoursData.filter((hoursEntry) => {
                    const entryEarnings = this.calculateEarnings(
                        hoursEntry.duration
                    );
                    return entryEarnings < earnings;
                });
            }
        }

        // Apply the date range filter (if startDate and endDate are present)
        if (startDate && endDate) {
            const nextDayEndDate = new Date(endDate);
            nextDayEndDate.setDate(nextDayEndDate.getDate() + 1);

            filteredHoursData = filteredHoursData.filter((hoursEntry) => {
                const entryDate = new Date(hoursEntry.createdAt);
                return entryDate >= startDate && entryDate < nextDayEndDate;
            });
        }

        const sortedHoursData = filteredHoursData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

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
                            <div className="rb-table-col _15">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Earnings ($)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rb-table-content">
                            {employeeData && sortedHoursData
                                ? filteredHoursData.map((hoursEntry, index) => (
                                      <div
                                          key={index}
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
                                                          {employeeData[0].team}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="rb-table-col _15">
                                              <div className="rb-table-cell">
                                                  <div className="table-text">
                                                      <div>
                                                          {hoursEntry.createdAt}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="rb-table-col _20">
                                              <div className="rb-table-cell">
                                                  <div className="table-text">
                                                      <div>
                                                          {hoursEntry.duration}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="rb-table-col _15">
                                              <div
                                                  className={`rb-table-cell table-text ${this.getPercentageColor(
                                                      this.calculateProductivityPercentage(
                                                          hoursEntry.activeHours,
                                                          hoursEntry.duration
                                                      )
                                                  )}`}
                                              >
                                                  <div>
                                                      {this.calculateProductivityPercentage(
                                                          hoursEntry.activeHours,
                                                          hoursEntry.duration
                                                      )}
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="rb-table-col _15">
                                              <div className="rb-table-cell">
                                                  <div className="table-text">
                                                      <div>
                                                          {this.calculateEarnings(
                                                              hoursEntry.duration
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  ))
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
