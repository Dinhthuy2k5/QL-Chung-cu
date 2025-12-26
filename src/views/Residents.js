import React, { useState, useEffect } from "react";
import '../styles/resident-styles/ResidentGlobal.scss';

import ListResidents from "../components/resident_component/ListResident";
import EditModal from "../components/resident_component/EditModal";
import axios from "axios";
import { getToken } from "../services/localStorageService";
import { NavLink, Routes, Route, useLocation } from "react-router-dom";
import StatisticByGender from "../components/resident_component/StatisticByGender";
import StatisticByAge from "../components/resident_component/StatisticByAge";
import StatisticByStatus from "../components/resident_component/StatisticByStatus";
import Families from "../components/resident_component/Families";
import ResidentQueryHistory from '../components/resident_component/ResidentQueryHistory';
import StatisticByTime from "../components/resident_component/StatisticByTime";

import { useTranslation } from "react-i18next";

function Resident({ listResidents, setListResidents, listFamilies, setListFamilies }) {

    const { t } = useTranslation();
    const location = useLocation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResident, setEditingResident] = useState(null);
    const [isAddResident, setIsAddResident] = useState(false);
    const [isUpdateResident, setIsUpdateResident] = useState(false);
    const [isStatDropdownOpen, setStatDropdownOpen] = useState(false);

    // --- 1. HÀM XÓA (CẬP NHẬT ALERT) ---
    const deleteAResident = (cccd) => {
        // Xác nhận trước khi xóa
        if (!window.confirm("Bạn có chắc chắn muốn xóa cư dân này?")) {
            return;
        }

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/nhan-khau/${cccd}`;

        axios.delete(apiUrl, config)
            .then(response => {
                console.log('Xóa nhân khẩu thành công!', response.data);
                // THÊM ALERT THÀNH CÔNG
                alert(t('resident_list.alerts.delete_success') || "Xóa nhân khẩu thành công!");

                // Cập nhật UI sau khi xóa thành công
                setListResidents(prevList => prevList.filter(item => item.cccd !== cccd));
            })
            .catch(error => {
                console.error('Lỗi khi xóa nhân khẩu:', error.response ? error.response.data : error.message);
                // THÊM ALERT LỖI
                alert(t('resident_list.alerts.delete_fail') || "Có lỗi xảy ra khi xóa nhân khẩu!");
            });
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

    // --- 2. HÀM LƯU (THÊM/SỬA) (CẬP NHẬT ALERT) ---
    const handleSaveResident = (residentData) => {
        const isNew = !listResidents.some(item => item.cccd === residentData.cccd);

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        if (isNew) {
            // --- TRƯỜNG HỢP THÊM MỚI ---
            const apiUrl = `http://localhost:8080/qlcc/nhan-khau`;

            axios.post(apiUrl, residentData, config)
                .then(response => {
                    console.log('Thêm nhân khẩu thành công!', response.data);
                    // THÊM ALERT
                    alert(t('resident_list.alerts.add_success') || "Thêm nhân khẩu mới thành công!");

                    // Cập nhật UI
                    setListResidents(prevList => [...prevList, residentData]);
                    setIsModalOpen(false);
                    setEditingResident(null);
                    setIsAddResident(false);
                })
                .catch(error => {
                    console.error('Lỗi khi thêm nhân khẩu:', error.response ? error.response.data : error.message);
                    // THÊM ALERT LỖI
                    const msg = error.response?.data?.message || "Lỗi khi thêm nhân khẩu!";
                    alert(msg);
                });

        } else {
            // --- TRƯỜNG HỢP CẬP NHẬT ---
            const apiUrl = `http://localhost:8080/qlcc/nhan-khau/${residentData.cccd}`;

            axios.put(apiUrl, residentData, config) // Nhớ thêm config token vào put nếu backend yêu cầu
                .then(response => {
                    console.log('Cập nhật thành công!', response.data);
                    // THÊM ALERT
                    alert(t('resident_list.alerts.update_success') || "Cập nhật thông tin thành công!");

                    // Cập nhật UI
                    let currentResidents = [...listResidents];
                    let index = currentResidents.findIndex(item => item.cccd === residentData.cccd);
                    if (index !== -1) {
                        currentResidents[index] = residentData;
                        setListResidents(currentResidents);
                    }
                    setIsModalOpen(false);
                    setEditingResident(null);
                    setIsUpdateResident(false);
                })
                .catch(error => {
                    console.error('Có lỗi xảy ra khi update nhân khẩu:', error.response ? error.response.data : error.message);
                    // THÊM ALERT LỖI
                    const msg = error.response?.data?.message || "Lỗi khi cập nhật nhân khẩu!";
                    alert(msg);
                });
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingResident(null);
        setIsAddResident(false);
        setIsUpdateResident(false);
    };

    const isStatisticActive = location.pathname.includes("/residents/statistic");

    return (
        <div className="resident-page-wrapper">
            <div className="resident-header">
                {/* MENU TAB NGANG */}
                <div className="resident-nav-tabs">
                    <NavLink to="/residents" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        {t('resident_page.menu_list')}
                    </NavLink>

                    <NavLink to="/residents/families" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        {t('resident_page.menu_families')}
                    </NavLink>

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

            <div className="resident-content">
                <Routes>
                    <Route index element={
                        <ListResidents
                            listResidents={listResidents}
                            deleteAResident={deleteAResident}
                            handleOpenEditModal={handleOpenEditModal}
                            handleAddResident={handleAddResident}
                        />
                    } />
                    <Route path="families" element={<Families listFamilies={listFamilies}
                        setListFamilies={setListFamilies} />} />

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