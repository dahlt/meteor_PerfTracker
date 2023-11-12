/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, { Component } from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import { withTracker } from "meteor/react-meteor-data";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import DateExport from "./parts/DateExport";
import ReportsTopCards from "./cards/ReportsTopCards";
import TimelineTable from "./parts/TimelineTable";

const LoginWatcherName = "timeline-watcher";

export class Timeline extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.employeesDataGet = this.employeesDataGet.bind(this);
        this.employeesHoursDataGet = this.employeesHoursDataGet.bind(this);
        this.loadMoreAttendancesData = this.loadMoreAttendancesData.bind(this);
        this.timelineTableRef = React.createRef();
        this.state = {
            employeesData: [],
            employeesHoursData: [],
            startDate: null,
            endDate: null,
            showTotalHoursFilter: true, // Set this to true to show the earnings filter
            totalHoursFilterLabel: "Total Hours", // Set the label for the earnings filter
            filterOptions: [
                // Customize your filter options here (e.g., higher, lower, etc.)
                { value: "higher", label: "Higher Than" },
                { value: "lower", label: "Lower Than" }
            ],
            filterCriteria: null,
            filteredHoursData: [],
            isLoading: true
        };
    }

    logoutUserTimeline() {
        LoginWatcher.logoutUser();
    }

    employeesDataGet() {
        LoginWatcher.getEmployeeData()
            .then((result) => {
                //console.log(result);
                this.setState({ employeesData: result.data });
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    employeesHoursDataGet() {
        LoginWatcher.getAttendancesData()
            .then((result) => {
                //console.log(result);
                this.setState({ employeesHoursData: result.data, isLoading: false });
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    getMatchingEmployeeHours() {
        const { employeesData, employeesHoursData } = this.state;
        const { user } = this.props;

        if (user) {
            const matchingEmployee = employeesData.find(
                (employee) => employee.fullName === user.profile
            );

            if (matchingEmployee) {
                const matchingEmployeeHoursData = employeesHoursData.filter(
                    (hours) => hours.employeeName === matchingEmployee.fullName
                );

                return matchingEmployeeHoursData;
            }
        }

        return []; // Return an empty array if no matching employee or hours found
    }

    handleDateChange = (startDate, endDate) => {
        this.setState({
            startDate: startDate,
            endDate: endDate
        });
    };

    exportToExcel = () => {
        if (this.timelineTableRef.current) {
            this.timelineTableRef.current.exportToExcel();
        }
    };

    handleFilteredTotalHours = (filterCriteria) => {
        // Use the filterCriteria object here as needed
        console.log("Filtered total hours:", filterCriteria);
        this.setState({ filterCriteria: filterCriteria });
    };

    handleFilterReset = (filterCriteria) => {
        // Use the filterCriteria object here as needed
        console.log("Filtered total hours:", filterCriteria);
        this.setState({ filterCriteria: filterCriteria });
    };

    componentDidMount() {
        this.employeesDataGet();
        this.employeesHoursDataGet();
    }

    loadMoreAttendancesData() {
        console.log("triggered");
        LoginWatcher.getAttendancesData()

            .then((result) => {
                console.log(result);
                this.setState((prevState) => ({
                    employeesHoursData: [
                        ...prevState.employeesHoursData,
                        ...result.data
                    ]
                }));
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    render() {
        const { user } = this.props;
        const {
            employeesData,
            employeesHoursData,
            showTotalHoursFilter,
            totalHoursFilterLabel,
            filterOptions,
            filterCriteria,
            isLoading
        } = this.state;

        console.log(filterCriteria);
        if (user) {
            return (
                <div className="ry_app-main-wrapper-style2">
                    <div
                        data-w-id="ac3afbcf-65d0-1e1e-7bef-fe7812f0d460"
                        className="icon_main-menu"
                    >
                        <img
                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647edc411cb7ba0f95e2d178_icon_menu.svg"
                            loading="lazy"
                            alt=""
                        />
                    </div>
                    <TopNavigation />
                    <div className="ry_main-section-style1">
                        <Siidebar
                            user={user}
                            logout={this.logoutUserTimeline}
                        />
                        <div className="ry_main-style1">
                            <div className="ry_main-style1_container">
                                <div className="section-style1 mt-0">
                                    <div className="ry_dashboard_top mb-10">
                                        <div className="ry_breadcrumbs_container mb-0">
                                            <a
                                                href="#"
                                                className="ry_breadcrumbs-style1"
                                            >
                                                Reports
                                            </a>
                                            <div className="ry_breadcrumbsdivider">
                                                /
                                            </div>
                                            <a
                                                href="#"
                                                className="ry_breadcrumbs-style1"
                                            >
                                                Timeline
                                            </a>
                                        </div>
                                        <div className="ry_headercontainer">
                                            <h1 className="ry_h1-display1 text-white">
                                                Timeline
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="ry_body pb-0">
                                        {isLoading ? (
                                            <div className="loadingData"> Loading data... </div>
                                        ) : (
                                            <>
                                                <ReportsTopCards
                                                    hoursData={employeesHoursData}
                                                />
                                                <div className="ry_bodycontainer flex-vertical">
                                                    <DateExport
                                                        showTotalHours={
                                                            showTotalHoursFilter
                                                        }
                                                        totalHoursLabel={
                                                            totalHoursFilterLabel
                                                        }
                                                        filterOptions={filterOptions}
                                                        onFilter={
                                                            this
                                                                .handleFilteredTotalHours
                                                        }
                                                        onReset={this.handleFilterReset}
                                                        exportToExcel={
                                                            this.exportToExcel
                                                        }
                                                        onDateChange={
                                                            this.handleDateChange
                                                        }
                                                    />
                                                    <div className="ry_bodycontainer">
                                                        <TimelineTable
                                                            employeeData={employeesData}
                                                            hoursData={
                                                                employeesHoursData
                                                            }
                                                            loadMore={
                                                                this
                                                                    .loadMoreAttendancesData
                                                            }
                                                            startDate={
                                                                this.state.startDate
                                                            }
                                                            endDate={this.state.endDate}
                                                            filterCriteria={
                                                                this.state
                                                                    .filterCriteria
                                                            }
                                                            ref={this.timelineTableRef}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div className="loading"></div>;
        }
    }
}

export default withTracker(() => {
    LoginWatcher.initiateWatch(LoginWatcherName);
    return {
        user: LoginWatcher.UsersData
    };
})(Timeline);
