/* eslint-disable no-console */
/* eslint-disable max-len */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import {withTracker} from "meteor/react-meteor-data";
import Client from "../../api/classes/client/Client";
import Siidebar from "./parts/Siidebar";
import TopNavigation from "./parts/TopNavigation";

const AppWatcherName = "feedback-form-watcher";

export class FeedbackForm extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, AppWatcherName);
        this.userFeedbackSubmit = this.userFeedbackSubmit.bind(this);
        this.getUserFeedback = this.getUserFeedback.bind(this);
        this.state = {
            filter: "all", // Default filter option
            feedbacks: [],
            selectedFile: null,
            uploadedImages: []
        };
    }

    // Modify the componentDidMount method
    componentDidMount() {
        const user = Client.user();
        this.getUserFeedback();

        // Retrieve the uploaded images array from local storage
        const uploadedImages =
            JSON.parse(localStorage.getItem("uploadedImages")) || [];

        this.setState({
            uploadedImages: uploadedImages
        });
    }

    logoutUserFeedbackForm() {
        localStorage.removeItem("authenticated");
        window.location.href = "/";
    }

    handleFileChange = (event) => {
        const file = event.target.files[0];
        this.setState({selectedFile: file});
    };

    uploadFile = () => {
        const {selectedFile, uploadedImages} = this.state;

        if (selectedFile && selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            const user = Client.user();

            reader.onload = (e) => {
                const imgDataUrl = e.target.result;
                const username = user.profile.name; // Get the username
                const createdAt = new Date(); // Get the current date and time

                const newImage = {
                    url: imgDataUrl,
                    username: username,
                    createdAt: createdAt
                };

                this.setState({
                    uploadedImages: [...uploadedImages, newImage]
                });

                // Store the uploaded images array in local storage
                localStorage.setItem(
                    "uploadedImages",
                    JSON.stringify([...uploadedImages, newImage])
                );
            };

            reader.readAsDataURL(selectedFile);
        } else {
            alert("Please select a valid image file.");
        }
    };

    userFeedbackSubmit(e) {
        e.preventDefault();

        const user = Client.user();
        const bugs = e.target.bugs.value;
        const importantFeatures = e.target.importantFeatures.value;
        const removeFeatures = e.target.removeFeatures.value;
        const preferredFeatures = e.target.preferredFeatures.value;

        // Filter out empty values
        const feedbackData = {
            bugs: bugs || undefined,
            importantFeatures: importantFeatures || undefined,
            removeFeatures: removeFeatures || undefined,
            preferredFeatures: preferredFeatures || undefined,
            username: user.profile.name
        };

        LoginWatcher.submitFeedbackFormData(feedbackData)
            .then(() => {
                e.target.reset();
                return {
                    success: true,
                    message: "Feedback submitted successfully"
                };
            })
            .catch((err) => {
                console.log("Error:", err);
                return err;
            });

        //window.location.href = "/feedback";
    }

    getUserFeedback() {
        LoginWatcher.getFeedbackFormData()
            .then((result) => {
                if (result) {
                    this.setState({feedbacks: result});
                    // this.activateWatcher(); // Assuming this function sets up a watcher for feedback changes
                }
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    }

    render() {
        const user = Client.user();
        const {filter, feedbacks, uploadedImages} = this.state;
        console.log(feedbacks);
        if (!user || !user.profile) {
            // User data is not available yet, render loading or handle accordingly
            return <div className="loading-spinner"></div>;
        }
        return (
            <div className="ry_app-main-wrapper-style2">
                <div
                    data-w-id="7e452d73-af7b-f82d-f882-1d53dd77cc39"
                    className="icon_main-menu"
                >
                    <img
                        src="https://assets.website-files.com/645264fdc383c729c0e89204/645264fdc383c76247e8920a_icon_menu.svg"
                        loading="lazy"
                        alt=""
                    />
                </div>
                <TopNavigation />
                <div className="ry_main-section-style1">
                    <Siidebar
                        user={user}
                        logout={this.logoutUserFeedbackForm}
                    />

                    <div className="ry_main-style1_container">
                        <div className="section-style1 mt-0">
                            <div className="ry_dashboard_top mb-10">
                                <div className="ry_headercontainer">
                                    <h1 className="ry_h1-display1 text-white">
                                        Feedback Form
                                    </h1>
                                </div>
                            </div>
                            {/* feedback body goes here */}

                            {user.profile.isAdmin === false ? (
                                <div className="w-form">
                                    <form
                                        id="email-form"
                                        name="email-form"
                                        data-name="Email Form"
                                        method="get"
                                        className="form-2"
                                        onSubmit={this.userFeedbackSubmit}
                                    >
                                        <div className="form-row">
                                            <label
                                                htmlFor=""
                                                className="ry_field-label-style1"
                                            >
                                                Report Bugs: (optional)
                                            </label>
                                            <div className="form-control">
                                                <div className="div-block-397">
                                                    <textarea
                                                        style={{
                                                            border: "2px solid black"
                                                        }}
                                                        className="ry_text-field-style1 w-input"
                                                        cols="100"
                                                        rows="5" // Adjust the number of rows as needed
                                                        name="bugs"
                                                        data-name="Bugs"
                                                        id="bugs"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <label
                                                htmlFor=""
                                                className="ry_field-label-style1"
                                            >
                                                Suggest Important Features:
                                                (optional)
                                            </label>
                                            <div className="form-control">
                                                <div className="div-block-397">
                                                    <textarea
                                                        style={{
                                                            border: "2px solid black"
                                                        }}
                                                        className="ry_text-field-style1 w-input"
                                                        cols="100"
                                                        rows="5" // Adjust the number of rows as needed
                                                        name="importantFeatures"
                                                        data-name="importantFeatures"
                                                        id="importantFeatures"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <label
                                                htmlFor=""
                                                className="ry_field-label-style1"
                                            >
                                                Remove Unnecessary Features:
                                                (optional)
                                            </label>
                                            <div className="form-control">
                                                <div className="div-block-397">
                                                    <textarea
                                                        style={{
                                                            border: "2px solid black"
                                                        }}
                                                        className="ry_text-field-style1 w-input"
                                                        cols="100"
                                                        rows="5" // Adjust the number of rows as needed
                                                        name="removeFeatures"
                                                        data-name="removeFeatures"
                                                        id="removeFeatures"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <label
                                                htmlFor=""
                                                className="ry_field-label-style1"
                                            >
                                                Suggest Preferred Features:
                                                (optional)
                                            </label>
                                            <div className="form-control">
                                                <div className="div-block-397">
                                                    <textarea
                                                        style={{
                                                            border: "2px solid black"
                                                        }}
                                                        className="ry_text-field-style1 w-input"
                                                        cols="100"
                                                        rows="5" // Adjust the number of rows as needed
                                                        name="preferredFeatures"
                                                        data-name="preferredFeatures"
                                                        id="preferredFeatures"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div>
                                        <form encType="multipart/form-data">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={this.handleFileChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={this.uploadFile}
                                            >
                                                Upload
                                            </button>
                                        </form>
                                    </div> */}
                                        <div className="form-row">
                                            <label
                                                htmlFor=""
                                                className="ry_field-label-style1"
                                            >
                                                File Upload:
                                            </label>
                                            <div className="form-control">
                                                <div className="div-block-397">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            this
                                                                .handleFileChange
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            this.uploadFile
                                                        }
                                                    >
                                                        Upload
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ry_form-btn_container">
                                            <button
                                                type="submit"
                                                className="ry_btn-style1 w-button"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                        <div className={`w-form-done `}>
                                            <div>
                                                Thank you! Your submission has
                                                been received!
                                            </div>
                                        </div>

                                        <div className={`w-form-fail `}>
                                            <div>
                                                Oops! Something went wrong while
                                                submitting the form.
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : null}
                            {user.profile.isAdmin === true ? (
                                <div
                                    className="section-style1 mt-0"
                                    style={{marginLeft: "20px"}}
                                >
                                    <div>
                                        {/* Add a dropdown to select the filter */}
                                        <label htmlFor="filter">Filter:</label>
                                        <select
                                            id="filter"
                                            value={filter}
                                            onChange={(e) =>
                                                this.setState({
                                                    filter: e.target.value
                                                })
                                            }
                                        >
                                            <option value="all">All</option>
                                            <option value="bugs">Bugs</option>
                                            <option value="importantFeatures">
                                                Important Features
                                            </option>
                                            <option value="removeFeatures">
                                                Unnecessary Features
                                            </option>
                                            <option value="preferredFeatures">
                                                Preferred Features
                                            </option>
                                            {/* Add more options for other feedback types */}
                                        </select>
                                    </div>
                                    <div>
                                        {feedbacks.length === 0 && (
                                            <p>No feedback available</p>
                                        )}
                                        {feedbacks.map((feedback) => {
                                            // Check if the selected filter matches the feedback type
                                            const isFilterMatch =
                                                filter === "all" ||
                                                (filter !== "all" &&
                                                    feedback[filter] &&
                                                    feedback[filter].trim() !==
                                                        "");

                                            return (
                                                isFilterMatch && (
                                                    <div
                                                        key={feedback._id}
                                                        style={{
                                                            marginBottom:
                                                                "20px",
                                                            borderBottom:
                                                                "1px solid #ccc",
                                                            paddingBottom:
                                                                "10px",
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignItems:
                                                                "flex-start"
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                                marginBottom:
                                                                    "5px"
                                                            }}
                                                        >
                                                            {feedback.username}
                                                        </p>
                                                        {/* Conditionally render paragraphs based on the selected filter */}
                                                        {filter === "all" &&
                                                            feedback.bugs && (
                                                                <>
                                                                    <p>
                                                                        {
                                                                            feedback.bugs
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        {new Date(
                                                                            feedback.createdAt
                                                                        ).toLocaleString()}
                                                                    </p>
                                                                </>
                                                            )}
                                                        {filter === "all" &&
                                                            feedback.importantFeatures && (
                                                                <>
                                                                    <p>
                                                                        {
                                                                            feedback.importantFeatures
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        {new Date(
                                                                            feedback.createdAt
                                                                        ).toLocaleString()}
                                                                    </p>
                                                                </>
                                                            )}
                                                        {filter === "all" &&
                                                            feedback.removeFeatures && (
                                                                <>
                                                                    <p>
                                                                        {
                                                                            feedback.removeFeatures
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        {new Date(
                                                                            feedback.createdAt
                                                                        ).toLocaleString()}
                                                                    </p>
                                                                </>
                                                            )}
                                                        {filter === "all" &&
                                                            feedback.preferredFeatures && (
                                                                <>
                                                                    <p>
                                                                        {
                                                                            feedback.preferredFeatures
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        {new Date(
                                                                            feedback.createdAt
                                                                        ).toLocaleString()}
                                                                    </p>
                                                                </>
                                                            )}
                                                        {filter !== "all" &&
                                                            feedback[
                                                                filter
                                                            ] && (
                                                                <>
                                                                    <p>
                                                                        {
                                                                            feedback[
                                                                                filter
                                                                            ]
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        {new Date(
                                                                            feedback.createdAt
                                                                        ).toLocaleString()}
                                                                    </p>
                                                                </>
                                                            )}
                                                    </div>
                                                )
                                            );
                                        })}
                                    </div>
                                    <div className="section-style1 mt-0">
                                        <div>
                                            <div id="imageDisplay">
                                                {/* Display uploaded images here */}
                                                {uploadedImages.length > 0 &&
                                                    filter === "all" && (
                                                        <div>
                                                            {uploadedImages.map(
                                                                (
                                                                    image,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <img
                                                                            src={
                                                                                image.url
                                                                            }
                                                                            alt={`Uploaded ${
                                                                                index +
                                                                                1
                                                                            }`}
                                                                            style={{
                                                                                width: "200px",
                                                                                maxHeight:
                                                                                    "200px",
                                                                                objectFit:
                                                                                    "contain",
                                                                                marginBottom:
                                                                                    "10px"
                                                                            }}
                                                                        />
                                                                        <p>
                                                                            {
                                                                                image.username
                                                                            }{" "}
                                                                            -{" "}
                                                                            {new Date(
                                                                                image.createdAt
                                                                            ).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    LoginWatcher.initiateWatch(AppWatcherName);

    return {user: LoginWatcher.UsersData};
})(FeedbackForm);
