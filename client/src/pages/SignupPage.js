import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './AuthForm.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { name, email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post('/api/auth/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="auth-container">
                <h2>Create Your Account</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={email} onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button 
                        type="submit" 
                        className={`submit-btn ${isLoading ? 'is-loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>OR</span>
                </div>
                {/* --- THIS IS THE FIX --- */}
                <a href="http://localhost:8000/api/auth/google" className="google-btn">
                    <svg viewBox="0 0 24 24" width="20px" height="20px">
                        <path fill="#4285F4" d="M22.56,12.25C22.56,11.47 22.49,10.72 22.35,10H12.25V14.5H18.2C17.96,15.89 17.2,17.08 16.1,17.8V20.25H18.9C21.05,18.33 22.56,15.54 22.56,12.25Z"/>
                        <path fill="#34A853" d="M12.25,23C15.2,23 17.7,22 18.9,20.25L16.1,17.8C15.15,18.44 13.84,18.88 12.25,18.88C9.5,18.88 7.15,17.03 6.25,14.75H3.3V17.2C4.55,19.66 8.08,23 12.25,23Z"/>
                        <path fill="#FBBC05" d="M6.25,14.75C6.03,14.15 5.9,13.48 5.9,12.75C5.9,12.02 6.03,11.35 6.25,10.75V8.3H3.3C2.45,9.9 2,11.28 2,12.75C2,14.22 2.45,15.6 3.3,17.2L6.25,14.75Z"/>
                        <path fill="#EA4335" d="M12.25,6.62C13.98,6.62 15.34,7.23 16.48,8.28L19.03,5.75C17.7,4.6 15.2,3.5 12.25,3.5C8.08,3.5 4.55,6.34 3.3,8.8L6.25,11.25C7.15,8.97 9.5,6.62 12.25,6.62Z"/>
                    </svg>
                    Sign up with Google
                </a>
            </div>
        </div>
    );
};

export default SignupPage;

