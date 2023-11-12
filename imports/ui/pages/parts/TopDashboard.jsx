import React, { Component } from "react";

export default class TopDashboard extends Component {
    render() {
        return (
            <>
                <div
                    data-w-id="ac3afbcf-65d0-1e1e-7bef-fe7812f0d460"
                    className="icon_main-menu"
                >
                    <img
                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647edc411cb7ba0f95e2d178_icon_menu.svg"
                        loading="lazy"
                        alt=""
                    />
                </div>
                <div className="ry_main-style1_top-nav">
                    <div className="ry_main-style1_top-nav_left">
                        <div className="ry_expand-icon">
                            <img
                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647ef7a89c37a63f95395f01_nav_01.svg"
                                loading="lazy"
                                alt=""
                            />
                        </div>
                        <a
                            href="#"
                            className="ry_app-logo-style1 w-inline-block"
                        >
                            <img
                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647ee69070fda82b7c14bbf4_signup_logo.svg"
                                loading="lazy"
                                alt=""
                                className="image-100"
                            />
                        </a>
                    </div>
                    <div className="ry_main-style1_top-nav_right">
                        <form action="/search" className="search w-form">
                            <input
                                type="search"
                                className="search-input-2 w-input"
                                maxLength="256"
                                name="query"
                                placeholder="Search"
                                id="search"
                                required=""
                            />
                            <input
                                type="submit"
                                value=""
                                className="search-button-2 w-button"
                            />
                        </form>
                        <div className="rb-sidebar-avatar">
                            <img
                                src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647ef7a875a3469fe6149589_nav_02.svg"
                                loading="lazy"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
