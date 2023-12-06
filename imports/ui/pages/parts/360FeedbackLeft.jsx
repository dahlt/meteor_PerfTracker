/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Tooltip,
    Legend
} from "chart.js";
import {Radar, Bar} from "react-chartjs-2";
import Client from "../../../api/classes/client/Client";
import "../../../api/common";

export default class FeedbackBodyLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackData: []
        };
    }

    render() {
        return (
            <div className="ry_bodycontainer_left">
                <div className="ry_review flex-vertical">
                    <div className="ry_cardtop">
                        <div className="card_dashboard-label">
                            Reviewee Notes
                        </div>
                    </div>
                    <div className="ry_cardbody">
                        <p className="ry_p-style1">I agree/ don’t agree etc.</p>
                    </div>
                </div>
                <div className="ry_review flex-vertical">
                    <div className="ry_cardtop">
                        <div className="card_dashboard-label">Summary</div>
                    </div>
                    <div className="ry_barchart">
                        <img
                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/648091f073462c143542c0a5_chart_02.svg"
                            loading="lazy"
                            alt=""
                            className="image-100"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
