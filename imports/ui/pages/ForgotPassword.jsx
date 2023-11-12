import React, { Component } from "react";

export default class ForgotPassword extends Component {
    render() {
        return (
            <div className="ry_app-main-wrapper-style1">
                <div className="ry_card_sign-in-style1_container">
                    <div className="ry_card_sign-in-style1">
                        <div className="form-block w-form">
                            <form
                                id="email-form"
                                name="email-form"
                                data-name="Email Form"
                                method="get"
                                aria-label="Email Form"
                            >
                                <div className="ry_sign-in-header">
                                    <h3 className="ry_h1-display1">
                                        Reset Password
                                    </h3>
                                    {/* <p className="ry_sign-in-p-style1">
                                        Enter the email associated with your
                                        account and we'll send an email with
                                        instructions to reset your password.
                                    </p>  */}
                                </div>
                                <div className="form-row">
                                    <label
                                        htmlFor=""
                                        className="ry_field-label-style1"
                                    >
                                        Email
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="name-2"
                                            data-name="Name 2"
                                            placeholder="Email Address"
                                            id="name-2"
                                        />
                                    </div>
                                </div>
                                <div className="ry_btn-container">
                                    <a
                                        href="/create-new-password"
                                        className="ry_btn-style1 _w-100 w-button"
                                    >
                                        Send Instructions
                                    </a>
                                </div>
                                <div className="div-block-3">
                                    <a
                                        href="/"
                                        className="ry_link-style1 text-gray"
                                    >
                                        Cancel
                                    </a>
                                </div>
                            </form>
                            <div
                                className="w-form-done"
                                tabIndex="-1"
                                role="region"
                                aria-label="Email Form success"
                            >
                                <div>
                                    Thank you! Your submission has been
                                    received!
                                </div>
                            </div>
                            <div
                                className="w-form-fail"
                                tabIndex="-1"
                                role="region"
                                aria-label="Email Form failure"
                            >
                                <div>
                                    Oops! Something went wrong while submitting
                                    the form.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
