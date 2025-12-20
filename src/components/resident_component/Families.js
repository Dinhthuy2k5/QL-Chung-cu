import React, { useState, useEffect } from "react";
import '../../styles/resident-styles/Families.scss';
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import { useTranslation } from "react-i18next";
import FamilyDetailModal from "./FamilyDetailModal";

function Families({ listFamilies, setListFamilies }) {
    const { t } = useTranslation();

    // --- STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12); // Mặc định 12 dòng

    // State cho Modal chi tiết
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState(null);

    // Hàm refresh data (Giữ nguyên)
    const refreshData = async () => {
        const token = getToken();
        if (!token) return;
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        try {
            const apiUrl = `http://localhost:8080/qlcc/ho-gia-dinh`;
            const response = await axios.get(apiUrl, config);
            if (setListFamilies) {
                setListFamilies(response.data.result || []);
            }
        } catch (error) {
            console.log("Lỗi làm mới danh sách hộ:", error);
        }
    };

    useEffect(() => {
        if (!listFamilies || listFamilies.length === 0) {
            refreshData();
        }
    }, []);

    // --- LOGIC PHÂN TRANG ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Cắt danh sách để lấy ra các hộ thuộc trang hiện tại
    const currentFamilies = listFamilies ? listFamilies.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Math.ceil((listFamilies?.length || 0) / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset về trang 1 khi đổi số lượng hiển thị
    };

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN (Giữ nguyên) ---
    const handleViewDetail = (family) => {
        setSelectedFamily(family);
        setShowDetailModal(true);
    };

    const handleChangeHouseholder = async (currentCccdChuHo) => {
        const cccdNhanKhauMoi = window.prompt(t('families_page.prompts.enter_new_owner_cccd'));
        if (!cccdNhanKhauMoi) return;

        const token = getToken();
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            const apiUrl = `http://localhost:8080/qlcc/ho-gia-dinh/change-chu-ho/${currentCccdChuHo}`;
            await axios.post(apiUrl, { cccdNhanKhauMoi }, config);
            alert(t('families_page.alerts.owner_change_success'));
            refreshData();
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
                        {/* HIỂN THỊ currentFamilies THAY VÌ listFamilies */}
                        {currentFamilies && currentFamilies.length > 0 ? (
                            currentFamilies.map((family) => (
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
                                        <button
                                            className="icon-btn view-btn"
                                            title={t('common.view_detail')}
                                            onClick={() => handleViewDetail(family)}
                                        >
                                            👁️
                                        </button>
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

            {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
            {listFamilies && listFamilies.length > 0 && (
                <div className="pagination-wrapper">
                    <div className="rows-per-page">
                        <span>Hiển thị:</span>
                        <select value={itemsPerPage} onChange={handleRowsPerPageChange}>
                            <option value={10}>10</option>
                            <option value={12}>12</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="page-numbers">
                        <button
                            className="page-btn prev"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
                            (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) ? (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`page-btn ${currentPage === number ? 'active' : ''}`}
                                >
                                    {number}
                                </button>
                            ) : (
                                (number === currentPage - 2 || number === currentPage + 2) ? <span key={number} className="dots">...</span> : null
                            )
                        ))}

                        <button
                            className="page-btn next"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                    <div className="page-info">
                        Trang {currentPage} / {totalPages}
                    </div>
                </div>
            )}

            <FamilyDetailModal
                show={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                family={selectedFamily}
            />
        </div>
    );
}

export default Families;