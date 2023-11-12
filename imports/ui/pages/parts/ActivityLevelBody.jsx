/* eslint-disable no-console */
/* eslint-disable indent-legacy */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import Client from "../../../api/classes/client/Client";
import XLSX from "xlsx";
import FileSaver from "file-saver";

export default class ActivityLevelBody extends Component {
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

    getWeekNumber = (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const daysSinceFirstDayOfYear = Math.floor(
            (date - firstDayOfYear) / (24 * 60 * 60 * 1000)
        );
        const weekNumber = Math.floor(daysSinceFirstDayOfYear / 7) + 1;
        return weekNumber;
    };

    calculateAveragePercentage = (data) => {
        // Convert percentage strings to numbers
        const numericPercentages = data.map((percentage) =>
            parseInt(percentage)
        );

        // Calculate the average
        const average =
            numericPercentages.reduce(
                (sum, percentage) => sum + percentage,
                0
            ) / numericPercentages.length;
        return `${average}%`;
    };

    getAverageColor = (percentage) => {
        // Remove the percentage sign and convert the string to a number
        const numericPercentage = parseFloat(percentage);

        if (numericPercentage >= 60) {
            return "text-green"; // green
        } else if (numericPercentage >= 30 && numericPercentage <= 59) {
            return "text-yellow"; // yellow
        } else if (numericPercentage >= 0 && numericPercentage <= 29) {
            return "text-red"; // red
        } else {
            return "";
        }
    };

