/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, { Component } from "react";

export default class ReviewsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matchingEmployees: [],
            selectedEmployee: null,
            formSuccess: false,
            formError: false
        };
    }

    handleInputChange = (e) => {
        const { employeeData } = this.props;
        const inputValue = e.target.value;
        let matchingEmployees = [];

        if (inputValue.trim() !== "") {
            matchingEmployees = employeeData.filter((employee) =>
                employee.fullname
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
            );
        }

        this.setState({ matchingEmployees });
    };

    handleEmployeeSelect = (employee) => {
        if (employee === "addMyself") {
            const dahlTamares = this.props.employeeData.find(
                (employee) => employee.fullname === "Dahl Tamares"
            );

            if (dahlTamares) {
                this.setState({
                    selectedEmployee: dahlTamares,
                    matchingEmployees: []
                });
            }
        } else {
            this.setState({
                selectedEmployee: employee,
                matchingEmployees: []
            });
        }
    };

    handleTagClose = () => {
        this.setState({
            selectedEmployee: null
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await this.reviewsInsert();
            this.setState({ formSuccess: true, formError: false });
            // Clear the form
            document.getElementById("email-form").reset();
            this.setState({
                matchingEmployees: [],
                selectedEmployee: null
            });
            // Trigger page refresh
            //window.location.reload();

            setTimeout(() => {
                this.setState({
                    formSuccess: false
                });
            }, 3000);
        } catch (error) {
            console.log(error);
            this.setState({ formSuccess: false, formError: true });

            setTimeout(() => {
                this.setState({ formError: false });
            }, 3000);
        }
    };

    // reviewData = {
    //     senderId: "64b057a06d400e5ade3ecc6a",
    //     receiverId: "64b057a06d400e5ade3ecc70",
    //     reviewMessage: "Hi!",
    //     type: "public",
    // };
    reviewsInsert() {
        const { selectedEmployee } = this.state;
        const { employeeData, handleReviewInsert } = this.props;

        // Find Dahl Tamares in the employeeData
        const dahlTamares = employeeData.find(
            (employee) => employee.fullname === "Dahl Tamares"
        );

        if (dahlTamares) {
            const reviewData = {
                senderId: dahlTamares._id.toString().split("\"")[1],
                receiverId: selectedEmployee._id.toString().split("\"")[1],
                reviewMessage: document.getElementById("field-2").value,
                type: document.querySelector("input[name=\"radio\"]:checked")
                    .value
            };

            console.log(reviewData);
            handleReviewInsert(reviewData);
        }
    }

    render() {
        const { toggleModal } = this.props;
        const { matchingEmployees, selectedEmployee } = this.state;

        return (
            <div className="ry_add-review-popup" style={{ display: "flex" }}>
                <div className="ry_popup">
                    <div className="ry_popup-top">
                        <div className="ry_popup-header">Add Review</div>
                        <div
                            data-w-id="5d81c86f-4898-b745-db4d-8bd43c636127"
                            className="ry_icon-close"
                            onClick={toggleModal}
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
                            id="email-form"
                            name="email-form"
                            data-name="Email Form"
                            method="get"
                            className="form-2"
                            onSubmit={this.handleSubmit}
                        >
                            <div className="form-row">
                                <label
                                    htmlFor=""
                                    className="ry_field-label-style1"
                                >
                                    Who is this review about?
                                </label>
                                <div className="form-control">
                                    {selectedEmployee ? (
                                        <div className="tag-container">
                                            <div className="ry_tag-style1">
                                                <div className="ry_tag-style1_image">
                                                    <img
                                                        src={
                                                            selectedEmployee.profilePicture
                                                        }
                                                        loading="lazy"
                                                        width="15"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ry_tag-style1_name">
                                                    {selectedEmployee.fullname}
                                                </div>
                                                <div
                                                    className="ry_tag-style1_close"
                                                    onClick={
                                                        this.handleTagClose
                                                    }
                                                >
                                                    <img
                                                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647edc411cb7ba0f95e2d148_icon_close.svg"
                                                        loading="lazy"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="div-block-397">
                                            <input
                                                type="text"
                                                className="ry_text-field-style1 w-input"
                                                maxLength="256"
                                                name="name-2"
                                                data-name="Name 2"
                                                placeholder=""
                                                id="name-2"
                                                onChange={
                                                    this.handleInputChange
                                                }
                                            />
                                            <a
                                                href="#"
                                                className="ry_icon-btn-style1 bg-cyan w-inline-block"
                                                onClick={() =>
                                                    this.handleEmployeeSelect(
                                                        "addMyself"
                                                    )
                                                }
                                            >
                                                <img
                                                    src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647eeef43d800823119afa9f_icon_add-white.svg"
                                                    loading="lazy"
                                                    alt=""
                                                    className="icon-btn_asset"
                                                />
                                                <div>Add Myself</div>
                                            </a>
                                        </div>
                                    )}
                                    {matchingEmployees.length > 0 && (
                                        <div className="dropdown-container">
                                            <div className="dropdown">
                                                {matchingEmployees.map(
                                                    (employee) => (
                                                        <div
                                                            key={employee._id}
                                                            onClick={() =>
                                                                this.handleEmployeeSelect(
                                                                    employee
                                                                )
                                                            }
                                                        >
                                                            {employee.fullname}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-row">
                                <label
                                    htmlFor=""
                                    className="ry_field-label-style1"
                                >
                                    Who will you share this feedback with?
                                </label>
                                <div className="form-control">
                                    <label className="radio-button-field w-radio">
                                        <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button-2 w-radio-input"></div>
                                        <input
                                            type="radio"
                                            data-name="Radio"
                                            id="radio"
                                            name="radio"
                                            value="Public"
                                            style={{
                                                opacity: 0,
                                                position: "absolute",
                                                zIndex: -1
                                            }}
                                        />
                                        <span
                                            className="radio-button-label w-form-label"
                                            htmlFor="radio"
                                        >
                                            Public
                                        </span>
                                    </label>
                                    <label className="radio-button-field w-radio">
                                        <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button-2 w-radio-input"></div>
                                        <input
                                            type="radio"
                                            data-name="Radio 4"
                                            id="radio-4"
                                            name="radio"
                                            value="Private"
                                            style={{
                                                opacity: 0,
                                                position: "absolute",
                                                zIndex: -1
                                            }}
                                        />
                                        <span
                                            className="radio-button-label w-form-label"
                                            htmlFor="radio-4"
                                        >
                                            Private
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-row">
                                <label
                                    htmlFor=""
                                    className="ry_field-label-style1"
                                >
                                    Review
                                </label>
                                <div className="form-control">
                                    <textarea
                                        placeholder=""
                                        maxLength="5000"
                                        id="field-2"
                                        name="field-2"
                                        data-name="Field 2"
                                        className="ry_text-area-style1 w-input"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="ry_form-btn_containers">
                                <button
                                    type="submit"
                                    className="ry_btn-style1 w-button"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                        <div
                            className={`w-form-done ${
                                this.state.formSuccess ? "visible" : ""
                            }`}
                        >
                            <div>
                                Thank you! Your submission has been received!
                            </div>
                        </div>

                        <div
                            className={`w-form-fail ${
                                this.state.formError ? "visible" : ""
                            }`}
                        >
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
