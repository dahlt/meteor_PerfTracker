/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import {withTracker} from "meteor/react-meteor-data";
import {EmployeeDataFetch, EmployeeCount} from "../../api/common";
import TopDashboard from "./parts/TopDashboard";
import Siidebar from "./parts/Siidebar";

const LoginWatcherName = "dashboard-watcher";

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.employeeDataGet = this.employeeDataGet.bind(this);
        this.fetchUniqueEmployeeCount =
            this.fetchUniqueEmployeeCount.bind(this);
        this.state = {
            uniqueEmployeeCount: 0,
            employeeData: []
        };
    }

    logoutUserDashboard() {
        LoginWatcher.logoutUser();
    }

    employeeDataGet() {
        LoginWatcher.Parent.callFunc(EmployeeDataFetch)
            .then((result) => {
                this.setState({employeeData: result});
            })
            .catch((error) => {
                return error;
            });
    }

    fetchUniqueEmployeeCount() {
        LoginWatcher.Parent.callFunc(EmployeeCount)
            .then((result) => {
                this.setState({uniqueEmployeeCount: result});
            })
            .catch((err) => err);
    }

    componentDidMount() {
        this.employeeDataGet();
        this.fetchUniqueEmployeeCount();
    }

    render() {
        const {user} = this.props;
        const {uniqueEmployeeCount} = this.state;

        if (user) {
            return (
                <div>
                    <div className="ry_app-main-wrapper-style2">
                        <TopDashboard />
                        <div className="ry_main-section-style1">
                            <Siidebar
                                user={user}
                                logout={this.logoutUserDashboard}
                            />
                            <div className="ry_main-style1">
                                <div className="ry_main-style1_container">
                                    <div className="section-style1 mt-0">
                                        <div className="ry_dashboard_top dashboard">
                                            <div className="ry_breadcrumbs_container">
                                                <a
                                                    href="#"
                                                    className="ry_breadcrumbs-style1"
                                                >
                                                    Dashboard
                                                </a>
                                                <div className="ry_breadcrumbsdivider">
                                                    /
                                                </div>
                                                <a
                                                    href="#"
                                                    className="ry_breadcrumbs-style1"
                                                >
                                                    Overview
                                                </a>
                                            </div>
                                            <div className="ry_headercontainer">
                                                <h1 className="ry_h1-display1 text-white">
                                                    Welcome back, {user.profile}
                                                </h1>
                                                <div className="ry_emoji">
                                                    <img
                                                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647efb9d58835441406b1e5f_happy-face.png"
                                                        loading="lazy"
                                                        sizes="(max-width: 479px) 27vw, (max-width: 767px) 9vw, (max-width: 1439px) 50px, (max-width: 1919px) 3vw, 50px"
                                                        srcSet="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647efb9d58835441406b1e5f_happy-face-p-500.png 500w, https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647efb9d58835441406b1e5f_happy-face.png 512w"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="dashboard_top-card_container mobile-vertical">
                                                <div className="card_dashboard_top mobile-100">
                                                    <div className="card_dashboard_top-left">
                                                        <div className="ry_person-style1">
                                                            <img
                                                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f04f872fa62a3b4c3127d_person_01.png"
                                                                loading="lazy"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="div-block-382">
                                                            <h1 className="ry_h3-display1">
                                                                {user.profile}
                                                            </h1>
                                                            <div className="div-block-383">
                                                                <div className="ry_iconsmall">
                                                                    <img
                                                                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f04f879562c8b340dc502_icon_person.svg"
                                                                        loading="lazy"
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div className="ry_p-style1">
                                                                    Owner
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-dashboard_top-right">
                                                        <h1 className="ry_h3-display1 weight-semibold">
                                                            09:55 AM
                                                        </h1>
                                                        <div className="ry_p-style1">
                                                            UTC: +-1:00,
                                                            Europe/Berlin
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card_dashboard_top mobile-100">
                                                    <div className="card_dashboard_top-left">
                                                        <div className="div-block-382">
                                                            <h1 className="card_data">
                                                                {
                                                                    uniqueEmployeeCount
                                                                }
                                                            </h1>
                                                            <div className="ry_p-style1">
                                                                Members
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card_dashboard_top-left flex-vertical">
                                                        <h1 className="ry_h3-display1 weight-semibold">
                                                            $200
                                                        </h1>
                                                        <div className="ry_p-style1">
                                                            Last Invoice
                                                        </div>
                                                    </div>
                                                    <div className="card-dashboard_top-right">
                                                        <h1 className="ry_h3-display1 weight-semibold">
                                                            21 Oct, 2021
                                                        </h1>
                                                        <div className="ry_p-style1">
                                                            Next Payment on
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ry_body">
                                            <div className="card_row_container">
                                                <div className="card_dashboard">
                                                    <div className="w-form">
                                                        <form
                                                            id="email-form-2"
                                                            name="email-form-2"
                                                            data-name="Email Form 2"
                                                            method="get"
                                                        >
                                                            <div className="ry_cardtop">
                                                                <div className="card_dashboard-label">
                                                                    Todays
                                                                    &#x27;Activity
                                                                </div>
                                                                <div>
                                                                    <select
                                                                        id="field"
                                                                        name="field"
                                                                        data-name="Field"
                                                                        className="ry_selectfieldsmall w-select"
                                                                    >
                                                                        <option value="">
                                                                            Today
                                                                        </option>
                                                                        <option value="First">
                                                                            First
                                                                            choice
                                                                        </option>
                                                                        <option value="Second">
                                                                            Second
                                                                            choice
                                                                        </option>
                                                                        <option value="Third">
                                                                            Third
                                                                            choice
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="ry_cardcontent-style1">
                                                                <div className="ry_cardcontent_row">
                                                                    <div className="ry_cardcontent_rowcol">
                                                                        <div className="ry_person-style2">
                                                                            <img
                                                                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f04f97a36fb101cd48d44_person_04.png"
                                                                                loading="lazy"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <p className="ry_p-style1 mb-0">
                                                                            John
                                                                            Johnson
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-25">
                                                                        <p className="ry_p-style1 mb-0">
                                                                            2h
                                                                            35m
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-10">
                                                                        <p className="ry_p-style1 mb-0 text-green">
                                                                            85%
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="ry_cardcontent_row">
                                                                    <div className="ry_cardcontent_rowcol">
                                                                        <div className="ry_person-style2">
                                                                            <img
                                                                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f04f93d501d2c45239be8_person_05.png"
                                                                                loading="lazy"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <p className="ry_p-style1 mb-0">
                                                                            Jen
                                                                            Spouse
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-25">
                                                                        <p className="ry_p-style1 mb-0">
                                                                            2h
                                                                            35m
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-10">
                                                                        <p className="ry_p-style1 mb-0 text-green">
                                                                            77%
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="ry_cardcontent_row">
                                                                    <div className="ry_cardcontent_rowcol">
                                                                        <div className="ry_person-style2">
                                                                            <img
                                                                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f04f8ffe4801b4008c8aa_person_03.png"
                                                                                loading="lazy"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <p className="ry_p-style1 mb-0">
                                                                            Eddie
                                                                            Couly
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-25">
                                                                        <p className="ry_p-style1 mb-0">
                                                                            2h
                                                                            35m
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-10">
                                                                        <p className="ry_p-style1 mb-0 text-green">
                                                                            93%
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="ry_cardcontent_row">
                                                                    <div className="ry_cardcontent_rowcol">
                                                                        <div className="ry_person-style2">
                                                                            <img
                                                                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f04f82a957f57cb383ff3_person_02.png"
                                                                                loading="lazy"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <p className="ry_p-style1 mb-0">
                                                                            Anne
                                                                            Miller
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-25">
                                                                        <p className="ry_p-style1 mb-0">
                                                                            2h
                                                                            35m
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-10">
                                                                        <p className="ry_p-style1 mb-0 text-red">
                                                                            58%
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                        <div className="w-form-done">
                                                            <div>
                                                                Thank you! Your
                                                                submission has
                                                                been received!
                                                            </div>
                                                        </div>
                                                        <div className="w-form-fail">
                                                            <div>
                                                                Oops! Something
                                                                went wrong while
                                                                submitting the
                                                                form.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card_dashboard">
                                                    <div className="w-form">
                                                        <form
                                                            id="email-form-2"
                                                            name="email-form-2"
                                                            data-name="Email Form 2"
                                                            method="get"
                                                        >
                                                            <div className="ry_cardtop">
                                                                <div className="card_dashboard-label">
                                                                    Productivity
                                                                </div>
                                                                <div>
                                                                    <select
                                                                        id="field-2"
                                                                        name="field-2"
                                                                        data-name="Field 2"
                                                                        className="ry_selectfieldsmall w-select"
                                                                    >
                                                                        <option value="">
                                                                            Today
                                                                        </option>
                                                                        <option value="First">
                                                                            First
                                                                            choice
                                                                        </option>
                                                                        <option value="Second">
                                                                            Second
                                                                            choice
                                                                        </option>
                                                                        <option value="Third">
                                                                            Third
                                                                            choice
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="ry_cardcontent-style2">
                                                                <div className="ry_cardcontent-style2_left">
                                                                    <div className="ry_productivitylabel_container">
                                                                        <div className="ry_productivitylabel">
                                                                            <div className="div-block-391"></div>
                                                                            <h1 className="ry_h3-display1 weight-semibold">
                                                                                70%
                                                                            </h1>
                                                                        </div>
                                                                        <div className="ry_p-style1">
                                                                            Productivity
                                                                        </div>
                                                                    </div>
                                                                    <div className="ry_productivitylabel_container">
                                                                        <div className="ry_productivitylabel">
                                                                            <div className="div-block-391 bg-gray"></div>
                                                                            <h1 className="ry_h3-display1 weight-semibold">
                                                                                25%
                                                                            </h1>
                                                                        </div>
                                                                        <div className="ry_p-style1">
                                                                            Neutral
                                                                        </div>
                                                                    </div>
                                                                    <div className="ry_productivitylabel_container">
                                                                        <div className="ry_productivitylabel">
                                                                            <div className="div-block-391 bg-red"></div>
                                                                            <h1 className="ry_h3-display1 weight-semibold">
                                                                                5%
                                                                            </h1>
                                                                        </div>
                                                                        <div className="ry_p-style1">
                                                                            Non-
                                                                            Productive
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ry_cardcontent-style2_right">
                                                                    <div className="ry_piechart">
                                                                        <h1 className="ry_h1-display1">
                                                                            70%
                                                                        </h1>
                                                                        <div className="ry_p-style1">
                                                                            Productive
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                        <div className="w-form-done">
                                                            <div>
                                                                Thank you! Your
                                                                submission has
                                                                been received!
                                                            </div>
                                                        </div>
                                                        <div className="w-form-fail">
                                                            <div>
                                                                Oops! Something
                                                                went wrong while
                                                                submitting the
                                                                form.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card_dashboard">
                                                    <div className="w-form">
                                                        <form
                                                            id="email-form-2"
                                                            name="email-form-2"
                                                            data-name="Email Form 2"
                                                            method="get"
                                                        >
                                                            <div className="ry_cardtop">
                                                                <div className="card_dashboard-label">
                                                                    Goals
                                                                </div>
                                                                <div>
                                                                    <select
                                                                        id="field-2"
                                                                        name="field-2"
                                                                        data-name="Field 2"
                                                                        className="ry_selectfieldsmall w-select"
                                                                    >
                                                                        <option value="">
                                                                            Today
                                                                        </option>
                                                                        <option value="First">
                                                                            First
                                                                            choice
                                                                        </option>
                                                                        <option value="Second">
                                                                            Second
                                                                            choice
                                                                        </option>
                                                                        <option value="Third">
                                                                            Third
                                                                            choice
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="ry_cardcontent-style2">
                                                                <div className="ry_cardcontent-style2_left">
                                                                    <div className="ry_productivitylabel_container">
                                                                        <div className="ry_productivitylabel">
                                                                            <div className="div-block-391"></div>
                                                                            <h1 className="ry_h3-display1 weight-semibold">
                                                                                42%
                                                                            </h1>
                                                                        </div>
                                                                        <div className="ry_p-style1">
                                                                            Achieved
                                                                        </div>
                                                                    </div>
                                                                    <div className="ry_productivitylabel_container">
                                                                        <div className="ry_productivitylabel">
                                                                            <div className="div-block-391 bg-gray"></div>
                                                                            <h1 className="ry_h3-display1 weight-semibold">
                                                                                14%
                                                                            </h1>
                                                                        </div>
                                                                        <div className="ry_p-style1">
                                                                            Deferred
                                                                        </div>
                                                                    </div>
                                                                    <div className="ry_productivitylabel_container">
                                                                        <div className="ry_productivitylabel">
                                                                            <div className="div-block-391 bg-orange"></div>
                                                                            <h1 className="ry_h3-display1 weight-semibold">
                                                                                5%
                                                                            </h1>
                                                                        </div>
                                                                        <div className="ry_p-style1">
                                                                            In
                                                                            Progress
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ry_cardcontent-style2_right">
                                                                    <div className="ry_piechart _2">
                                                                        <h1 className="ry_h1-display1">
                                                                            8
                                                                        </h1>
                                                                        <div className="ry_p-style1">
                                                                            Goals
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                        <div className="w-form-done">
                                                            <div>
                                                                Thank you! Your
                                                                submission has
                                                                been received!
                                                            </div>
                                                        </div>
                                                        <div className="w-form-fail">
                                                            <div>
                                                                Oops! Something
                                                                went wrong while
                                                                submitting the
                                                                form.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card_row_container">
                                                <div className="card_dashboard">
                                                    <div className="w-form">
                                                        <form
                                                            id="email-form-2"
                                                            name="email-form-2"
                                                            data-name="Email Form 2"
                                                            method="get"
                                                        >
                                                            <div className="ry_cardtop">
                                                                <div className="card_dashboard-label">
                                                                    Attendance
                                                                </div>
                                                                <div>
                                                                    <select
                                                                        id="field-3"
                                                                        name="field-3"
                                                                        data-name="Field 3"
                                                                        className="ry_selectfieldsmall w-select"
                                                                    >
                                                                        <option value="">
                                                                            Today
                                                                        </option>
                                                                        <option value="First">
                                                                            First
                                                                            choice
                                                                        </option>
                                                                        <option value="Second">
                                                                            Second
                                                                            choice
                                                                        </option>
                                                                        <option value="Third">
                                                                            Third
                                                                            choice
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="ry_cardcontent-style1">
                                                                <div className="card_dashboard_top-left mb-10">
                                                                    <div className="ry_icon-style2">
                                                                        <img
                                                                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f13dcda12f6eb616b3ae6_icon_attendance.svg"
                                                                            loading="lazy"
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                    <div className="div-block-382">
                                                                        <h1 className="ry_h4-display1">
                                                                            50
                                                                            of
                                                                            80
                                                                            active
                                                                        </h1>
                                                                        <div className="ry_p-style1">
                                                                            from
                                                                            yesterday
                                                                            (70)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ry_cardcontent_row no-border">
                                                                    <div className="ry_cardcontent_rowcol">
                                                                        <div className="div-block-391 bg-red"></div>
                                                                        <p className="ry_p-style1 mb-0">
                                                                            Late
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-10">
                                                                        <p className="ry_p-style1 mb-0 text-darkblue">
                                                                            85%
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="ry_cardcontent_row no-border">
                                                                    <div className="ry_cardcontent_rowcol">
                                                                        <div className="div-block-391 bg-orange"></div>
                                                                        <p className="ry_p-style1 mb-0">
                                                                            Early
                                                                            Leaving
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-10">
                                                                        <p className="ry_p-style1 mb-0 text-darkblue">
                                                                            85%
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="ry_cardcontent_row no-border">
                                                                    <div className="ry_cardcontent_rowcol">
                                                                        <div className="div-block-391 bg-violet"></div>
                                                                        <p className="ry_p-style1 mb-0">
                                                                            Less
                                                                            Tracking
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-10">
                                                                        <p className="ry_p-style1 mb-0 text-darkblue">
                                                                            85%
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="ry_cardcontent_row no-border">
                                                                    <div className="ry_cardcontent_rowcol">
                                                                        <div className="div-block-391 bg-gray"></div>
                                                                        <p className="ry_p-style1 mb-0">
                                                                            Absent
                                                                        </p>
                                                                    </div>
                                                                    <div className="ry_cardcontent_rowcol _w-10">
                                                                        <p className="ry_p-style1 mb-0 text-darkblue">
                                                                            85%
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                        <div className="w-form-done">
                                                            <div>
                                                                Thank you! Your
                                                                submission has
                                                                been received!
                                                            </div>
                                                        </div>
                                                        <div className="w-form-fail">
                                                            <div>
                                                                Oops! Something
                                                                went wrong while
                                                                submitting the
                                                                form.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card_dashboard _w-66">
                                                    <div className="w-form">
                                                        <form
                                                            id="email-form-2"
                                                            name="email-form-2"
                                                            data-name="Email Form 2"
                                                            method="get"
                                                        >
                                                            <div className="ry_cardtop">
                                                                <div className="card_dashboard-label">
                                                                    Top Members
                                                                </div>
                                                                <div>
                                                                    <select
                                                                        id="field-3"
                                                                        name="field-3"
                                                                        data-name="Field 3"
                                                                        className="ry_selectfieldsmall w-select"
                                                                    >
                                                                        <option value="">
                                                                            Today
                                                                        </option>
                                                                        <option value="First">
                                                                            First
                                                                            choice
                                                                        </option>
                                                                        <option value="Second">
                                                                            Second
                                                                            choice
                                                                        </option>
                                                                        <option value="Third">
                                                                            Third
                                                                            choice
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="ry_barchart">
                                                                <img
                                                                    src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f16df88baf63d40220dfa_chart_01.svg"
                                                                    loading="lazy"
                                                                    alt=""
                                                                    className="image-100"
                                                                />
                                                            </div>
                                                        </form>
                                                        <div className="w-form-done">
                                                            <div>
                                                                Thank you! Your
                                                                submission has
                                                                been received!
                                                            </div>
                                                        </div>
                                                        <div className="w-form-fail">
                                                            <div>
                                                                Oops! Something
                                                                went wrong while
                                                                submitting the
                                                                form.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

    return {user: LoginWatcher.UsersData};
})(Dashboard);
