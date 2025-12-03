import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import TemporaryAbsenceModal from "./TemporaryAbsenceModal";
import TemporaryAddressModal from "./TemporaryAddressModal";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import { useTranslation } from 'react-i18next';
import '../../styles/resident-styles/ResidentGlobal.scss'; // Đảm bảo import file style mới

function ListResidents(props) {
    // 1. Khai báo Hooks và Props
    const { t } = useTranslation();
    const { listResidents, deleteAResident, handleOpenEditModal, handleAddResident } = props;

    // 2. Khai báo State
    const [isTemporaryAbsence, setIsTemporaryAbsence] = useState(false);
    const [isTemporaryAddress, setIsTemporaryAddress] = useState(false);
    const [filteredList, setFilteredList] = useState([]);

    // 3. Effect: Cập nhật filteredList khi listResidents từ cha thay đổi
    useEffect(() => {
        setFilteredList(listResidents);
    }, [listResidents]);

    // 4. Hàm xử lý tìm kiếm (Nhận data từ SearchBar)
    const handleSearch = (query) => {
        // query cấu trúc: { text: '...', category: '...' }
        const searchText = query.text ? query.text.toLowerCase() : '';
        const category = query.category;

        if (!searchText) {
            setFilteredList(listResidents);
            return;
        }

        const result = listResidents.filter(item => {
            const itemValue = item[category];
            // Kiểm tra null/undefined trước khi toString()
            if (itemValue) {
                return itemValue.toString().toLowerCase().includes(searchText);
            }
            return false;
        });
        setFilteredList(result);
    };

    // 5. Hàm xử lý Cấp Tạm Vắng (API)
    const handleGrantAbsence = async (formData) => {
        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/tam-vang`;

        const data = {
            "cccd": formData.cccd,
            "ngayBatDau": formData.ngayBatDau,
            "ngayKetThuc": formData.ngayKetThuc,
            "lyDo": formData.lyDo
        };

        try {
            const response = await axios.post(apiUrl, data, config);
            console.log("Gửi thông tin tạm vắng thành công", response.data);
            alert(t('resident_list.alerts.absence_success'));
        } catch (error) {
            console.log("Lỗi tạm vắng:", error.response ? error.response.data : error.message);
            alert(t('resident_list.alerts.absence_fail') || "Có lỗi xảy ra");
        }

        // Đóng modal
        setIsTemporaryAbsence(false);
    };

    // 6. Hàm xử lý Cấp Tạm Trú (API)
    const handleGrantAddress = async (formData) => {
        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/tam-tru`;

        const data = {
            "cccd": formData.cccd,
            "hoVaTen": formData.hoVaTen,
            "idCanHo": formData.idCanHo,
            "ngayBatDau": formData.ngayBatDau,
            "ngayKetThuc": formData.ngayKetThuc,
            "lyDo": formData.lyDo
        };

        try {
            const response = await axios.post(apiUrl, data, config);
            console.log("Gửi thông tin tạm trú thành công", response.data);
            alert(t('resident_list.alerts.address_success'));
        } catch (error) {
            const errorMsg = error.response ? error.response.data.message : error.message;
            console.log("Lỗi tạm trú:", errorMsg);
            alert(`${t('resident_list.alerts.address_fail')}: ${errorMsg}`);
        }

        // Đóng modal
        setIsTemporaryAddress(false);
    };

    return (
        <div className="list-resident-container">

            {/* --- TOOLBAR: Tìm kiếm & Action Buttons --- */}
            <div className="list-resident-toolbar">
                <div className="search-group">
                    {/* Truyền hàm handleSearch xuống component con */}
                    <SearchBar onSearch={handleSearch} />
                </div>

                <div className="action-group">
                    <button className="btn-secondary" onClick={() => setIsTemporaryAbsence(true)}>
                        <span>✈️</span> {t('resident_list.temp_absence_button')}
                    </button>

                    <button className="btn-secondary" onClick={() => setIsTemporaryAddress(true)}>
                        <span>🏠</span> {t('resident_list.temp_residence_button')}
                    </button>

                    <button className="btn-primary" onClick={handleAddResident}>
                        <span>➕</span> {t('resident_list.add_resident_button')}
                    </button>
                </div>
            </div>

            {/* --- TABLE: Glassmorphism Style --- */}
            <div className="glass-table">
                <table>
                    <thead>
                        <tr>
                            <th>{t('resident_list.table_header.cccd')}</th>
                            <th>{t('resident_list.table_header.head_cccd')}</th>
                            <th>{t('resident_list.table_header.name')}</th>
                            <th>{t('resident_list.table_header.dob')}</th>
                            <th>{t('resident_list.table_header.gender')}</th>
                            <th>{t('resident_list.table_header.ethnicity')}</th>
                            <th>{t('resident_list.table_header.phone')}</th>
                            <th>{t('resident_list.table_header.relationship')}</th>
                            <th className="text-right">{t('resident_list.table_header.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList && filteredList.length > 0 ? (
                            filteredList.map((item) => (
                                <tr key={item.cccd}>
                                    <td style={{ fontFamily: 'monospace', color: '#4cc9f0', fontWeight: 'bold' }}>
                                        {item.cccd}
                                    </td>
                                    <td>{item.cccdChuHo}</td>
                                    <td style={{ fontWeight: '600', color: '#ffffff' }}>
                                        {item.hoVaTen}
                                    </td>
                                    <td>{item.ngaySinh}</td>
                                    <td>{item.gioiTinh}</td>
                                    <td>{item.danToc}</td>
                                    <td>{item.sdt}</td>
                                    <td>{item.quanHe}</td>
                                    <td className="action-cell">
                                        <button className="edit-btn" onClick={() => handleOpenEditModal(item)}>
                                            {t('resident_list.actions.edit')}
                                        </button>
                                        <button className="delete-btn" onClick={() => deleteAResident(item.cccd)}>
                                            {t('resident_list.actions.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#adb5bd' }}>
                                    {t('resident_list.no_data')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- Modals --- */}
            <TemporaryAbsenceModal
                show={isTemporaryAbsence}
                onClose={() => setIsTemporaryAbsence(false)}
                onSubmit={handleGrantAbsence}
            />
            <TemporaryAddressModal
                show={isTemporaryAddress}
                onClose={() => setIsTemporaryAddress(false)}
                onSubmit={handleGrantAddress}
            />
        </div>
    );
}

export default ListResidents;