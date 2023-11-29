/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Client from "../../../api/classes/client/Client";
import Select from "react-select";

export default class GoalAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: [],
            title: "",
            description: "",
            status: "",
            progress: "",
            comments: [],
            selectedStartDate: null,
            selectedCompletionDate: null,
            formSuccess: false,
            formError: false
        };
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const {
            owner,
            title,
            description,
            selectedStartDate,
            selectedCompletionDate
        } = this.state;

        if (
            owner.length === 0 ||
            title.trim() === "" ||
            description.trim() === "" ||
            selectedStartDate === null ||
            selectedCompletionDate === null
        ) {
            this.setState({formError: true});

            setTimeout(() => {
                this.setState({formError: false});
            }, 3000);

            return;
        }

        try {
            await this.goalInsert();
            this.setState({formSuccess: true, formError: false});

            this.setState({
                owner: [],
                title: "",
                description: "",
                status: "",
                selectedStartDate: null,
                selectedCompletionDate: null
            });

            setTimeout(() => {
                this.setState({
                    formSuccess: false
                });
            }, 3000);
        } catch (error) {
            console.log(error);
            this.setState({formSuccess: false, formError: true});

            setTimeout(() => {
                this.setState({formError: false});
            }, 3000);
        }
    };

    goalInsert() {
        const {
            owner,
            title,
            description,
            selectedStartDate,
            selectedCompletionDate
        } = this.state;

        console.log(owner);

        const goalData = {
            userId: Client.user()._id.toString(),
            owner: owner,
            title: title,
            description: description,
            status: "On Track",
            progress: 0,
            comments: [],
            startDate: selectedStartDate,
            completionDate: selectedCompletionDate
        };

        //console.log(goalData);

        this.props.handleGoalInsert(goalData);
    }
    render() {
        const {toggleModal, goalUsers} = this.props;
        const {
            owner,
            title,
            description,
            selectedCompletionDate,
            selectedStartDate
        } = this.state;

        console.log("goalUsers", goalUsers);

        // Convert goalUsers array to options array for react-select
        const ownerOptions = goalUsers.map((user) => ({
            value: user,
            label: user
        }));

        return (
            <div className="ry_add-review-popup" style={{display: "flex"}}>
                <div className="ry_popup">
                    <div className="ry_popup-top">
                        <div className="ry_popup-header">Add Goals</div>
                        <div
                            data-w-id="bfd1bb1a-b812-55c4-35f4-30b7f4515727"
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
                                    Owner:
                                </label>
                                <div className="form-control">
                                    <div className="div-block-397">
                                        {/* <Select
                                            options={ownerOptions}
                                            value={ownerOptions.find(
                                                (option) =>
                                                    option.value === owner
                                            )}
                                            onChange={(selectedOption) =>
                                                this.setState({
                                                    owner: selectedOption.value
                                                })
                                            }
                                        /> */}
                                        <Select
                                            options={ownerOptions}
                                            value={ownerOptions.filter(
                                                (option) =>
                                                    owner.includes(option.value)
                                            )}
                                            isMulti
                                            onChange={(selectedOptions) =>
                                                this.setState({
                                                    owner: selectedOptions.map(
                                                        (option) => option.value
                                                    )
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <label
                                    htmlFor=""
                                    className="ry_field-label-style1"
                                >
                                    Title:
                                </label>
                                <div className="form-control">
                                    <div className="div-block-397">
                                        <input
                                            type="text"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="title"
                                            data-name="Name 2"
                                            placeholder="Add the goal's title"
                                            id="title"
                                            value={title}
                                            onChange={(e) =>
                                                this.setState({
                                                    title: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <label
                                    htmlFor=""
                                    className="ry_field-label-style1"
                                >
                                    Description:
                                </label>
                                <div className="form-control">
                                    <div className="div-block-397">
                                        <input
                                            type="text"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="description"
                                            data-name="Name 2"
                                            placeholder="Add the goal's description"
                                            id="description"
                                            value={description}
                                            onChange={(e) =>
                                                this.setState({
                                                    description: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-row">
                                        <label
                                            htmlFor="start-date"
                                            className="ry_field-label-style1"
                                        >
                                            Start Date:
                                        </label>
                                        <div className="form-control">
                                            <DatePicker
                                                selected={selectedStartDate}
                                                onChange={(date) =>
                                                    this.setState({
                                                        selectedStartDate: date
                                                    })
                                                }
                                                className="ry_datepicker-style1"
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Select a date"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <label
                                            htmlFor="date"
                                            className="ry_field-label-style1"
                                        >
                                            Completion Date:
                                        </label>
                                        <div className="form-control">
                                            <DatePicker
                                                selected={
                                                    selectedCompletionDate
                                                }
                                                onChange={(date) =>
                                                    this.setState({
                                                        selectedCompletionDate:
                                                            date
                                                    })
                                                }
                                                className="ry_datepicker-style1"
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Select a date"
                                            />
                                        </div>
                                    </div>
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
                            <div
                                className={`w-form-done ${
                                    this.state.formSuccess ? "visible" : ""
                                }`}
                            >
                                <div>
                                    Thank you! Your submission has been
                                    received!
                                </div>
                            </div>

                            <div
                                className={`w-form-fail ${
                                    this.state.formError ? "visible" : ""
                                }`}
                            >
                                <div>
                                    Oops! Something went wrong while submitting
                                    the form.
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
