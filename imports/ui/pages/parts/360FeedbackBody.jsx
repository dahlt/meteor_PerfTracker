/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {Component} from "react";
import LoginWatcher from "../../../api/classes/client/LoginWatcher";
import FeedbackBodyLeft from "./360FeedbackLeft";
import FeedbackBodyRight from "./360FeedbackRight";
import {withTracker} from "meteor/react-meteor-data";

const LoginWatcherName = "360feedbackBody-watcher";

export class FeedbackBody extends Component {
    constructor(props) {
        super(props);
        LoginWatcher.setWatcher(this, LoginWatcherName);
    }

    render() {
        const {feedbackData} = this.props;
        console.log("feedbackData", feedbackData);

        return (
            <div className="ry_main-style1">
                <div className="ry_main-style1_container">
                    <div className="section-style1 mt-0">
                        <div className="ry_body pb-0">
                            <div className="ry_bodycontainer">
                                <FeedbackBodyLeft feedbackData={feedbackData} />
                                <FeedbackBodyRight
                                    feedbackData={feedbackData}
                                    user={this.props.user}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    LoginWatcher.initiateWatch(LoginWatcherName);
    return {
        user: LoginWatcher.UsersData
        //goalsItems: LoginWatcher.Goals,
    };
})(FeedbackBody);
