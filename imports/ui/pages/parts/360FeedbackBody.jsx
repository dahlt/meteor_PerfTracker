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

    getMatchingEmployeeHours() {
        const {feedbackData} = this.state;
        const {user} = this.props;

        if (user) {
            const matchingEmployeeHoursData = feedbackData.filter(
                (hours) => hours.employeeName === user.profile
            );

            return matchingEmployeeHoursData;
        }
        return []; // Return an empty array if no matching employee or hours found
    }

    render() {
        const {user} = this.props;
        const {feedbackData} = this.state;

        const matchingEmployee = feedbackData.find(
            (employee) => employee.employeeName === user.profile
        );
        if (matchingEmployee) {
            return (
                <div className="ry_bodycontainer">
                    <FeedbackBodyLeft chartData={feedbackData} />
                    <FeedbackBodyRight surveyData={feedbackData} />
                </div>
            );
        } else {
            return null;
        }
    }
}

export default withTracker(() => {
    LoginWatcher.initiateWatch(LoginWatcherName);
    return {
        user: LoginWatcher.UsersData
        //goalsItems: LoginWatcher.Goals,
    };
})(FeedbackBody);
