/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import "react-datepicker/dist/react-datepicker.css";

export default class FilterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productivity: "",
            productivityFilterType: "higher",
            attendanceStatus: "",
            earnings: "",
            earningsFilterType: "higher",
            totalHours: "",
            totalHoursFilterType: "higher"
        };
    }

    handleFilterReset = () => {
        // Reset the state to its initial values
        this.setState({
            productivity: "",
            productivityFilterType: "higher",
            attendanceStatus: "",
            earnings: "",
            earningsFilterType: "higher",
            totalHours: "",
            totalHoursFilterType: "higher"
        });

        this.props.onReset({
            productivity: "",
            productivityFilterType: "",
            attendanceStatus: "",
            earnings: "",
            earningsFilterType: "",
            totalHours: "",
            totalHoursFilterType: ""
        });
    };

    handleFilterChange = (e) => {
        const {name, value} = e.target;

        if (name === "productivity") {
            let parsedValue = parseInt(value);

            if (isNaN(parsedValue)) {
                parsedValue = null;
            } else if (parsedValue < 1) {
                parsedValue = 1;
            } else if (parsedValue > 100) {
                parsedValue = 100;
            }

            this.setState({productivity: parsedValue});
        } else if (name === "earnings") {
            let parsedValue = parseInt(value);

            if (isNaN(parsedValue)) {
                parsedValue = null;
            } else if (parsedValue < 1) {
                parsedValue = 1;
            } else if (parsedValue > 100) {
                parsedValue = 100;
            }

            this.setState({earnings: parsedValue});
        } else if (name === "totalHours") {
            let parsedValue = parseInt(value);

            if (isNaN(parsedValue)) {
                parsedValue = null;
            } else if (parsedValue < 1) {
                parsedValue = 1;
            } else if (parsedValue > 100) {
                parsedValue = 100;
            }

            this.setState({totalHours: parsedValue});
        } else {
            this.setState({[name]: value});
        }
    };

    handleApplyFilter = (e) => {
        e.preventDefault();
        const {
            productivity,
            productivityFilterType,
            attendanceStatus,
            earnings,
            earningsFilterType,
            totalHours,
            totalHoursFilterType
        } = this.state;

        this.props.onFilter({
            productivity,
            productivityFilterType,
            attendanceStatus,
            earnings,
            earningsFilterType,
            totalHours,
            totalHoursFilterType
        });
    };

    render() {
        const {
            showProductivity,
            showAttendanceStatus,
            showEarnings,
            showTotalHours,
            productivityLabel,
            attendanceStatusLabel,
            earningsLabel,
            totalHoursLabel,
            filterOptions
        } = this.props;

        return (
            <div className="ry_add-review-popup" style={{display: "flex"}}>
                <div className="ry_popup">
                    <div className="ry_popup-top">
                        <div className="ry_popup-header">Filter Options</div>
                        <div
                            data-w-id="bfd1bb1a-b812-55c4-35f4-30b7f4515727"
                            className="ry_icon-close"
                            onClick={this.props.onClose}
                        >
                            <img
                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647edc411cb7ba0f95e2d148_icon_close.svg"
                                loading="lazy"
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="w-form">
                        <form
                            id="filter-form"
                            name="filter-form"
                            data-name="Filter Form"
                            className="form-2"
                            onSubmit={this.handleApplyFilter}
                        >
                            {/* Conditionally render the Productivity filter row */}
                            {showProductivity && (
                                <div className="form-row">
                                    <label
                                        htmlFor="productivity"
                                        className="ry_field-label-style1"
                                    >
                                        {productivityLabel}:
                                    </label>
                                    <div className="form-control form-control-inline">
                                        <div className="div-block-397">
                                            <select
                                                name="productivityFilterType"
                                                value={
                                                    this.state
                                                        .productivityFilterType
                                                }
                                                onChange={
                                                    this.handleFilterChange
                                                }
                                                className="filter-type-select"
                                            >
                                                {filterOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                className="ry_text-field-style1 w-input"
                                                maxLength="256"
                                                name="productivity"
                                                data-name="Productivity"
                                                placeholder={`Enter ${productivityLabel}`}
                                                id="productivity"
                                                value={this.state.productivity}
                                                onChange={
                                                    this.handleFilterChange
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Conditionally render the Attendance Status filter row */}
                            {showAttendanceStatus && (
                                <div className="form-row">
                                    <label
                                        htmlFor="attendanceStatus"
                                        className="ry_field-label-style1"
                                    >
                                        {attendanceStatusLabel}:
                                    </label>
                                    <div className="form-control-inline">
                                        <div className="div-block-397">
                                            <select
                                                name="attendanceStatus"
                                                value={
                                                    this.state.attendanceStatus
                                                }
                                                onChange={
                                                    this.handleFilterChange
                                                }
                                            >
                                                <option value="">All</option>
                                                {filterOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Conditionally render the Earnings filter row */}
                            {showEarnings && (
                                <div className="form-row">
                                    <label
                                        htmlFor="earnings"
                                        className="ry_field-label-style1"
                                    >
                                        {earningsLabel}:
                                    </label>
                                    <div className="form-control form-control-inline">
                                        <div className="div-block-397">
                                            {/* Render the filter type select (higher/lower) */}
                                            <select
                                                name="earningsFilterType"
                                                value={
                                                    this.state
                                                        .earningsFilterType
                                                }
                                                onChange={
                                                    this.handleFilterChange
                                                }
                                                className="filter-type-select"
                                            >
                                                {filterOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* Render the input field for earnings */}
                                            <input
                                                type="number"
                                                className="ry_text-field-style1 w-input"
                                                maxLength="256"
                                                name="earnings"
                                                data-name="Earnings"
                                                placeholder={`Enter ${earningsLabel}`}
                                                id="earnings"
                                                value={this.state.earnings}
                                                onChange={
                                                    this.handleFilterChange
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Conditionally render the Total Hours filter row */}
                            {showTotalHours && (
                                <div className="form-row">
                                    <label
                                        htmlFor="totalHours"
                                        className="ry_field-label-style1"
                                    >
                                        {totalHoursLabel}:
                                    </label>
                                    <div className="form-control form-control-inline">
                                        <div className="div-block-397">
                                            {/* Render the filter type select (higher/lower) */}
                                            <select
                                                name="totalHoursFilterType"
                                                value={
                                                    this.state
                                                        .totalHoursFilterType
                                                }
                                                onChange={
                                                    this.handleFilterChange
                                                }
                                                className="filter-type-select"
                                            >
                                                {filterOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* Render the input field for total hours */}
                                            <input
                                                type="number"
                                                className="ry_text-field-style1 w-input"
                                                maxLength="256"
                                                name="totalHours"
                                                data-name="TotalHours"
                                                placeholder={`Enter ${totalHoursLabel}`}
                                                id="totalHours"
                                                value={this.state.totalHours}
                                                onChange={
                                                    this.handleFilterChange
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Apply Filter button */}
                            <div className="ry_form-btn_containers ">
                                <button
                                    type="submit"
                                    className="ry_btn-style1 w-button "
                                    style={{marginRight: "10px"}}
                                >
                                    Apply
                                </button>
                                <button
                                    type="button"
                                    className="ry_btn-style1 w-button"
                                    onClick={this.handleFilterReset}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
