import React, { useState, useCallback } from "react";
import { getToken } from "../../services/localStorageService";
import axios from "axios";
import '../../styles/receipt-styles/ApartmentPaymentHistory.scss';
// 1. Import hook
import { useTranslation } from "react-i18next";

// 2. Chuyển sang Function Component
function ApartmentPaymentHistory() {

    // 3. Lấy hàm 't'
    const { t } = useTranslation();

    // 4. Chuyển đổi state
    const [idCanHo, setIdCanHo] = useState('');
    const [historyData, setHistoryData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 5. Chuyển đổi các hàm
    const handleInputChange = (e) => {
        setIdCanHo(e.target.value);
    }

    const handleSearch = async () => {
        if (!idCanHo) {
            alert(t('apt_history_page.alert_id_required'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setHistoryData(null);

        const token = getToken();
        if (!token) {
            setIsLoading(false);
            setError(t('alerts.session_expired'));
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/thong-ke-thu-phi/can-ho/${idCanHo}`;

        try {
            const response = await axios.get(apiUrl, config);
            console.log("Lấy lịch sử thanh toán thành công:", response.data);
            setHistoryData(response.data.result);
            setIsLoading(false);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : t('apt_history_page.error_generic');
            setError(`${t('apt_history_page.error_prefix')}: ${errorMessage}`);
            setIsLoading(false);
        }
    }

    // Dùng useCallback để hàm không bị tạo lại mỗi lần render, trừ khi 't' thay đổi
    const formatCurrency = useCallback((number) => {
        return (number || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }, []);

    // 6. Trả về JSX (đã dịch)
    return (
        <div className="history-container">
            <div className="history-search-controls">
                <input
                    type="number"
                    placeholder={t('apt_history_page.placeholder')}
                    value={idCanHo}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? t('apt_history_page.searching_button') : t('apt_history_page.search_button')}
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {historyData && (
                <div className="history-results">
                    {/* --- Phần Tóm tắt --- */}
                    <div className="history-summary">
                        <div className="summary-item"><span>{t('apt_history_page.summary_must_pay')}</span><strong>{formatCurrency(historyData.tongPhiBatBuocPhaiNop)}</strong></div>
                        <div className="summary-item success"><span>{t('apt_history_page.summary_paid')}</span><strong>{formatCurrency(historyData.tongPhiBatBuocDaNop)}</strong></div>
                        <div className="summary-item fail"><span>{t('apt_history_page.summary_debt')}</span><strong>{formatCurrency(historyData.tongPhiBatBuocConThieu)}</strong></div>
                        <div className="summary-item voluntary"><span>{t('apt_history_page.summary_voluntary')}</span><strong>{formatCurrency(historyData.tongDongGopTuNguyen)}</strong></div>
                    </div>

                    {/* --- Bảng Phí Bắt buộc --- */}
                    <h4>{t('apt_history_page.mandatory_title')}</h4>
                    <div className="history-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('apt_history_page.table_mandatory.period')}</th>
                                    <th>{t('apt_history_page.table_mandatory.total_fee')}</th>
                                    <th>{t('apt_history_page.table_mandatory.paid_amount')}</th>
                                    <th>{t('apt_history_page.table_mandatory.debt')}</th>
                                    <th>{t('apt_history_page.table_mandatory.status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.danhSachPhiBatBuoc.map(item => (
                                    <tr key={item.idThoiGianThu}>
                                        <td>{item.idThoiGianThu}</td>
                                        <td>{formatCurrency(item.tongPhi)}</td>
                                        <td>{formatCurrency(item.soTienDaNop)}</td>
                                        <td>{formatCurrency(item.soDu)}</td>
                                        <td><span className={`status ${item.trangThai.toLowerCase()}`}>
                                            {item.trangThai === 'DA_THANH_TOAN' ? t('apt_history_page.status_paid') : t('apt_history_page.status_unpaid')}
                                        </span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Bảng Đóng góp Tự nguyện --- */}
                    <h4>{t('apt_history_page.voluntary_title')}</h4>
                    <div className="history-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('apt_history_page.table_voluntary.name')}</th>
                                    <th>{t('apt_history_page.table_voluntary.date')}</th>
                                    <th>{t('apt_history_page.table_voluntary.amount')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.danhSachDongGop.map(item => (
                                    <tr key={item.idKhoanDongGop}>
                                        <td>{item.tenKhoanDongGop}</td>
                                        <td>{item.ngayDongGop}</td>
                                        <td>{formatCurrency(item.soTienDongGop)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ApartmentPaymentHistory;