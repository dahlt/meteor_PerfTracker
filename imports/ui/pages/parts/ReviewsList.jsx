/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, {Component} from "react";
import ReviewsCommentModal from "./ReviewsCommentModal";

export default class ReviewsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showCommentModal: false,
            selectedReview: null,
            selectedReviewId: null
        };
    }

    handleCommentAdd = (reviewId, review) => {
        console.log(reviewId, review);

        this.setState({
            showCommentModal: true,
            selectedReview: review,
            selectedReviewId: reviewId
        });
    };

    toggleCommentModal = () => {
        this.setState({showCommentModal: false});
    };

    handleScroll = () => {
        const {loadMore} = this.props;
        const container = document.getElementById("reviewsContainer");

        if (
            container.scrollTop + container.clientHeight >=
            container.scrollHeight - 20
        ) {
            loadMore();
        }
    };

    filterReviews = (reviewsData) => {
        const {selectedOption} = this.props;

        if (selectedOption === "company") {
            // Filter reviews where sender or receiver is the company
            return reviewsData.filter(
                (review) =>
                    review.sender === "COMPANY ABC" ||
                    review.receiver === "COMPANY ABC"
            );
        } else if (selectedOption === "you") {
            // Filter reviews where sender or receiver is "Dahl Tamares"
            return reviewsData.filter(
                (review) =>
                    review.sender === "Dahl Tamares" ||
                    review.receiver === "Dahl Tamares"
            );
        }

        // If filter is "all" or an invalid filter option, return all reviews
        return reviewsData;
    };

    render() {
        const {reviewsData, reviewAddCommentFunction} = this.props;
        const {selectedReview, selectedReviewId} = this.state;
        // console.log(reviewsData);
        // console.log(selectedReview, selectedReviewId);

        const filteredReviews = this.filterReviews(reviewsData);

        return (
            <div
                id="reviewsContainer"
                className="ry_bodycontainer_left"
                onScroll={this.handleScroll}
                style={{overflowY: "auto", maxHeight: "600px"}}
            >
                {filteredReviews.map((review, index) => (
                    <div className="ry_review" key={index}>
                        <div className="ry_reviewleft">
                            <div className="ry_person-style2 small">
                                <img
                                    className="ry_reviewprofilepicture"
                                    src={review.senderProfilePicture}
                                    loading="lazy"
                                    alt=""
                                />
                            </div>
                            <div className="ry_person-style2 small">
                                <img
                                    className="ry_reviewprofilepicture"
                                    src={review.receiverProfilePicture}
                                    loading="lazy"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="ry_reviewright">
                            <div className="ry_reviewrighttop">
                                <p className="ry_p-style1 mb-0 text-darkblue text-semibold">
                                    {`${review.sender} to ${review.receiver}`}
                                </p>
                                <p className="ry_p-style2">
                                    {new Date(
                                        review.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <p className="ry_p-style1">
                                <strong>@{review.receiver}</strong>{" "}
                                {review.reviewMessage}
                            </p>
                            <div className="ry_reviewrightbottom">
                                <div className="ry_reviewmicro">
                                    <div
                                        className="ry_reviewmicro_icon"
                                        onClick={() =>
                                            this.props.reviewLikesUpdateFunction(
                                                review._id
                                            )
                                        }
                                    >
                                        <img
                                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f3b7d23b0d34b9eb8af1b_review_01.svg"
                                            loading="lazy"
                                            alt=""
                                        />
                                    </div>
                                    <div>{review.likesCount}</div>
                                </div>
                                <div className="ry_reviewmicro">
                                    <div
                                        className="ry_reviewmicro_icon"
                                        onClick={() =>
                                            this.handleCommentAdd(
                                                review._id,
                                                review
                                            )
                                        }
                                    >
                                        <img
                                            src="https://assets.website-files.com/647edc411cb7ba0f95e2d12c/647f3b7ec8d98bb32195c8ea_review_02.svg"
                                            loading="lazy"
                                            alt=""
                                        />
                                    </div>
                                    <div>{review.comments.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {this.state.showCommentModal && (
                    <ReviewsCommentModal
                        toggleModal={this.toggleCommentModal}
                        selectedReview={selectedReview}
                        selectedReviewId={selectedReviewId}
                        reviewAddCommentFunction={reviewAddCommentFunction}
                    />
                )}
            </div>
        );
    }
}
