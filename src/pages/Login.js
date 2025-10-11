import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss";
import axios from "axios";
import { getToken, setToken, removeToken } from "../services/localStorageService";

export default function Login({ onLoggedIn, setUserLoggedIn }) {
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

            // Kiểm tra nếu backend trả về lỗi logic (vd: sai mật khẩu)
            if (response.data.code !== 1000) {
                throw new Error(response.data.message || 'Thông tin đăng nhập không chính xác');
            }
            setToken(response.data.result?.token);
            onLoggedIn();
            setUserLoggedIn(username);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            alert(error.response?.data?.message || error.message);
        }
        // onLoggedIn();
        // setUserLoggedIn(username);
        // navigate("/");

    };

    return (
        <div className="login-page">

            <form className="login-box" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password..."
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

                <button type="submit" className="btn-login">Đăng nhập</button>

                <a href="/forgot-password" className="forgot-link">
                    Quên mật khẩu?
                </a>
            </form>

        </div>
    );
}
