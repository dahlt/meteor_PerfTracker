/* eslint-disable no-console */
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
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
    Feedback,
    AuthPage
} from "./pages/registry";
import LoginWatcher from "../api/classes/client/LoginWatcher";

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

export const App = () => {
    const isAuthenticated = LoginWatcher.isAuthenticated();
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/sign-up" element={<SignUp />} />

                <Route path="/reset-password" element={<ForgotPassword />} />

                <Route path="/create-new-password" element={<NewPassword />} />

                {/* <Route path="/dashboard" element={<Dashboard />} /> */}

                <Route
                    path="/goals"
                    element={
                        isAuthenticated ? (
                            <Goals />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />

                {/* <Route path="/insights" element={<Insights />} /> */}

                {/* <Route path="/review" element={<Reviews />} /> */}

                {/* <Route path="/reports" element={<Reports />} /> */}

                <Route
                    path="/timesheets"
                    element={
                        isAuthenticated ? (
                            <Timesheet />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />

                <Route
                    path="/timeline"
                    element={
                        isAuthenticated ? (
                            <Timeline />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />

                <Route
                    path="/attendance"
                    element={
                        isAuthenticated ? (
                            <Attendance />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />

                <Route
                    path="/activity-level"
                    element={
                        isAuthenticated ? (
                            <ActivityLevel />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />

                <Route
                    path="/360-feedback"
                    element={
                        isAuthenticated ? (
                            <Feedback />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />

                <Route
                    path="/auth"
                    element={
                        isAuthenticated ? (
                            <AuthPage />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};
