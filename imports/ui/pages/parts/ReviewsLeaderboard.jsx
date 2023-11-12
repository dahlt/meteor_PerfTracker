/* eslint-disable react/prop-types */
import React, {Component} from "react";

export default class ReviewsLeaderboard extends Component {
    render() {
        const {employeeData} = this.props;

        // Sort the employeeData based on received reviews
        const sortedEmployees = [...employeeData].sort(
            (a, b) =>
                (b.reviews?.reduce(
                    (acc, review) => acc + (review.received || 0),
                    0
                ) || 0) -
                (a.reviews?.reduce(
                    (acc, review) => acc + (review.received || 0),
                    0
                ) || 0)
        );

        // Extract the top 5 employees
        const topEmployees = sortedEmployees.slice(0, 5);
        return (
            <div className="ry_bodycontainer_right">
                <div className="card_dashboard _w-100">
                    <div className="card_dashboard_top-left">
                        <div className="ry_person-style1">
                            <img
                                className="ry_reviewprofilepicture"
                                src={
                                    employeeData.find(
                                        (employee) =>
                                            employee.fullname === "Dahl Tamares"
                                    )?.profilePicture
                                }
                                loading="lazy"
                                alt=""
                            />
                        </div>
                        <div className="div-block-382">
                            <h1 className="ry_h3-display1">
                                {
                                    employeeData.find(
                                        (employee) =>
                                            employee.fullname === "Dahl Tamares"
                                    )?.fullname
                                }
                            </h1>
                            <div className="ry_p-style1">Developer</div>
                        </div>
                    </div>
                    <div className="card_dashboard_bottom">
                        <div className="card_dashboard_bottomcol border">
                            <h1 className="ry_h3-display1 weight-semibold">
                                {employeeData.find(
                                    (employee) =>
                                        employee.fullname === "Dahl Tamares"
                                )?.reviews[0]?.sent || 0}
                            </h1>
                            <div className="ry_p-style1">Given</div>
                        </div>
                        <div className="card_dashboard_bottomcol">
                            <h1 className="ry_h3-display1 weight-semibold">
                                {employeeData.find(
                                    (employee) =>
                                        employee.fullname === "Dahl Tamares"
                                )?.reviews[1]?.received || 0}
                            </h1>
                            <div className="ry_p-style1">Received</div>
                        </div>
                    </div>
                </div>
                <div className="card_dashboard _w-100">
                    <div className="w-form">
                        <form
                            id="email-form-2"
                            name="email-form-2"
                            data-name="Email Form 2"
                            method="get"
                        >
                            <div className="ry_cardtop">
                                <div className="div-block-395">
                                    <div className="ry_iconsmall">
                                        <img
                                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f3b7e21c2387b8fe8c2bd_review_03.svg"
                                            loading="lazy"
                                            alt=""
                                        />
                                    </div>
                                    <div className="card_dashboard-label">
                                        Most Appreciated
                                    </div>
                                </div>
                            </div>

                            <div className="ry_cardcontent-style1">
                                {topEmployees.map((employee) => (
                                    <div
                                        className="ry_cardcontent_row"
                                        key={employee.fullname}
                                    >
                                        <div className="ry_cardcontent_rowcol">
                                            <div className="ry_person-style2">
                                                <img
                                                    src={
                                                        employee.profilePicture
                                                    }
                                                    loading="lazy"
                                                    alt=""
                                                />
                                            </div>
                                            <p className="ry_p-style1 mb-0">
                                                {employee.fullname}
                                            </p>
                                        </div>
                                        <div className="ry_cardcontent_rowcol _w-10">
                                            <p className="ry_p-style1 mb-0 text-darkblue">
                                                {employee.reviews.reduce(
                                                    (acc, review) =>
                                                        acc +
                                                        (review.received || 0),
                                                    0
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </form>
                        <div className="w-form-done">
                            <div>
                                Thank you! Your submission has been received!
                            </div>
                        </div>
                        <div className="w-form-fail">
                            <div>
                                Oops! Something went wrong while submitting the
                                form.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
