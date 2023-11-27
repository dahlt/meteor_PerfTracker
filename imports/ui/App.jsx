/* eslint-disable no-console */
import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {
    Login,
    SignUp,
    ForgotPassword,
    NewPassword,
    Dashboard,
    Goals,
    Insights,
    Reviews,
    Timesheet,
    Attendance,
    ActivityLevel,
    Timeline,
    Reports,
    Feedback
} from "./pages/registry";

Accounts.onEmailVerificationLink((token, done) => {
    console.log("Client-side code is running inside!");
    console.log("Token:", token);

    // Use token to verify the user's email
    Accounts.verifyEmail(token, (error) => {
        if (error) {
            console.error("Error verifying email:", error.reason);
        } else {
            alert("Email verification successful!");
            console.log("Email verification successful");
            // Redirect the user to a success page or home page
        }
        done();
    });
});

export const App = () => (
    <>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/sign-up" element={<SignUp />} />

                <Route path="/reset-password" element={<ForgotPassword />} />

                <Route path="/create-new-password" element={<NewPassword />} />

                {/* <Route path="/dashboard" element={<Dashboard />} /> */}

                <Route path="/goals" element={<Goals />} />

                {/* <Route path="/insights" element={<Insights />} /> */}

                {/* <Route path="/review" element={<Reviews />} /> */}

                {/* <Route path="/reports" element={<Reports />} /> */}

                <Route path="/timesheets" element={<Timesheet />} />

                <Route path="/timeline" element={<Timeline />} />

                <Route path="/attendance" element={<Attendance />} />

                <Route path="/activity-level" element={<ActivityLevel />} />

                <Route path="/360-feedback" element={<Feedback />} />
            </Routes>
        </Router>
    </>
);
