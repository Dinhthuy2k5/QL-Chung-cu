import React, { useState, useEffect } from "react"; // Import hooks
import '../styles/resident-styles/ResidentGlobal.scss';

import ListResidents from "../components/resident_component/ListResident";
import EditModal from "../components/resident_component/EditModal";
import axios from "axios";
import { getToken } from "../services/localStorageService";
import { NavLink, Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import StatisticByGender from "../components/resident_component/StatisticByGender";
import StatisticByAge from "../components/resident_component/StatisticByAge";
import StatisticByStatus from "../components/resident_component/StatisticByStatus";
import Families from "../components/resident_component/Families";
import ResidentQueryHistory from '../components/resident_component/ResidentQueryHistory';
import StatisticByTime from "../components/resident_component/StatisticByTime";

// 1. Import hook useTranslation
import { useTranslation } from "react-i18next";

// 2. Chuyển đổi sang Function Component
function Resident(props) {

    // 3. Lấy hàm t và hook location
    const { t } = useTranslation();
    const location = useLocation(); // Hook để thay thế window.location.pathname

    const [listResidents, setListResidents] = useState([]);
    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResident, setEditingResident] = useState(null);
    const [isAddResident, setIsAddResident] = useState(false);
    const [isUpdateResident, setIsUpdateResident] = useState(false);

    // State cho Dropdown Thống kê
    const [isStatDropdownOpen, setStatDropdownOpen] = useState(false);

    // Đồng bộ props listResidents
    useEffect(() => {
        setListResidents(props.listResidents || []);
    }, [props.listResidents]);

    // --- Chuyển đổi các hàm của class thành const functions ---



    const deleteAResident = (cccd) => {


        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired')); // Dịch alert
            return;
        }
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/nhan-khau/${cccd}`;

        axios.delete(apiUrl, config)
            .then(response => console.log('Xóa nhân khẩu thành công!', response.data))
            .catch(error => console.error('Lỗi khi xóa nhân khẩu:', error.response ? error.response.data : error.message));
        setListResidents(prevList => prevList.filter(item => item.cccd !== cccd));

    }

    const handleOpenEditModal = (resident) => {
        setIsModalOpen(true);
        setEditingResident(resident);
        setIsAddResident(false);
        setIsUpdateResident(true);
    }

    const handleCloseEditModal = () => {
        setIsModalOpen(false);
        setEditingResident(null);
        setIsAddResident(false);
        setIsUpdateResident(false);
    }

    const handleAddResident = () => {
        setIsModalOpen(true);
        setEditingResident(null);
        setIsAddResident(true);
        setIsUpdateResident(false);
    }

    const handleSaveResident = (residentData) => {
        const isNew = !listResidents.some(item => item.cccd === residentData.cccd);

        if (isNew) {
            setListResidents(prevList => [...prevList, residentData]);
            setIsModalOpen(false);
            setEditingResident(null);
            setIsAddResident(false);

            const token = getToken();
            if (!token) {
                alert(t('alerts.session_expired')); // Dịch alert
                return;
            }
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const apiUrl = `http://localhost:8080/qlcc/nhan-khau`;

            axios.post(apiUrl, residentData, config)
                .then(response => console.log('Thêm nhân khẩu thành công!', response.data))
                .catch(error => console.error('Lỗi khi thêm nhân khẩu:', error.response ? error.response.data : error.message));
        } else {
            let currentResidents = [...listResidents];
            let index = currentResidents.findIndex(item => item.cccd === residentData.cccd);

            if (index !== -1) {
                currentResidents[index] = residentData;
                setListResidents(currentResidents);
                setIsModalOpen(false);
                setEditingResident(null);
                setIsUpdateResident(false);

                const apiUrl = `http://localhost:8080/qlcc/nhan-khau/${residentData.cccd}`;
                axios.put(apiUrl, residentData)
                    .then(response => {
                        console.log('Cập nhật thành công!', response.data);
                    })
                    .catch(error => {
                        console.error('Có lỗi xảy ra khi update nhân khẩu:', error.response ? error.response.data : error.message);
                    });
            }
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingResident(null);
        setIsAddResident(false);
        setIsUpdateResident(false);
    };

    const currentPath = location.pathname;
    // Kiểm tra active tab
    const isStatisticActive = location.pathname.includes("/residents/statistic");

    return (
        <div className="resident-page-wrapper">
            <div className="resident-header">
                {/* <h2 style={{ marginBottom: '25px' }}>Quản lý Cư dân</h2> */}

                {/* --- 1. MENU TAB NGANG --- */}
                <div className="resident-nav-tabs">
                    <NavLink to="/residents" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        {t('resident_page.menu_list')}
                    </NavLink>

                    <NavLink to="/residents/families" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        {t('resident_page.menu_families')}
                    </NavLink>

                    {/* Menu Thống kê có Dropdown */}
                    <div
                        className={`nav-item ${isStatisticActive ? 'active' : ''}`}
                        onMouseEnter={() => setStatDropdownOpen(true)}
                        onMouseLeave={() => setStatDropdownOpen(false)}
                    >
                        {t('resident_page.menu_statistics')} ▾
                        {isStatDropdownOpen && (
                            <div className="nav-dropdown">
                                <NavLink to="statistic/by-gender">{t('resident_page.stats_by_gender')}</NavLink>
                                <NavLink to="statistic/by-age">{t('resident_page.stats_by_age')}</NavLink>
                                <NavLink to="statistic/by-status">{t('resident_page.stats_by_status')}</NavLink>
                                <NavLink to="statistic/by-time">{t('resident_page.stats_by_time')}</NavLink>
                            </div>
                        )}
                    </div>

                    <NavLink to="/residents/query/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        {t('resident_page.menu_query')}
                    </NavLink>
                </div>
            </div>

            {/* --- 2. NỘI DUNG CHÍNH --- */}
            <div className="resident-content">
                <Routes>
                    <Route index element={
                        <ListResidents
                            listResidents={listResidents}
                            deleteAResident={deleteAResident}
                            handleOpenEditModal={handleOpenEditModal}
                            handleAddResident={handleAddResident}
                        // handleSearch được xử lý trong ListResident
                        />
                    } />
                    <Route path="families" element={<Families />} />

                    <Route path="statistic/by-gender" element={<StatisticByGender />} />
                    <Route path="statistic/by-age" element={<StatisticByAge />} />
                    <Route path="statistic/by-status" element={<StatisticByStatus />} />
                    <Route path="statistic/by-time" element={<StatisticByTime />} />

                    <Route path="query/history" element={<ResidentQueryHistory />} />
                </Routes>
            </div>

            <EditModal
                show={isModalOpen}
                resident={editingResident}
                onClose={handleCloseModal}
                onSave={handleSaveResident}
                isAddResident={isAddResident}
                isUpdateResident={isUpdateResident}
            />
        </div>
    );
}

export default Resident;