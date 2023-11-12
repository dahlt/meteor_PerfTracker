import React, { Component } from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import { withTracker } from "meteor/react-meteor-data";
import { UsersInsert } from "../../api/common";

const LoginWatcherName = "sign-up-watcher";

export class SignUp extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.registerUser = this.registerUser.bind(this);
    }

    registerUser(e) {
        e.preventDefault();
        const name = e.target.fullName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        const data = { name, email, password };
        //console.log(email, name, password);
        LoginWatcher.Parent.callFunc(UsersInsert, data)
            .then(() => {
                window.location.href = "/";
                //console.log("register user called");
            })
            .catch((err) => {
                //console.log(err);
                if (err) {
                    const formFailElement = document.querySelector(".w-form-fail");
                    formFailElement.style.display = "block";

                    setTimeout(() => {
                        formFailElement.style.display = "none";
                    }, 3000);
                }

            });
    }

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
                                onSubmit={this.registerUser}
                            >
                                <div className="ry_sign-in-header">
                                    <h3 className="ry_h1-display1">Register</h3>
                                    <p className="ry_sign-in-p-style1">
                                        Please fill the details and create an
                                        account
                                    </p>
                                </div>
                                <div className="form-row">
                                    <label
                                        htmlFor=""
                                        className="ry_field-label-style1"
                                    >
                                        Full Name
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="fullName"
                                            data-name="Name 2"
                                            placeholder="Name"
                                            id="fullName"
                                        />
                                    </div>
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
                                            type="email"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="email"
                                            data-name="Name 2"
                                            placeholder="Email Address"
                                            id="email"
                                        />
                                    </div>
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
                                            type="password"
                                            className="ry_text-field-style1 w-input"
                                            maxLength="256"
                                            name="password"
                                            data-name="Name 2"
                                            placeholder="Password"
                                            id="password"
                                        />
                                    </div>
                                </div>
                                <div className="ry_btn-container">
                                    <button
                                        //href="/dashboard"
                                        type="submit"
                                        className="ry_btn-style1 _w-100 w-button"
                                    >
                                        Register
                                    </button>
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
                    <div className="div-block-2">
                        <p className="ry_sign-in-p-style1">
                            Already have an account?{" "}
                            <a href="/" className="ry_span-link-style1">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
                <a href="#" className="logo_link-style1 w-inline-block">
                    <img
                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647ee69070fda82b7c14bbf4_signup_logo.svg"
                        loading="lazy"
                        alt=""
                        className="image"
                    />
                </a>
            </div>
        );
    }
}

export default withTracker(() => {
    LoginWatcher.initiateWatch(LoginWatcherName);
})(SignUp);
