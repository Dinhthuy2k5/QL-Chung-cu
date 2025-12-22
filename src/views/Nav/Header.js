import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import '../../styles/Header.scss';
import LanguageSwitcher from "../../components/LanguageSwitcher";

// 1. Import hook 'useTranslation' thay vì HOC
import { useTranslation } from 'react-i18next';

export default function Header({ isLoggedIn, handleLoggedOut, userLoggedIn, setIsChangeInfor, setIsViewInfor }) {

    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    //const [show, setShow] = React.useState(false);
    return (
        // Thẻ header lớn bao bọc cả 2 thanh
        <header className="header-container">

            {/* Thanh trên: Chứa logo và các nút hành động */}
            <div className="top-bar">
                <div className="logo">
                    {/* Bạn có thể đặt logo ở đây */}
                    <NavLink to="/">
                        {/* <img src="/path/to/logo.png" alt="Logo" /> */}
                        Quản lý Chung cư BlueMoon
                    </NavLink>
                </div>
                <div className="nav-actions" >

                    <LanguageSwitcher /> {/* <-- Thêm nút chuyển ngôn ngữ ở đây */}

                    {isLoggedIn ?
                        < div className="user-menu"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}>

                            <span className="welcome-message">{t('welcome')}!! - {userLoggedIn}</span>
                            <div className="user-avatar">👤</div> {/* Icon người dùng đơn giản */}
                            {
                                isDropdownOpen &&
                                <div className="dropdown-menu">
                                    <NavLink to="/change-infor" className="dropdown-item" onClick={setIsChangeInfor(true)}>
                                        {t('header.change_information')}
                                    </NavLink>
                                    <NavLink to="/view-infor" className="dropdown-item" onClick={setIsViewInfor(true)}>
                                        {t('header.view_information')}
                                    </NavLink>
                                    <div onClick={handleLoggedOut} className="dropdown-item logout">
                                        {t('header.log_out')}
                                    </div>
                                </div>
                            }

                        </div>
                        :
                        <NavLink to="/log-in" className="btn-login" >
                            {t('login')}
                        </NavLink>
                    }
                    {/* Bạn có thể thêm các nút khác ở đây nếu muốn */}
                </div>
            </div>

            {/* Thanh dưới: Chứa các link điều hướng chính */}
            <nav className="navigation-bar">
                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                        {t('nav.home')}
                    </NavLink>
                    <NavLink to="/apartments" className={({ isActive }) => (isActive ? "active" : "")}>
                        {t('nav.apartment')}
                    </NavLink>
                    <NavLink to="/residents" className={({ isActive }) => (isActive ? "active" : "")}>
                        {t('nav.resident')}
                    </NavLink>
                    <NavLink to="/receipts" className={({ isActive }) => (isActive ? "active" : "")}>
                        {t('nav.receipt')}
                    </NavLink>
                    <NavLink to="/statistics" className={({ isActive }) => (isActive ? "active" : "")}>
                        {t('nav.statistic')}
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
                        {t('nav.setting')}
                    </NavLink>

                </div>
            </nav>

        </header>
    );
}