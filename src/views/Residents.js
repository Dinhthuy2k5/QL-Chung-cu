import React, { useState, useEffect } from "react"; // Import hooks
import '../styles/resident-styles/Resident.scss'
import '../styles/resident-styles/List_Resident.scss'
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

    // 4. Chuyển đổi state sang hooks
    const [listResidents, setListResidents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResident, setEditingResident] = useState(null);
    const [isAddResident, setIsAddResident] = useState(false);
    const [isUpdateResident, setIsUpdateResident] = useState(false);
    const [isDropdownStatistic, setIsDropdownStatistic] = useState(false);
    const [isDropdownQuery, setIsDropdownQuery] = useState(false);
    const [searchQuery, setSearchQuery] = useState({ text: '', category: 'hoVaTen' });

    // 5. Sử dụng useEffect để đồng bộ props với state (thay cho getListResidents)
    useEffect(() => {
        setListResidents(props.listResidents || []);
    }, [props.listResidents]);

    // --- Chuyển đổi các hàm của class thành const functions ---

    const handleSearch = (query) => {
        setSearchQuery(query);
    }

    const deleteAResident = (cccd) => {
        setListResidents(prevList => prevList.filter(item => item.cccd !== cccd));
        // Bạn cũng nên gọi API DELETE ở đây
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

    // --- Bắt đầu phần Render ---
    const filteredResidents = listResidents.filter(resident => {
        const searchText = searchQuery.text.toLowerCase();
        const searchCategory = searchQuery.category;
        if (!searchText) return true;
        const residentData = resident[searchCategory];
        if (residentData) {
            return residentData.toString().toLowerCase().includes(searchText);
        }
        return false;
    });

    const currentPath = location.pathname;
    const isStatisticActive = currentPath.startsWith('/residents/statistic');
    const isQueryActive = currentPath.startsWith('/residents/query');

    return (
        <div className="page-container">
            <div className="resident-menu">
                {/* 6. Dịch toàn bộ văn bản bằng hàm t() */}
                <NavLink
                    to="/residents"
                    end
                    className={({ isActive }) => isActive ? "h4-navlink active-link" : "h4-navlink"}>
                    <h4>{t('resident_page.menu_list')}</h4>
                </NavLink>
                <NavLink
                    to="/residents/families"
                    className={({ isActive }) => isActive ? "h4-navlink active-link" : "h4-navlink"}>
                    <h4>{t('resident_page.menu_families')}</h4>
                </NavLink>

                <div
                    className="menu-item"
                    onMouseEnter={() => setIsDropdownStatistic(true)}
                    onMouseLeave={() => setIsDropdownStatistic(false)}
                >
                    <h4 className={isStatisticActive ? "active-link" : ""}>{t('resident_page.menu_statistics')}</h4>
                    {isDropdownStatistic && (
                        <div className="dropdown-menu">
                            <NavLink to="statistic/by-gender" className="dropdown-item" onClick={() => setIsDropdownStatistic(false)}>
                                <span>{t('resident_page.stats_by_gender')}</span>
                            </NavLink>
                            <NavLink to="statistic/by-age" className="dropdown-item" onClick={() => setIsDropdownStatistic(false)}>
                                <span>{t('resident_page.stats_by_age')}</span>
                            </NavLink>
                            <NavLink to="statistic/by-status" className="dropdown-item" onClick={() => setIsDropdownStatistic(false)}>
                                <span>{t('resident_page.stats_by_status')}</span>
                            </NavLink>
                            <NavLink to="statistic/by-time" className="dropdown-item" onClick={() => setIsDropdownStatistic(false)}>
                                <span>{t('resident_page.stats_by_time')}</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                <div className="menu-item"
                    onMouseEnter={() => setIsDropdownQuery(true)}
                    onMouseLeave={() => setIsDropdownQuery(false)}>
                    <h4 className={isQueryActive ? "active-link" : ""}>{t('resident_page.menu_query')}</h4>
                    {isDropdownQuery && (
                        <div className="dropdown-menu">
                            <NavLink to="query/search" className="dropdown-item" onClick={() => setIsDropdownQuery(false)}>
                                <span>{t('resident_page.query_search')}</span>
                            </NavLink>
                            <NavLink to="query/history" className="dropdown-item" onClick={() => setIsDropdownQuery(false)}>
                                <span>{t('resident_page.query_history')}</span>
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>

            <Routes>
                <Route index element={
                    <ListResidents
                        listResidents={filteredResidents}
                        deleteAResident={deleteAResident}
                        handleOpenEditModal={handleOpenEditModal}
                        handleAddResident={handleAddResident}
                        onSearch={handleSearch}
                    />}
                />
                <Route path="families" element={<Families />} />
                <Route path="statistic/by-gender" element={<StatisticByGender />} />
                <Route path="statistic/by-age" element={<StatisticByAge />} />
                <Route path="statistic/by-status" element={<StatisticByStatus />} />
                <Route path="statistic/by-time" element={<StatisticByTime />} />
                <Route path="query/history" element={<ResidentQueryHistory />} />
            </Routes>

            <EditModal
                show={isModalOpen}
                resident={editingResident}
                onClose={handleCloseEditModal}
                onSave={handleSaveResident}
                isAddResident={isAddResident}
                isUpdateResident={isUpdateResident}
            />
        </div>
    );
}

export default Resident;