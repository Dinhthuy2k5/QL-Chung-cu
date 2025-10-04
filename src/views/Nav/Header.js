import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import '../../styles/Header.scss';

export default function Header({ isLoggedIn, handleLoggedOut, userLoggedIn, setIsChangeInfor, setIsViewInfor }) {

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
                        My Website
                    </NavLink>
                </div>
                <div className="nav-actions" >

                    {isLoggedIn ?
                        < div className="user-menu"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}>

                            <span className="welcome-message">Xin chào! - {userLoggedIn}</span>
                            <div className="user-avatar">👤</div> {/* Icon người dùng đơn giản */}
                            {
                                isDropdownOpen &&
                                <div className="dropdown-menu">
                                    <NavLink to="/change-infor" className="dropdown-item" onClick={setIsChangeInfor(true)}>
                                        Sửa thông tin
                                    </NavLink>
                                    <NavLink to="/view-infor" className="dropdown-item" onClick={setIsViewInfor(true)}>
                                        Xem thông tin
                                    </NavLink>
                                    <div onClick={handleLoggedOut} className="dropdown-item logout">
                                        Đăng xuất
                                    </div>
                                </div>
                            }

                        </div>
                        :
                        <NavLink to="/log-in" className="btn-login" >
                            Đăng nhập
                        </NavLink>
                    }
                    {/* Bạn có thể thêm các nút khác ở đây nếu muốn */}
                </div>
            </div>

            {/* Thanh dưới: Chứa các link điều hướng chính */}
            <nav className="navigation-bar">
                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                        Trang chủ
                    </NavLink>
                    <NavLink to="/apartments" className={({ isActive }) => (isActive ? "active" : "")}>
                        Căn hộ
                    </NavLink>
                    <NavLink to="/residents" className={({ isActive }) => (isActive ? "active" : "")}>
                        Cư dân
                    </NavLink>
                    <NavLink to="/receipts" className={({ isActive }) => (isActive ? "active" : "")}>
                        Khoản thu
                    </NavLink>
                    <NavLink to="/statistics" className={({ isActive }) => (isActive ? "active" : "")}>
                        Thống kê
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
                        Cài đặt
                    </NavLink>

                </div>
            </nav>

        </header>
    );
}