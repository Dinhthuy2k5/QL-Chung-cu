import React from "react";
import '../styles/receipt-styles/Receipt.scss';
import MandatoryFeeTab from "../components/receipt_component/mandatory/MandatoryFeeTab";
import VoluntaryContribution from "../components/receipt_component/VoluntaryContribution";
import ApartmentPaymentHistory from "../components/receipt_component/ApartmentPaymentHistory";
import { useTranslation } from "react-i18next";
// 1. Import các thành phần routing cần thiết
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

function Receipt() {
    const { t } = useTranslation();
    const navigate = useNavigate(); // Dùng để chuyển trang
    const location = useLocation(); // Dùng để lấy đường dẫn hiện tại

    // 2. Hàm kiểm tra xem tab nào đang active để tô màu nút
    const checkActive = (path) => {
        const currentPath = location.pathname;

        // Tab Mandatory (Mặc định) sẽ active khi đường dẫn là /receipts hoặc /receipts/ hoặc /receipts/mandatory
        if (path === 'mandatory') {
            return currentPath === '/receipts' ||
                currentPath === '/receipts/' ||
                currentPath === '/receipts/mandatory';
        }

        // Các tab khác (voluntary, history) active khi đường dẫn chứa tên của nó
        return currentPath.includes(`/receipts/${path}`);
    };

    return (
        <div className="receipt-container">
            {/* GIAO DIỆN TAB */}
            <div className="receipt-tabs">
                <button
                    className={`tab-button ${checkActive('mandatory') ? 'active' : ''}`}
                    onClick={() => navigate('/receipts')} // Bấm vào thì về trang gốc (Mặc định là Mandatory)
                >
                    {t('receipt_page.tab_mandatory')}
                </button>
                <button
                    className={`tab-button ${checkActive('voluntary') ? 'active' : ''}`}
                    onClick={() => navigate('/receipts/voluntary')} // Chuyển sang /voluntary
                >
                    {t('receipt_page.tab_voluntary')}
                </button>
                <button
                    className={`tab-button ${checkActive('history') ? 'active' : ''}`}
                    onClick={() => navigate('/receipts/history')} // Chuyển sang /history
                >
                    {t('receipt_page.tab_history')}
                </button>
            </div>

            {/* NỘI DUNG CỦA TAB (CẤU HÌNH ROUTING CON) */}
            <div className="tab-content">
                <Routes>
                    {/* Route mặc định khi vào /receipts */}
                    <Route path="/" element={<MandatoryFeeTab />} />

                    {/* Route dự phòng nếu người dùng gõ /receipts/mandatory */}
                    <Route path="mandatory" element={<MandatoryFeeTab />} />

                    {/* Route cho /receipts/voluntary */}
                    <Route path="voluntary" element={<VoluntaryContribution />} />

                    {/* Route cho /receipts/history */}
                    <Route path="history" element={<ApartmentPaymentHistory />} />
                </Routes>
            </div>
        </div>
    );
}

export default Receipt;