    getActiveWeeks = () => {
        const {attendancesData} = this.props;

        const loggedUser = Client.user().profile;
        const filteredUser = attendancesData.filter(
            (attendance) => attendance.employeeName === loggedUser
        );

        const groupedData = {};

        filteredUser.forEach((attendance) => {
            const weekNumber = this.getWeekNumber(
                new Date(attendance.createdAt)
            );
            if (!groupedData[weekNumber]) {
                groupedData[weekNumber] = [];
            }
            groupedData[weekNumber].push(attendance);
        });

        const sortedData = Object.values(groupedData).map((weekData) =>
            weekData.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            )
        );
        const weekdays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
        ];

        const mappedData = sortedData.map((weekData) =>
            weekdays
                .map((weekday) => {
                    const filteredData = weekData.filter((item) => {
                        const itemWeekday = new Date(
                            item.createdAt
                        ).toLocaleDateString("en-US", {
                            weekday: "long"
                        });
                        return itemWeekday === weekday;
                    });

                    if (filteredData.length === 0) {
                        return {
                            profilePicture: "",
                            employeeName: "",
                            day: weekday,
                            percentage: "--"
                        };
                    }

                    return filteredData.map((item) => ({
                        profilePicture: item.profilePicture,
                        employeeName: item.employeeName,
                        day: new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                                weekday: "long"
                            }
                        ),
                        percentage: this.calculateProductivityPercentage(
                            item.activeHours,
                            item.duration
                        )
                    }));
                })
                .flat()
        );

        const activeWeeks = mappedData.filter((weekData) => {
            return weekData.some((dayData) => {
                return (
                    dayData.profilePicture !== "" || dayData.employeeName !== ""
                );
            });
        });
        return {activeWeeks};
    };
    // Comment out mo na lang ito tas iset mo yung data structure, yun na lang kulang. :D
    exportToExcel = () => {
        const {activeWeeks} = this.getActiveWeeks();

        console.log(activeWeeks);
        const weeklyAverages = []; // New array to store the average percentage for each week

        // Loop through the main array containing the sub-arrays (weeks)
        activeWeeks.forEach((weekData) => {
            // Initialize variables for each week's total percentage and number of days (Monday to Friday)
            let weekTotalPercentage = 0;
            let weekNumDays = 0;

            // Loop through each object in the sub-array (week data)
            weekData.forEach((data) => {
                const day = data.day;
                const percentage = parseFloat(data.percentage); // Convert percentage to a number

                // Check if the day is from Monday to Friday (exclude Saturday and Sunday)
                if (
                    [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday"
                    ].includes(day)
                ) {
                    // Check for valid percentage (exclude invalid percentage "--")
                    if (!isNaN(percentage)) {
                        weekTotalPercentage += percentage;
                        weekNumDays++;
                    }
                }
            });

            // Compute the average percentage for Monday to Friday for the current week
            const weekAveragePercentage =
                weekNumDays > 0 ? weekTotalPercentage / weekNumDays : 0;

            // Push the week's average percentage into the 'weeklyAverages' array
            weeklyAverages.push(weekAveragePercentage);
            // Output the 'weeklyAverages' array
            console.log("Weekly Averages:", weeklyAverages);
        });

        // Create a new array to store "day," "percentage," and "average" for each week
        const newWeeklyData = activeWeeks.map((weekData, index) => {
            const weekAveragePercentage = weeklyAverages[index];
            return weekData.map((data) => {
                return {
                    employeeName: data.employeeName,
                    day: data.day,
                    percentage: data.percentage,
                    average: `${weekAveragePercentage.toFixed(0)}%`
                };
            });
        });

        console.log(newWeeklyData);

        const employeeName = Client.user().profile;
        const data = newWeeklyData
            .filter((weekData) =>
                weekData.some((entry) => entry.employeeName === employeeName)
            )
            .map((weekData) => {
                const row = new Array(7).fill(""); // Empty array to represent a row with 7 columns

                weekData.forEach((entry) => {
                    // Match the day with the header and set the percentage value
                    const dayIndex = [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday"
                    ].indexOf(entry.day);
                    if (dayIndex !== -1) {
                        row[dayIndex + 1] = entry.percentage;
                    }
                });

                // Set the Name and Average values
                row[0] = employeeName;
                row[6] = weekData[0].average; // Assuming average is the same for all days in the week
                return row;
            });

        // Create the worksheet data with headers and "Donnie Ebert" data
        const worksheetData = [
            ["Name", "Mon", "Tue", "Wed", "Thu", "Fri", "Average"],
            ...data
        ];

        // Convert the data to a worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Level");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        FileSaver.saveAs(blob, "activity_level.xlsx");
    };

    handleScroll = () => {
        clearTimeout(this.debounceTimer); // Clear any previous timer
        this.debounceTimer = setTimeout(() => {
            const {loadMore} = this.props;
            const container = document.getElementById("activityLevelContainer");

            if (
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 20
            ) {
                loadMore();
            }
        }, 200); // Adjust the debounce delay as needed (in milliseconds)
    };

    render() {
        const {
            employeeData,
            attendancesData,
            startDate,
            endDate,
            filterCriteria
        } = this.props;

        console.log(attendancesData);
        console.log(employeeData);

        let filteredHoursData = attendancesData; // Make a copy of the filteredUser array
        // console.log(filteredHoursData.data);

        if (filterCriteria) {
            const {productivity, productivityFilterType} = filterCriteria;

            if (productivityFilterType === "higher") {
                filteredHoursData = filteredHoursData.filter((hoursEntry) => {
                    const entryProductivity =
                        this.calculateProductivityPercentage(
                            hoursEntry.activeHours,
                            hoursEntry.duration
                        );

                    // Extract numeric value from the entryProductivity string
                    const entryProductivityValue = parseInt(
                        entryProductivity.slice(0, -1),
                        10
                    );

                    console.log(entryProductivityValue, productivity);
                    return entryProductivityValue > productivity;
                });
            } else if (productivityFilterType === "lower") {
                filteredHoursData = filteredHoursData.filter((hoursEntry) => {
                    const entryProductivity =
                        this.calculateProductivityPercentage(
                            hoursEntry.activeHours,
                            hoursEntry.duration
                        );

                    // Extract numeric value from the entryProductivity string
                    const entryProductivityValue = parseInt(
                        entryProductivity.slice(0, -1),
                        10
                    );

                    return entryProductivityValue < productivity;
                });
            }
        }

        if (startDate && endDate) {
            // Perform filtering if both startDate and endDate are available
            const nextDayEndDate = new Date(endDate);
            nextDayEndDate.setDate(nextDayEndDate.getDate() + 1);

            filteredHoursData = filteredHoursData.filter((hoursEntry) => {
                const entryDate = new Date(hoursEntry.createdAt);
                return entryDate >= startDate && entryDate < nextDayEndDate;
            });
        }
        const groupedData = {};

        filteredHoursData.forEach((attendance) => {
            const weekNumber = this.getWeekNumber(
                new Date(attendance.createdAt)
            );
            const year = new Date(attendance.createdAt).getFullYear();
            const key = `${year}-W${weekNumber}`;

            if (!groupedData[key]) {
                groupedData[key] = [];
            }

            // Sort the array before pushing the new attendance entry
            groupedData[key].unshift(attendance);
        });
        // Get the keys of groupedData and reverse their order
        // const reversedKeys = Object.keys(groupedData).reverse();
        // Create a new object with the reversed order of keys
        // const reversedGroupedData = {};
        // reversedKeys.forEach((key) => {
        //     reversedGroupedData[key] = groupedData[key];
        // });
        // console.log(reversedGroupedData);
        const sortedData = Object.values(groupedData).map((weekData) =>
            weekData.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            )
        );
        const weekdays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
        ];
        const mappedData = sortedData.map((weekData) =>
            weekdays
                .map((weekday) => {
                    const filteredData = weekData.filter((item) => {
                        const itemWeekday = new Date(
                            item.createdAt
                        ).toLocaleDateString("en-US", {
                            weekday: "long"
                        });
                        return itemWeekday === weekday;
                    });
                    if (filteredData.length === 0) {
                        return {
                            profilePicture: "",
                            employeeName: "",
                            day: weekday,
                            percentage: "--"
                        };
                    }
                    return filteredData.map((item) => ({
                        // profilePicture: employeeData[0].profilePicture,
                        // employeeName: employeeData[0].fullName,
                        day: new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                                weekday: "long"
                            }
                        ),
                        percentage: this.calculateProductivityPercentage(
                            item.activeHours,
                            item.duration
                        )
                    }));
                })
                .flat()
        );

        const activeWeeks = mappedData.filter((weekData) => {
            return weekData.some((dayData) => {
                return (
                    dayData.profilePicture !== "" || dayData.employeeName !== ""
                );
            });
        });

        return (
            <div
                id="activityLevelContainer"
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
                            <div className="rb-table-col _10">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Mon</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rb-table-col _10">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Tue</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rb-table-col _10">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Wed</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rb-table-col _10">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Thu</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rb-table-col _10">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Fri</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rb-table-col _10">
                                <div className="rb-table-cell">
                                    <div className="table-header-div">
                                        <div>Average</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rb-table-content">
                            {activeWeeks.map((weekData, weekIndex) => (
                                <div key={weekIndex}>
                                    <div className="rb-table-row">
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
                                                    <div>Graphic Design</div>
                                                </div>
                                            </div>
                                        </div>
                                        {weekData.map((item, index) => (
                                            <div
                                                className="rb-table-col _10"
                                                key={index}
                                            >
                                                <div className="rb-table-cell">
                                                    <div
                                                        className={`
                                                        table-text 
                                                        ${this.getAverageColor(
                                                            item.percentage
                                                        )}`}
                                                    >
                                                        <div>
                                                            {item.percentage}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="rb-table-col _10">
                                            <div className="rb-table-cell">
                                                <div
                                                    className={`
                                                        table-text 
                                                        ${this.getAverageColor(
                                                            weekData.length > 0
                                                                ? (() => {
                                                                      const percentageData =
                                                                          weekData
                                                                              .filter(
                                                                                  (
                                                                                      item
                                                                                  ) =>
                                                                                      item.percentage !==
                                                                                      "--"
                                                                              )
                                                                              .map(
                                                                                  (
                                                                                      item
                                                                                  ) =>
                                                                                      parseFloat(
                                                                                          item.percentage
                                                                                      )
                                                                              );
                                                                      if (
                                                                          percentageData.length >
                                                                          0
                                                                      ) {
                                                                          const averagePercentage =
                                                                              percentageData.reduce(
                                                                                  (
                                                                                      total,
                                                                                      value
                                                                                  ) =>
                                                                                      total +
                                                                                      value
                                                                              ) /
                                                                              percentageData.length;
                                                                          return (
                                                                              averagePercentage.toFixed(
                                                                                  0
                                                                              ) +
                                                                              "%"
                                                                          ); // Change the decimal places value (2 in this example)
                                                                      } else {
                                                                          return "0%";
                                                                      }
                                                                  })()
                                                                : "0%"
                                                        )}`}
                                                >
                                                    <div>
                                                        {weekData.length > 0
                                                            ? (() => {
                                                                  const percentageData =
                                                                      weekData
                                                                          .filter(
                                                                              (
                                                                                  item
                                                                              ) =>
                                                                                  item.percentage !==
                                                                                  "--"
                                                                          )
                                                                          .map(
                                                                              (
                                                                                  item
                                                                              ) =>
                                                                                  parseFloat(
                                                                                      item.percentage
                                                                                  )
                                                                          );
                                                                  if (
                                                                      percentageData.length >
                                                                      0
                                                                  ) {
                                                                      const averagePercentage =
                                                                          percentageData.reduce(
                                                                              (
                                                                                  total,
                                                                                  value
                                                                              ) =>
                                                                                  total +
                                                                                  value
                                                                          ) /
                                                                          percentageData.length;
                                                                      return (
                                                                          averagePercentage.toFixed(
                                                                              0
                                                                          ) +
                                                                          "%"
                                                                      ); // Change the decimal places value (2 in this example)
                                                                  } else {
                                                                      return "0%";
                                                                  }
                                                              })()
                                                            : "0%"}
                                                    </div>
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
        );
    }
}
