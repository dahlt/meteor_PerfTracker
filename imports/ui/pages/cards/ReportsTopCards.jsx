/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable indent-legacy */
import React, {Component} from "react";

export default class ReportsTopCards extends Component {
    render() {
        const {hoursData} = this.props;
        console.log(hoursData);

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
                            {hoursData.averageTracked}
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
                            {hoursData.averageTracked}
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
                        <h1
                            className="ry_h3-display1 weight-semibold"
                            style={{
                                color:
                                    parseInt(
                                        hoursData.averageOverallPercentage,
                                        10
                                    ) > 50
                                        ? "green"
                                        : "red"
                            }}
                        >
                            {hoursData.averageOverallPercentage}
                        </h1>
                    </div>
                </div>
            </div>
        );
    }
}
