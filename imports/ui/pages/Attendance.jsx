/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import ReportsTopCards from "./cards/ReportsTopCards";
import AttendanceBody from "./parts/AttendanceBody";
import DateExport from "./parts/DateExport";
import {withTracker} from "meteor/react-meteor-data";

const LoginWatcherName = "attendance-watcher";

export class Attendance extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.loadMoreAttendancesData = this.loadMoreAttendancesData.bind(this);
        this.getAttendancesData = this.getAttendancesData.bind(this);
        this.attendanceBodyRef = React.createRef();
        this.state = {
            attendancesData: [],
            employeesHoursData: [],
            startDate: null,
            endDate: null,
            showAttendanceStatusFilter: true, // Set this to true to show the earnings filter
            attendanceStatusFilterLabel: "Attendance Status", // Set the label for the earnings filter
            filterOptions: [
                // Customize your filter options here (e.g., higher, lower, etc.)
                {value: "present", label: "Present"},
                {value: "absent", label: "Absent"}
            ],
            isLoading: true,
            filterCriteria: null,
            filteredStatusData: []
        };
    }

    // componentDidMount() {
    //     this.getAttendancesData();
    //     LoginWatcher.getAttendancesData();
    // }
    logoutUserAttendance() {
        LoginWatcher.logoutUser();
    }

    getAttendancesData() {
        LoginWatcher.getAttendancesData()
            .then((result) => {
                //console.log(result);
                this.setState({attendancesData: result.data, isLoading: false});
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    loadMoreAttendancesData() {
        console.log("triggered");
        LoginWatcher.getAttendancesData()

            .then((result) => {
                console.log(result);
                this.setState((prevState) => ({
                    attendancesData: [
                        ...prevState.attendancesData,
                        ...result.data
                    ]
                }));
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    getMatchingEmployeeHours() {
        const {attendancesData} = this.state;
        const {user} = this.props;
        console.log(attendancesData);

        if (user) {
            const matchingEmployeeHoursData = attendancesData.filter(
                (hours) => hours.employeeName === user.profile
            );

            return matchingEmployeeHoursData;
        }
        return []; // Return an empty array if no matching employee or hours found
    }

    exportToExcel = () => {
        if (this.attendanceBodyRef.current) {
            this.attendanceBodyRef.current.exportToExcel();
        }
    };

    handleDateChange = (startDate, endDate) => {
        this.setState({
            startDate: startDate,
            endDate: endDate
        });
    };

    handleFilteredStatus = (filterCriteria) => {
        // Use the filterCriteria object here as needed
        console.log("Filtered status:", filterCriteria);
        this.setState({filterCriteria: filterCriteria});
    };

    handleFilterReset = (filterCriteria) => {
        // Use the filterCriteria object here as needed
        console.log("Filtered earnings:", filterCriteria);
        this.setState({filterCriteria: filterCriteria});
    };

    render() {
        const {user} = this.props;
        const {
            attendancesData,
            showAttendanceStatusFilter,
            attendanceStatusFilterLabel,
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
                            logout={this.logoutUserAttendance}
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
                                                Attendance
                                            </a>
                                        </div>
                                        <div className="ry_headercontainer">
                                            <h1 className="ry_h1-display1 text-white">
                                                Attendance
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="ry_body pb-0">
                                        {!isLoading ? (
                                            <div className="loadingData">
                                                {" "}
                                                Loading data...{" "}
                                            </div>
                                        ) : (
                                            <>
                                                <ReportsTopCards
                                                    hoursData={attendancesData}
                                                />
                                                <div className="ry_bodycontainer flex-vertical">
                                                    <DateExport
                                                        showAttendanceStatus={
                                                            showAttendanceStatusFilter
                                                        }
                                                        attendanceStatusLabel={
                                                            attendanceStatusFilterLabel
                                                        }
                                                        filterOptions={
                                                            filterOptions
                                                        }
                                                        onFilter={
                                                            this
                                                                .handleFilteredStatus
                                                        }
                                                        onReset={
                                                            this
                                                                .handleFilterReset
                                                        }
                                                        exportToExcel={
                                                            this.exportToExcel
                                                        }
                                                        onDateChange={
                                                            this
                                                                .handleDateChange
                                                        }
                                                    />
                                                    <AttendanceBody
                                                        attendancesData={
                                                            attendancesData
                                                        }
                                                        loadMore={
                                                            this
                                                                .loadMoreAttendancesData
                                                        }
                                                        startDate={
                                                            this.state.startDate
                                                        }
                                                        endDate={
                                                            this.state.endDate
                                                        }
                                                        filterCriteria={
                                                            this.state
                                                                .filterCriteria
                                                        }
                                                        ref={
                                                            this
                                                                .attendanceBodyRef
                                                        }
                                                    />
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
        //goalsItems: LoginWatcher.Goals,
    };
})(Attendance);
