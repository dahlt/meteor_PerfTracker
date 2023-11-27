/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import ReportsTopCards from "./cards/ReportsTopCards";
import DateExport from "./parts/DateExport";
import ActivityLevelBody from "./parts/ActivityLevelBody";
import {withTracker} from "meteor/react-meteor-data";

const LoginWatcherName = "activityLevel-watcher";

export class ActivityLevel extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.loadMoreAttendancesData = this.loadMoreAttendancesData.bind(this);
        this.employeesDataGet = this.employeesDataGet.bind(this);
        this.getAttendancesData = this.getAttendancesData.bind(this);
        this.activityLevelBodyRef = React.createRef();
        this.state = {
            employeesData: [],
            attendancesData: [],
            employeesHoursData: [],
            startDate: null,
            endDate: null,
            showProductivityFilter: true, // Set this to true to show the earnings filter
            productivityFilterLabel: "Productivity", // Set the label for the earnings filter
            filterOptions: [
                // Customize your filter options here (e.g., higher, lower, etc.)
                {value: "higher", label: "Higher Than"},
                {value: "lower", label: "Lower Than"}
            ],
            isLoading: true,
            filterCriteria: null,
            filteredHoursData: []
        };
    }

    // componentDidMount() {
    //     this.employeesDataGet();
    //     this.getAttendancesData();
    //     LoginWatcher.getAttendancesData();
    // }

    logoutUserActivityLevel() {
        LoginWatcher.logoutUser();
    }

    employeesDataGet() {
        LoginWatcher.getEmployeeData()
            .then((result) => {
                //console.log(result);
                this.setState({employeesData: result.data});
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
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

    exportToExcel = () => {
        if (this.activityLevelBodyRef.current) {
            this.activityLevelBodyRef.current.exportToExcel();
        }
    };

    handleDateChange = (startDate, endDate) => {
        this.setState({
            startDate: startDate,
            endDate: endDate
        });
    };

    handleProductivity = (filterCriteria) => {
        // Use the filterCriteria object here as needed
        console.log("Filtered productivity:", filterCriteria);
        this.setState({filterCriteria: filterCriteria});
    };

    handleFilterReset = (filterCriteria) => {
        // Use the filterCriteria object here as needed
        console.log("Filtered total hours:", filterCriteria);
        this.setState({filterCriteria: filterCriteria});
    };

    render() {
        const {user} = this.props;
        const {
            employeesData,
            attendancesData,
            showProductivityFilter,
            productivityFilterLabel,
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
                            logout={this.logoutUserActivityLevel}
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
                                                Activity Level
                                            </a>
                                        </div>
                                        <div className="ry_headercontainer">
                                            <h1 className="ry_h1-display1 text-white">
                                                Activity Level
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
                                                        showProductivity={
                                                            showProductivityFilter
                                                        }
                                                        productivityLabel={
                                                            productivityFilterLabel
                                                        }
                                                        filterOptions={
                                                            filterOptions
                                                        }
                                                        onFilter={
                                                            this
                                                                .handleProductivity
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
                                                    <ActivityLevelBody
                                                        employeeData={
                                                            employeesData
                                                        }
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
                                                                .activityLevelBodyRef
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
})(ActivityLevel);
