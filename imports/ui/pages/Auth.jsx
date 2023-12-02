/* eslint-disable func-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const clientId = "4vLUl9d_pj-PUCL5XiQlXtqlh3Mx4eB2G_je0WsvVYo";
const redirectUri = "http://localhost:3000/goals"; // Make sure this matches your app's configured redirect URI

const discoveryEndpoint =
    "https://account.hubstaff.com/.well-known/openid-configuration";

// Helper function to generate a unique nonce
function generateUniqueNonce() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

const AuthPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const authorizationCode = queryParams.get("code");
        //console.log(authorizationCode);

        const exchangeToken = async () => {
            if (authorizationCode) {
                try {
                    const response = await fetch("/token-exchange", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({authorizationCode})
                    });

                    const data = await response.json();
                    // console.log("Token Exchange Response:", data);

                    // Now you can navigate to the dashboard
                    // navigate("/dashboard");
                } catch (error) {
                    console.error("Token Exchange Error:", error);
                }
            } else {
                const response = await fetch(discoveryEndpoint);
                const discoveryConfig = await response.json();

                const authorizationUrl = new URL(
                    discoveryConfig.authorization_endpoint
                );
                authorizationUrl.searchParams.append("client_id", clientId);
                authorizationUrl.searchParams.append("response_type", "code");
                authorizationUrl.searchParams.append(
                    "scope",
                    "openid profile email hubstaff:read hubstaff:write"
                );
                authorizationUrl.searchParams.append(
                    "redirect_uri",
                    redirectUri
                );
                authorizationUrl.searchParams.append(
                    "nonce",
                    generateUniqueNonce()
                );

                // Redirect the user to the authorization URL
                window.location.href = authorizationUrl.toString();
            }
        };

        exchangeToken();
    }, []);

    return <div>Redirecting to authentication...</div>;
};

export default AuthPage;
