import React, { Component } from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import { withTracker } from "meteor/react-meteor-data";

const LoginWatcherName = "login-watcher";

export class Login extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.loginUser = this.loginUser.bind(this);
    }

    loginUser(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        // console.log(email, password);
        LoginWatcher.loginWithPassword(email, password)
            .then(() => {
                window.location.href = "/dashboard";
                //console.log(LoginWatcher.UsersData);
            })
            .catch((err) => {
                //console.log(err);
                if(err){
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
                <a href="#" className="logo_link-style1 w-inline-block">
                    <img
                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647ee69070fda82b7c14bbf4_signup_logo.svg"
                        loading="lazy"
                        alt=""
                        className="image"
                    />
                </a>
                <div className="ry_card_sign-in-style1_container">
                    <div className="ry_card_sign-in-style1">
                        <div className="form-block w-form">
                            <form
                                id="email-form"
                                name="email-form"
                                data-name="Email Form"
                                method="get"
                                aria-label="Email Form"
                                onSubmit={this.loginUser}
                            >
                                <div className="ry_sign-in-header">
                                    <h3 className="ry_h1-display1">
                                        Welcome Back
                                    </h3>
                                    <p className="ry_sign-in-p-style1">
                                        Enter your credential to access your
                                        account
                                    </p>
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
                                <div className="div-block">
                                    <a
                                        href="/reset-password"
                                        className="ry_link-style1"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="ry_btn-container">
                                    {/* <a
                                        //href="/dashboard"
                                        onClick={(e) => this.loginUser(e)}
                                        className="ry_btn-style1 _w-100 w-button"
                                    >
                                        Sign In
                                    </a> */}
                                    <button
                                        type="submit"
                                        className="ry_btn-style1 _w-100 w-button"
                                    >
                                        Sign In
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
                            Don't have an account yet?
                            <a href="/sign-up" className="ry_span-link-style1">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    LoginWatcher.initiateWatch(LoginWatcherName);
})(Login);
