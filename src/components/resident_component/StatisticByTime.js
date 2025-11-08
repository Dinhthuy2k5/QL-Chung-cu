import React, { useState } from "react";
import { getToken } from "../../services/localStorageService";
import axios from "axios";
import '../../styles/resident-styles/StatisticByTime.scss';
// 1. Import hook useTranslation
import { useTranslation } from "react-i18next";

// 2. Chuyển đổi sang Function Component
function StatisticByTime() {

    // 3. Lấy hàm dịch 't'
    const { t } = useTranslation();

    // 4. Chuyển đổi state sang hooks
    const [ngayBatDau, setNgayBatDau] = useState('');
    const [ngayKetThuc, setNgayKetThuc] = useState('');
    const [soLuongNhanKhauMoi, setSoLuongNhanKhauMoi] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Xử lý khi người dùng thay đổi ngày
    const handleDateChange = (event) => {
        if (event.target.name === 'ngayBatDau') {
            setNgayBatDau(event.target.value);
        } else {
            setNgayKetThuc(event.target.value);
        }
    }

    // 5. Chuyển đổi hàm class thành const function
    const handleStatistic = async () => {
        if (!ngayBatDau || !ngayKetThuc) {
            alert(t('stats_time_chart.alert_date_required')); // Dịch alert
            return;
        }

        setIsLoading(true);
        setError(null);
        setSoLuongNhanKhauMoi(null);

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired')); // Dịch alert
            setIsLoading(false);
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const data = {
            ngayBatDau: ngayBatDau,
            ngayKetThuc: ngayKetThuc
        };

        try {
            const apiUrl = `http://localhost:8080/qlcc/thong-ke/khoang-thoi-gian`;
            const response = await axios.post(apiUrl, data, config);

            console.log("Thống kê theo thời gian thành công");
            setSoLuongNhanKhauMoi(response.data.result.soLuongNhanKhauMoi);
            setIsLoading(false);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : t('stats_time_chart.error_generic');
            console.error("Có lỗi khi thống kê:", errorMessage);
            setError(`${t('stats_time_chart.error_prefix')}: ${errorMessage}`);
            setIsLoading(false);
        }
    }

    // 6. Trả về JSX (không cần hàm render())
    return (
        <div className="time-statistic-container">
            <h3 className="title">{t('stats_time_chart.title')}</h3>
            <div className="time-statistic-controls">
                <div className="date-picker-group">
                    <label htmlFor="ngayBatDau">{t('stats_time_chart.label_from_date')}</label>
                    <input
                        type="date"
                        id="ngayBatDau"
                        name="ngayBatDau"
                        value={ngayBatDau}
                        onChange={handleDateChange}
                    />
                </div>
                <div className="date-picker-group">
                    <label htmlFor="ngayKetThuc">{t('stats_time_chart.label_to_date')}</label>
                    <input
                        type="date"
                        id="ngayKetThuc"
                        name="ngayKetThuc"
                        value={ngayKetThuc}
                        onChange={handleDateChange}
                    />
                </div>
                <button onClick={handleStatistic} disabled={isLoading}>
                    {isLoading ? t('stats_time_chart.button_loading') : t('stats_time_chart.button_stats')}
                </button>
            </div>

            <div className="time-statistic-results">
                {error && <p className="error-message">{error}</p>}

                {soLuongNhanKhauMoi !== null && (
                    <div className="result-box">
                        <span className="result-label">{t('stats_time_chart.result_label')}</span>
                        <span className="result-count">{soLuongNhanKhauMoi}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatisticByTime;