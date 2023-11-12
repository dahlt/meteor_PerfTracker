/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { Component } from "react";

export default class ReviewsCommentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentor: "",
            message: "",
            formSuccess: false,
            formError: false
        };
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { commentor, message } = this.state;

        if (commentor.trim() === "" || message.trim() === "") {
            this.setState({ formError: true });

            setTimeout(() => {
                this.setState({ formError: false });
            }, 3000);

            return;
        }

        try {
            await this.reviewCommentFunc();
            this.setState({ formSuccess: true, formError: false });

            this.setState({
                commentor: "",
                message: ""
            });

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

    reviewCommentFunc = () => {
        const { commentor, message } = this.state;

        const reviewId = this.props.selectedReviewId;

        console.log("comments to add:", commentor, message);
        console.log("reviewId:", reviewId);

        // Call the goalUpdateFunction with the goalData as the second argument
        this.props.reviewAddCommentFunction(reviewId, commentor, message);
    };

    render() {
        const { toggleModal, selectedReview } = this.props;

        const { commentor, message } = this.state;

        const comments = selectedReview.comments || [];
        return (
            <div className="ry_add-review-popup" style={{ display: "flex" }}>
                <div className="ry_popup">
                    <div className="ry_popup-top">
                        <div className="ry_popup-header">Add Comments</div>
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

                    {comments.map((comment, index) => (
                        <div
                            key={index}
                            style={{ display: "flex", padding: 10 }}
                        >
                            <div>
                                <span style={{ fontWeight: "bold" }}>
                                    {comment.commentor}:
                                </span>{" "}
                                {comment.message}
                            </div>
                            <div> </div>
                        </div>
                    ))}

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
                                    Commentor:
                                </label>
                                <div className="form-control">
                                    <div className="div-block-397">
                                        <input
                                            type="text"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="owner"
                                            data-name="Name 2"
                                            placeholder="Add your name"
                                            id="owner"
                                            value={commentor}
                                            onChange={(e) =>
                                                this.setState({
                                                    commentor: e.target.value
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
                                    Message:
                                </label>
                                <div className="form-control">
                                    <div className="div-block-397">
                                        <input
                                            type="text"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="title"
                                            data-name="Name 2"
                                            placeholder="Add your message"
                                            id="title"
                                            value={message}
                                            onChange={(e) =>
                                                this.setState({
                                                    message: e.target.value
                                                })
                                            }
                                        />
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
