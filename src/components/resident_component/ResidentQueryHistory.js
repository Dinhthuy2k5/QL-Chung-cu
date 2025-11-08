import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import '../../styles/resident-styles/ResidentQueryHistory.scss';
import { useTranslation } from "react-i18next"; // 1. Import hook

// 2. Chuyển đổi sang Function Component
function ResidentQueryHistory() {

    // 3. Lấy hàm dịch 't'
    const { t } = useTranslation();

    // 4. Chuyển đổi state sang hooks
    const [cccdToQuery, setCccdToQuery] = useState('');
    const [historyList, setHistoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 5. Chuyển đổi các hàm của class thành const functions
    const handleInputChange = (event) => {
        setCccdToQuery(event.target.value);
    }

    const handleSearch = async () => {
        if (!cccdToQuery) {
            alert(t('resident_history_page.alert_cccd_required'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setHistoryList([]);

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

            console.log("Lấy lịch sử thay đổi thành công");
            setHistoryList(response.data.result || []); // Đảm bảo là mảng
            setIsLoading(false);

        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : t('resident_history_page.error_generic');
            console.error("Có lỗi khi lấy lịch sử thay đổi:", errorMessage);
            setError(`${t('resident_history_page.error_prefix')}: ${errorMessage}`);
            setIsLoading(false);
        }
    }

    // 6. Trả về JSX (không cần hàm render() riêng)
    return (
        <div className="history-container">
            <div className="history-search-bar">
                <input
                    type="text"
                    placeholder={t('resident_history_page.placeholder')}
                    value={cccdToQuery}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? t('resident_history_page.searching_button') : t('resident_history_page.search_button')}
                </button>
            </div>

            <div className="history-results">
                {error && <p className="error-message">{error}</p>}
                <table>
                    <thead>
                        <tr>
                            <th>{t('resident_history_page.header_id')}</th>
                            <th>{t('resident_history_page.header_cccd')}</th>
                            <th>{t('resident_history_page.header_change_info')}</th>
                            <th>{t('resident_history_page.header_change_date')}</th>
                            <th>{t('resident_history_page.header_executor')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5">{t('resident_history_page.loading_data')}</td>
                            </tr>
                        ) : historyList && historyList.length > 0 ? (
                            historyList.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.cccdNhanKhau}</td>
                                    <td>{item.thongTinThayDoi}</td>
                                    <td>{item.ngayThayDoi}</td>
                                    <td>{item.nguoiThucHien}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">{t('resident_history_page.no_data')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ResidentQueryHistory;