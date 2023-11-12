/* eslint-disable no-console */
/* eslint-disable indent-legacy */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, {Component} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FilterModal from "./FilterModal";

export default class DateExport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            isDatePickerOpen: false,
            isFilterModalOpen: false,
            filterCriteria: null
        };
    }

    handleDateChange = (dates) => {
        const [start, end] = dates;
        this.setState({
            startDate: start,
            endDate: end
        });

        if (end) {
            this.toggleDatePicker();
        }

        // Call the onDateChange function with the selected dates
        this.props.onDateChange(start, end);
    };

    toggleDatePicker = () => {
        this.setState((prevState) => ({
            isDatePickerOpen: !prevState.isDatePickerOpen
        }));
    };

    handleExport = () => {
        // Call the exportToExcel function in the parent component
        this.props.exportToExcel();
    };

    toggleFilterModal = () => {
        this.setState((prevState) => ({
            isFilterModalOpen: !prevState.isFilterModalOpen
        }));
    };

    handleFilter = (filterCriteria) => {
        // Save the filter criteria to state
        this.setState({filterCriteria});
    };

    render() {
        const {startDate, endDate, isDatePickerOpen, isFilterModalOpen} =
            this.state;

        const {
            showEarnings,
            earningsLabel,
            filterOptions,
            showTotalHours,
            totalHoursLabel,
            showAttendanceStatus,
            attendanceStatusLabel,
            showProductivity,
            productivityLabel,
            onFilter,
            onReset
        } = this.props;

        const currentDate = new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
        });

        return (
            <div className="ry_bodytop">
                <div
                    className="ry_bodytop_left"
                    onClick={this.toggleDatePicker}
                    style={{cursor: "pointer"}}
                >
                    <h1 className="ry_h2-display1">
                        {`${
                            startDate
                                ? startDate.toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric"
                                  })
                                : currentDate
                        } - ${
                            endDate
                                ? endDate.toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric"
                                  })
                                : " "
                        }`}
                    </h1>
                    <div className="ry_arrowdown">
                        <img
                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f22d72fcff739ae70c277_icon_arrow.svg"
                            loading="lazy"
                            alt=""
                        />
                    </div>
                </div>
                <div className="ry_bodytop_right">
                    <a
                        href="#"
                        className="ry_icon-btn-style1 light mr-10 w-inline-block"
                        onClick={this.toggleFilterModal}
                    >
                        <img
                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647eef8aec75fb8b58e0fc0c_icon_filter.svg"
                            loading="lazy"
                            alt=""
                            className="icon-btn_asset"
                        />
                        <div>Filter</div>
                    </a>
                    <a
                        href="#"
                        className="ry_icon-btn-style1 outline mr-10 w-inline-block"
                        onClick={this.handleExport}
                    >
                        <img
                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/648082396af282519c4e2818_report_01.svg"
                            loading="lazy"
                            alt=""
                            className="icon-btn_asset"
                        />
                        <div>Export</div>
                    </a>
                    <a
                        href="#"
                        className="ry_icon-btn-style1 light square w-inline-block"
                    >
                        <img
                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/648048a50a92ccf7494e67f5_goals_01.svg"
                            loading="lazy"
                            alt=""
                            className="icon-btn_asset mr-0"
                        />
                    </a>
                </div>
                {isFilterModalOpen && (
                    <FilterModal
                        onFilter={this.handleFilter}
                        onClose={this.toggleFilterModal}
                    />
                )}

                {isFilterModalOpen && showEarnings && (
                    <FilterModal
                        showEarnings={showEarnings}
                        earningsLabel={earningsLabel}
                        filterOptions={filterOptions}
                        onFilter={onFilter}
                        onReset={onReset}
                        onClose={this.toggleFilterModal}
                    />
                )}

                {isFilterModalOpen && showTotalHours && (
                    <FilterModal
                        showTotalHours={showTotalHours}
                        totalHoursLabel={totalHoursLabel}
                        filterOptions={filterOptions}
                        onFilter={onFilter}
                        onReset={onReset}
                        onClose={this.toggleFilterModal}
                    />
                )}

                {isFilterModalOpen && showAttendanceStatus && (
                    <FilterModal
                        showAttendanceStatus={showAttendanceStatus}
                        attendanceStatusLabel={attendanceStatusLabel}
                        filterOptions={filterOptions}
                        onFilter={onFilter}
                        onReset={onReset}
                        onClose={this.toggleFilterModal}
                    />
                )}

                {isFilterModalOpen && showProductivity && (
                    <FilterModal
                        showProductivity={showProductivity}
                        productivityLabel={productivityLabel}
                        filterOptions={filterOptions}
                        onFilter={onFilter}
                        onReset={onReset}
                        onClose={this.toggleFilterModal}
                    />
                )}

                {isDatePickerOpen && (
                    <div
                        className="datepicker-container"
                        style={{
                            position: "absolute",
                            top: "275px",
                            left: "400px",
                            zIndex: 9999
                        }}
                    >
                        <DatePicker
                            selected={startDate}
                            onChange={this.handleDateChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            inline
                        />
                    </div>
                )}
            </div>
        );
    }
}
