import React, { Component } from "react";

export default class NewPassword extends Component {
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
                                        Create New Password
                                    </h3>
                                    <p className="ry_sign-in-p-style1">
                                        Your new password must be different from
                                        previously used passwords
                                    </p>
                                </div>
                                <div className="form-row">
                                    <label
                                        htmlFor=""
                                        className="ry_field-label-style1"
                                    >
                                        Password
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="name-2"
                                            data-name="Name 2"
                                            placeholder="Password"
                                            id="name-2"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <label
                                        htmlFor=""
                                        className="ry_field-label-style1"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="name-2"
                                            data-name="Name 2"
                                            placeholder="Password"
                                            id="name-2"
                                        />
                                    </div>
                                </div>
                                <div className="ry_btn-container">
                                    <a
                                        href="/dashboard"
                                        className="ry_btn-style1 _w-100 w-button"
                                    >
                                        Reset Password
                                    </a>
                                </div>
                                <div className="div-block-3">
                                    <a
                                        href="/reset-password"
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
