import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss";
import axios from "axios";
import { getToken, setToken, removeToken } from "../services/localStorageService";
// 1. Import hook useTranslation
import { useTranslation } from "react-i18next";

// Icon Mắt mở (Basic)
const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

// Icon Mắt nhắm (Basic có gạch chéo)
const EyeClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

export default function Login({ onLoggedIn, setUserLoggedIn }) {
    // 2. Lấy hàm dịch 't'
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const accessToken = getToken();
        if (accessToken) {
            // removeToken();
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/qlcc/auth/token",
                {
                    username: username,
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response body:", response.data);

            if (response.data.code !== 1000) {
                // 3. Dịch thông báo lỗi chung
                throw new Error(response.data.message || t('login_page.login_fail_generic'));
            }
            setToken(response.data.result?.token);
            onLoggedIn();
            setUserLoggedIn(username);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            // 4. Dịch tiền tố của alert
            alert(t('login_page.login_fail_alert_prefix') + ": " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="login-page">
            <form className="login-box" onSubmit={handleSubmit}>
                {/* Ô nhập Username */}
                <div className="input-group">
                    <input
                        className="login-input"
                        type="text"
                        placeholder={t('login_page.username_placeholder')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                {/* Ô nhập Password */}
                <div className="input-group password-wrapper">
                    <input
                        className="login-input"
                        type={showPassword ? "text" : "password"}
                        placeholder={t('login_page.password_placeholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </span>
                </div>

                <button type="submit" className="btn-login">{t('login')}</button>

                <a href="/forgot-password" className="forgot-link">
                    {t('login_page.forgot_password')}
                </a>
            </form>
        </div>
    );
}