import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import '../../styles/resident-styles/ResidentQueryHistory.scss';
import { useTranslation } from "react-i18next";

function ResidentQueryHistory() {
    const { t } = useTranslation();

    const [cccdToQuery, setCccdToQuery] = useState('');
    const [historyList, setHistoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false); // Thêm state để biết đã tìm kiếm chưa

    const handleInputChange = (event) => {
        setCccdToQuery(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = async () => {
        if (!cccdToQuery) {
            alert(t('resident_history_page.alert_cccd_required') || "Vui lòng nhập CCCD!");
            return;
        }
        setIsLoading(true);
        setError(null);
        setHistoryList([]);
        setHasSearched(true);

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            setIsLoading(false);
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            const apiUrl = `http://localhost:8080/qlcc/nhan-khau/history/${cccdToQuery}`;
            const response = await axios.get(apiUrl, config);
            setHistoryList(response.data.result || []);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : t('resident_history_page.error_generic');
            console.error("Lỗi:", errorMessage);
            // setError(errorMessage); // Có thể hiện lỗi hoặc chỉ hiện bảng rỗng tùy logic
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="list-resident-container">

            {/* Toolbar Tìm kiếm */}
            <div className="list-resident-toolbar">
                <div className="search-group query-search-group">
                    <div className="input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="glass-input"
                            placeholder={t('resident_history_page.placeholder') || "Nhập số CCCD cần tra cứu..."}
                            value={cccdToQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <button className="btn-primary search-btn" onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? "Đang tìm..." : (t('resident_history_page.search_button') || "Tìm kiếm")}
                    </button>
                </div>
            </div>

            {/* Bảng Kết quả */}
            <div className="glass-table">
                {error && <div className="error-banner">{error}</div>}

                <table>
                    <thead>
                        <tr>
                            <th>{t('resident_history_page.header_id') || "ID"}</th>
                            <th>{t('resident_history_page.header_cccd') || "CCCD"}</th>
                            <th>{t('resident_history_page.header_change_info') || "Thông tin thay đổi"}</th>
                            <th>{t('resident_history_page.header_change_date') || "Ngày thay đổi"}</th>
                            <th>{t('resident_history_page.header_executor') || "Người thực hiện"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="loading-cell">
                                    <div className="loading-spinner"></div>
                                    <p>Đang tải dữ liệu...</p>
                                </td>
                            </tr>
                        ) : historyList && historyList.length > 0 ? (
                            historyList.map((item) => (
                                <tr key={item.id}>
                                    <td className="highlight-text">{item.id}</td>
                                    <td>{item.cccdNhanKhau}</td>
                                    <td style={{ whiteSpace: 'pre-line' }}>{item.thongTinThayDoi}</td>
                                    <td>{item.ngayThayDoi}</td>
                                    <td>
                                        <span className="executor-badge">{item.nguoiThucHien}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* QUAN TRỌNG: Thêm class no-data để CSS căn giữa */}
                                <td colSpan="5" className="no-data">
                                    {hasSearched
                                        ? (t('resident_history_page.no_data') || "Không tìm thấy lịch sử thay đổi nào.")
                                        : "Vui lòng nhập CCCD và bấm Tìm kiếm."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ResidentQueryHistory;