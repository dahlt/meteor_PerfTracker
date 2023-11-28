/* eslint-disable no-console */
/* eslint-disable indent-legacy */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, {Component} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {startOfWeek, endOfWeek, addWeeks, subWeeks} from "date-fns";

export default class DateExport extends Component {
    constructor(props) {
        super(props);
        this.toggleDatePicker = this.toggleDatePicker.bind(this);
        const currentDateMinusTwo = new Date();
        currentDateMinusTwo.setDate(currentDateMinusTwo.getDate() - 2);

        const initialStartDate = startOfWeek(currentDateMinusTwo, {
            weekStartsOn: 1
        });
        const initialEndDate = endOfWeek(currentDateMinusTwo, {
            weekStartsOn: 1
        });

        this.state = {
            startDate: initialStartDate,
            endDate: initialEndDate,
            showDatePicker: false
        };
    }

    toggleDatePicker = () => {
        this.setState((prevState) => ({
            showDatePicker: !prevState.showDatePicker
        }));
    };

    handleDateChange = (date) => {
        const newStartDate = startOfWeek(date, {weekStartsOn: 1});
        const newEndDate = endOfWeek(date, {weekStartsOn: 1});
        this.setState({
            startDate: newStartDate,
            endDate: newEndDate,
            showDatePicker: false
        });
        this.props.onDateChange(newStartDate, newEndDate);
    };

    goToPreviousWeek = () => {
        const newStartDate = subWeeks(this.state.startDate, 1);
        const newEndDate = subWeeks(this.state.endDate, 1);
        this.setState(
            {
                startDate: newStartDate,
                endDate: newEndDate
            },
            () => {
                this.props.onDateChange(newStartDate, newEndDate);
            }
        );
    };

    goToNextWeek = () => {
        const newStartDate = addWeeks(this.state.startDate, 1);
        const newEndDate = addWeeks(this.state.endDate, 1);
        this.setState(
            {
                startDate: newStartDate,
                endDate: newEndDate
            },
            () => {
                this.props.onDateChange(newStartDate, newEndDate);
            }
        );
    };

    render() {
        const {startDate, endDate, showDatePicker} = this.state;

        return (
            <div className="date-range_container" style={{display: "flex"}}>
                <div
                    className="arrow_date-range"
                    onClick={this.goToPreviousWeek}
                >
                    ◀️
                </div>
                <div
                    className="date-range-text_container"
                    onClick={this.toggleDatePicker}
                >
                    <div className="date-range_text">{`${startDate.toDateString()} - ${endDate.toDateString()}`}</div>
                </div>
                <div className="arrow_date-range" onClick={this.goToNextWeek}>
                    ▶️
                </div>
                {showDatePicker && (
                    <div
                        className="popup_date-range"
                        style={{position: "fixed", top: "250px", left: "500px"}}
                    >
                        <DatePicker
                            showIcon
                            selected={startDate}
                            onChange={this.handleDateChange}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            fixedHeight
                            inline // Show inline calendar
                        />
                    </div>
                )}
            </div>
        );
    }
}
