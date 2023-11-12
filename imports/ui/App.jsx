import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

export const App = () => (
    <>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/sign-up" element={<SignUp />} />

                <Route path="/reset-password" element={<ForgotPassword />} />

                <Route path="/create-new-password" element={<NewPassword />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/goals" element={<Goals />} />

                <Route path="/insights" element={<Insights />} />

                <Route path="/review" element={<Reviews />} />

                <Route path="/reports" element={<Reports />} />

                <Route path="/timesheets" element={<Timesheet />} />

                <Route path="/timeline" element={<Timeline />} />

                <Route path="/attendance" element={<Attendance />} />

                <Route path="/activity-level" element={<ActivityLevel />} />

                <Route path="/360-feedback" element={<Feedback />} />                
            </Routes>
        </Router>
    </>
);
