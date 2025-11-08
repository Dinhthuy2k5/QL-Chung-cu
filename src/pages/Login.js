import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss";
import axios from "axios";
import { getToken, setToken } from "../services/localStorageService";
// 1. Import hook useTranslation
import { useTranslation } from "react-i18next";

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
                {/* 5. Dịch các placeholder */}
                <input
                    type="text"
                    placeholder={t('login_page.username_placeholder')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <div className="password-wrapper">
                    <input
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
                        {showPassword ? "🙈" : "👁️"}
                    </span>
                </div>

                {/* 6. Dịch nút bấm (sử dụng key 'login' đã có) */}
                <button type="submit" className="btn-login">{t('login')}</button>

                <a href="/forgot-password" className="forgot-link">
                    {/* 7. Dịch link quên mật khẩu */}
                    {t('login_page.forgot_password')}
                </a>
            </form>
        </div>
    );
}