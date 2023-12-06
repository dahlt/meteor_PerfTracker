/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import moment from "moment";

export default class FeedbackBodyRight extends Component {
    render() {
        return (
            <div className="ry_bodycontainer_right">
                <div className="card_dashboard _w-100">
                    <div className="card_dashboard_top-left">
                        <div className="ry_person-style1">
                            <img
                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f04f872fa62a3b4c3127d_person_01.png"
                                loading="lazy"
                                alt=""
                            />
                        </div>
                        <div className="div-block-382">
                            <h1 className="ry_h3-display1">John Smith</h1>
                            <div className="ry_p-style1">Graphic Designer</div>
                        </div>
                    </div>
                    <div className="ry_cardcontent-style1 mt-10">
                        <div className="ry_linedivider"></div>
                        <div className="ry_cardtop">
                            <div className="div-block-395">
                                <div className="card_dashboard-label">
                                    Reviews Cycle
                                </div>
                            </div>
                        </div>
                        <div className="ry_cardcontent_row no-border">
                            <div className="ry_cardcontent_rowcol">
                                <p className="ry_p-style1 mb-0">
                                    Dec. 1-31, 2023
                                </p>
                            </div>
                            <div className="ry_cardcontent_rowcol justfiy-right">
                                <p className="ry_p-style1 mb-0 text-darkblue">
                                    10
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
