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
        this.feedbackDataGet = this.feedbackDataGet.bind(this);
        LoginWatcher.setWatcher(this, LoginWatcherName);
        this.state = {
            feedbackData: []
        };
    }

    // componentDidMount() {
    //     this.feedbackDataGet();
    //     LoginWatcher.getFeedbackData();
    // }

    feedbackDataGet() {
        LoginWatcher.getFeedbackData()
            .then((result) => {
                this.setState({feedbackData: result.data});
            })
            .catch((err) => {
                return err;
            });
    }

    render() {
        const {user} = this.props;
        const {feedbackData} = this.state;

        return (
            <div className="ry_main-style1">
                <div className="ry_main-style1_container">
                    <div className="section-style1 mt-0">
                        <div className="ry_body pb-0">
                            <div className="ry_bodycontainer">
                                <FeedbackBodyLeft />
                                <FeedbackBodyRight />
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
