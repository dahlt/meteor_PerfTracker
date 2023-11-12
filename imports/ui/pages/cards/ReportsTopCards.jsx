/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable indent-legacy */
import React, {Component} from "react";
import {
    convertDurationToMinutes,
    convertActiveHoursToMinutes,
    calculateAverage
} from "../utilities/utilitiesFE";

export default class ReportsTopCards extends Component {
    render() {
        const {hoursData} = this.props;
        console.log(hoursData);

        // Extract durations and active hours from hoursData
        const durationsInMinutes = hoursData.map((hoursEntry) =>
            convertDurationToMinutes(hoursEntry.duration)
        );
        const activeHoursInMinutes = hoursData.map((hoursEntry) =>
            convertActiveHoursToMinutes(hoursEntry.activeHours)
        );

        // Calculate average duration and average active hours
        const averageDurationInMinutes = calculateAverage(durationsInMinutes);
        const averageActiveHoursInMinutes =
            calculateAverage(activeHoursInMinutes);

        // Calculate percentage of average active hours to average duration
        const productivityPercentage = (
            (averageActiveHoursInMinutes / averageDurationInMinutes) *
            100
        ).toFixed(0);

        // Convert average durations and active hours back to "hh:mm" format
        const averageDurationHours = Math.floor(averageDurationInMinutes / 60);
        const averageDurationMinutes = (averageDurationInMinutes % 60)
            .toFixed(0)
            .padStart(2, "0");
        const averageActiveHours = Math.floor(averageActiveHoursInMinutes / 60);
        const averageActiveMinutes = (averageActiveHoursInMinutes % 60)
            .toFixed(0)
            .padStart(2, "0");

        return (
            <div className="reports_top-card_container">
                <div className="card_dashboard_top _w-33 padding-20">
                    <div className="card_dashboard_top-left justify-spacebetween">
                        <div className="div-block-382">
                            <div className="card_dashboard-label">
                                Office Time
                            </div>
                            <div className="ry_p-style1">Average per Shift</div>
                        </div>
                        <h1 className="ry_h3-display1 weight-semibold">
                            {`${averageDurationHours} hr ${averageDurationMinutes} mins`}
                        </h1>
                    </div>
                </div>
                <div className="card_dashboard_top _w-33 padding-20">
                    <div className="card_dashboard_top-left justify-spacebetween">
                        <div className="div-block-382">
                            <div className="card_dashboard-label">
                                Active Time
                            </div>
                            <div className="ry_p-style1">Average per Shift</div>
                        </div>
                        <h1 className="ry_h3-display1 weight-semibold">
                            {`${averageActiveHours} hr ${averageActiveMinutes} mins`}
                        </h1>
                    </div>
                </div>
                <div className="card_dashboard_top _w-33 padding-20">
                    <div className="card_dashboard_top-left justify-spacebetween">
                        <div className="div-block-382">
                            <div className="card_dashboard-label">
                                Productivity
                            </div>
                        </div>
                        <h1 className="ry_h3-display1 weight-semibold">{`${productivityPercentage}%`}</h1>
                    </div>
                </div>
            </div>
        );
    }
}
