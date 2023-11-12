/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../api/classes/client/LoginWatcher";
import Client from "../../api/classes/client/Client";
import {withTracker} from "meteor/react-meteor-data";
import TopNavigation from "./parts/TopNavigation";
import Siidebar from "./parts/Siidebar";
import ReviewsList from "./parts/ReviewsList";
import ReviewsModal from "./parts/ReviewsModal";
import ReviewsLeaderboard from "./parts/ReviewsLeaderboard";
import {
    ReviewsComment,
    ReviewsDislikes,
    ReviewsInsert,
    ReviewsLikes
} from "../../api/common";

const LoginWatcherName = "reviews-watcher";

export class Reviews extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.loadMoreReviewsData = this.loadMoreReviewsData.bind(this);
        this.reviewInsert = this.reviewInsert.bind(this);
        this.reviewComment = this.reviewComment.bind(this);
        this.reviewsDataGet = this.reviewsDataGet.bind(this);
        this.employeeDataGet = this.employeeDataGet.bind(this);
        this.reviewLikes = this.reviewLikes.bind(this);
        this.reviewDislikes = this.reviewDislikes.bind(this);
        this.state = {
            showModal: false,
            reviewsData: [],
            employeeData: [],
            showSelectMenu: false,
            selectedOption: "All"
        };
    }

    logoutUserReviews() {
        LoginWatcher.logoutUser();
    }

    toggleSelectMenu() {
        this.setState((prevState) => ({
            showSelectMenu: !prevState.showSelectMenu
        }));
    }

    handleOptionChange(event) {
        const selectedOption = event.target.value;
        this.setState({selectedOption});
        // console.log(selectedOption);
    }

    loadMoreReviewsData() {
        LoginWatcher.getReviewsData()
            .then((result) => {
                // console.log(result);
                this.setState((prevState) => ({
                    reviewsData: [...prevState.reviewsData, ...result.data]
                }));
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    componentDidMount() {
        this.reviewsDataGet();
        this.employeeDataGet();
        LoginWatcher.Reviews;
        LoginWatcher.Employees;
    }

    toggleModal = () => {
        this.setState((prevState) => ({
            showModal: !prevState.showModal
        }));
    };

    employeeDataGet() {
        LoginWatcher.getFirstEmployeeData()
            .then((result) => {
                // console.log(result);
                this.setState({employeeData: result});
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    reviewsDataGet() {
        LoginWatcher.getReviewsData()
            .then((result) => {
                //console.log(result);
                this.setState({reviewsData: result.data});
            })
            .catch((err) => {
                // console.log("Error fetching goal data:", err);
                return err;
            });
    }

    reviewInsert(reviewData) {
        // console.log(reviewData);

        LoginWatcher.Parent.callFunc(ReviewsInsert, reviewData)
            .then(() => {
                // console.log("Review data inserted.");
                this.resetLastbasis();
                this.reviewsDataGet();
                this.employeeDataGet();
            })
            .catch((err) => {
                // console.log("Error inserting review data:", err);
                return err;
            });
    }

    resetLastbasis() {
        LoginWatcher.Lastbasis = null;
    }

    reviewComment(reviewId, commentor, message) {
        // console.log("Review reviewComment: ", reviewId, commentor, message);
        LoginWatcher.Parent.callFunc(ReviewsComment, {
            reviewId,
            commentor,
            message
        })
            .then(() => {
                // console.log("Review comments added.");
                this.resetLastbasis();
                this.reviewsDataGet();
            })
            .catch((err) => {
                // console.log("Error adding comments:", err);
                return err;
            });
    }

    reviewLikes(reviewId) {
        // console.log("Review reviewLikes: ", reviewId);
        LoginWatcher.Parent.callFunc(ReviewsLikes, reviewId)
            .then(() => {
                // console.log("Likes count updated.");
                this.resetLastbasis();
                this.reviewsDataGet();
            })
            .catch((err) => {
                // console.log("Error updating likes count:", err);
                return err;
            });
    }

    reviewDislikes(reviewId) {
        //console.log("Review reviewLikes: ", reviewId);
        LoginWatcher.Parent.callFunc(ReviewsDislikes, reviewId)
            .then(() => {
                //console.log("Likes count updated.");
                this.resetLastbasis();
                this.reviewsDataGet();
            })
            .catch((err) => {
                //console.log("Error updating likes count:", err);
                return err;
            });
    }

    render() {
        const {user} = this.props;

        const {
            showModal,
            reviewsData,
            employeeData,
            showSelectMenu,
            selectedOption
        } = this.state;
        //console.log(reviewsData);
        //console.log(LoginWatcher.Reviews);
        //console.log(LoginWatcher.Employees);

        if (user) {
            LoginWatcher.listen(Client.user()._id.toString());
            return (
                <div className="ry_app-main-wrapper-style2">
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
                    <TopNavigation />
                    <div className="ry_main-section-style1">
                        <Siidebar user={user} logout={this.logoutUserReviews} />
                        <div className="ry_main-style1">
                            <div className="ry_main-style1_container">
                                <div className="section-style1 mt-0">
                                    <div className="ry_dashboard_top mb-10">
                                        <div className="ry_breadcrumbs_container mb-0">
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
                                                Review
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="ry_body pb-0">
                                        <div className="ry_bodytop">
                                            <div className="ry_bodytop_left">
                                                <h1 className="ry_h2-display1">
                                                    About Everyone
                                                </h1>
                                                <div className="ry_arrowdown">
                                                    <img
                                                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f22d72fcff739ae70c277_icon_arrow.svg"
                                                        loading="lazy"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="ry_bodytop_right">
                                                <a
                                                    href="#"
                                                    className="ry_icon-btn-style1 light mr-10 w-inline-block"
                                                    onClick={this.toggleSelectMenu.bind(
                                                        this
                                                    )}
                                                >
                                                    <img
                                                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647eef8aec75fb8b58e0fc0c_icon_filter.svg"
                                                        loading="lazy"
                                                        alt=""
                                                        className="icon-btn_asset"
                                                    />
                                                    <div>Filter</div>
                                                </a>
                                                {showSelectMenu && (
                                                    <div className="select-menu">
                                                        <select
                                                            value={
                                                                this.state
                                                                    .selectedOption
                                                            }
                                                            onChange={this.handleOptionChange.bind(
                                                                this
                                                            )}
                                                        >
                                                            <option value="all">
                                                                All
                                                            </option>
                                                            <option value="you">
                                                                About You
                                                            </option>
                                                            <option value="company">
                                                                About Company
                                                            </option>
                                                        </select>
                                                    </div>
                                                )}
                                                <a
                                                    data-w-id="8232ce11-9743-edb8-96ba-6624a1340167"
                                                    href="#"
                                                    className="ry_icon-btn-style1 w-inline-block"
                                                >
                                                    <img
                                                        src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647eeef43d800823119afa9f_icon_add-white.svg"
                                                        loading="lazy"
                                                        alt=""
                                                        className="icon-btn_asset"
                                                        onClick={
                                                            this.toggleModal
                                                        }
                                                    />
                                                    <div>Add</div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="ry_bodycontainer">
                                            <ReviewsList
                                                reviewsData={reviewsData}
                                                loadMore={
                                                    this.loadMoreReviewsData
                                                }
                                                reviewAddCommentFunction={
                                                    this.reviewComment
                                                }
                                                reviewLikesUpdateFunction={
                                                    this.reviewLikes
                                                }
                                                reviewDislikesUpdateFunction={
                                                    this.reviewDislikes
                                                }
                                                selectedOption={selectedOption}
                                            />
                                            <ReviewsLeaderboard
                                                employeeData={employeeData}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showModal && (
                        <ReviewsModal
                            toggleModal={this.toggleModal}
                            employeeData={employeeData}
                            handleReviewInsert={this.reviewInsert}
                        />
                    )}
                </div>
            );
        } else {
            return <div className="loading"></div>;
        }
    }
}

export default withTracker(() => {
    LoginWatcher.initiateWatch(LoginWatcherName);
    return {
        user: LoginWatcher.UsersData
        //goalsItems: LoginWatcher.Goals,
    };
})(Reviews);
