import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AuthForm.css'; // We can reuse the auth form styles for the container

const GoogleCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // We have a token. Log the user in!
            login(token);
            // Navigate to the main planner page
            navigate('/planner');
        } else {
            // No token, something went wrong. Send to login.
            navigate('/login');
        }
    }, [login, navigate, searchParams]);

    return (
        <div className="page-container">
            <div className="auth-container" style={{ textAlign: 'center' }}>
                <h2>Loading...</h2>
                <p>Please wait while we log you in.</p>
            </div>
        </div>
    );
};

export default GoogleCallbackPage;
