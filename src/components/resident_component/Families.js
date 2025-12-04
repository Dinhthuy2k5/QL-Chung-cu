import React, { useState, useEffect, useCallback } from "react";
import '../../styles/resident-styles/Families.scss';
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import { useTranslation } from "react-i18next";
import FamilyDetailModal from "./FamilyDetailModal"; // Import Modal mới

function Families() {
    const { t } = useTranslation();
    const [listFamilies, setListFamilies] = useState([]);

    // State cho Modal chi tiết
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState(null);

    const getListFamilies = useCallback(async () => {
        const token = getToken();
        if (!token) {
            // Xử lý khi hết phiên
            return;
        }
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        try {
            const apiUrl = `http://localhost:8080/qlcc/ho-gia-dinh`;
            const response = await axios.get(apiUrl, config);
            setListFamilies(response.data.result || []);
        } catch (error) {
            console.log("Lỗi lấy danh sách hộ:", error);
        }
    }, []);

    useEffect(() => {
        getListFamilies();
    }, [getListFamilies]);

    // Hàm mở Modal chi tiết
    const handleViewDetail = (family) => {
        setSelectedFamily(family);
        setShowDetailModal(true);
    };

    // Hàm đổi chủ hộ (giữ nguyên logic cũ)
    const handleChangeHouseholder = async (currentCccdChuHo) => {
        const cccdNhanKhauMoi = window.prompt(t('families_page.prompts.enter_new_owner_cccd'));
        if (!cccdNhanKhauMoi) return;

        const token = getToken();
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            const apiUrl = `http://localhost:8080/qlcc/ho-gia-dinh/change-chu-ho/${currentCccdChuHo}`;
            await axios.post(apiUrl, { cccdNhanKhauMoi }, config);
            alert(t('families_page.alerts.owner_change_success'));
            getListFamilies();
        } catch (error) {
            alert(error.response?.data?.message || "Error");
        }
    }

    return (
        <div className="family-list-container">
            <div className="family-list-header">
                <h3 className="page-title">{t('families_page.title')}</h3>
                <button className="add-family-btn">
                    <i className="fa-solid fa-plus"></i> {t('families_page.add_button')}
                </button>
            </div>

            <div className="table-wrapper">
                <table className="main-table">
                    <thead>
                        <tr>
                            <th>{t('families_page.table_headers.apartment_id')}</th>
                            <th>{t('families_page.table_headers.head_name')}</th>
                            <th>{t('families_page.table_headers.member_count')}</th>
                            <th>{t('families_page.table_headers.address')}</th>
                            <th>{t('families_page.table_headers.status')}</th>
                            <th className="actions-header">{t('families_page.table_headers.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listFamilies && listFamilies.length > 0 ? (
                            listFamilies.map((family) => (
                                <tr key={family.cccdChuHo}>
                                    <td className="highlight-text">{family.idCanHo}</td>
                                    <td>
                                        <div className="user-info">
                                            <span>{family.hoTenChuHo}</span>
                                            <small>{family.cccdChuHo}</small>
                                        </div>
                                    </td>
                                    <td className="text-center">{family.soThanhVien}</td>
                                    <td>{family.diaChi}</td>
                                    <td>
                                        <span className={`status-badge ${family.trangThai === 'Tạm vắng' ? 'warning' : 'success'}`}>
                                            {family.trangThai}
                                        </span>
                                    </td>
                                    <td className="action-cell">
                                        {/* Nút Xem chi tiết */}
                                        <button
                                            className="icon-btn view-btn"
                                            title={t('common.view_detail')}
                                            onClick={() => handleViewDetail(family)}
                                        >
                                            👁️
                                        </button>

                                        {/* Nút Đổi chủ hộ */}
                                        <button
                                            className="icon-btn change-btn"
                                            title={t('families_page.actions.change_owner_button')}
                                            onClick={() => handleChangeHouseholder(family.cccdChuHo)}
                                        >
                                            🔄
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="no-data">{t('families_page.no_data')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Chi tiết */}
            <FamilyDetailModal
                show={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                family={selectedFamily}
            />
        </div>
    );
}

export default Families;