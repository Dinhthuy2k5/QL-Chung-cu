import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getToken } from '../../../services/localStorageService';
import '../../../styles/receipt-styles/MandatoryDashboard.scss';

const MandatoryDashboard = ({
    onOpenCreate,
    onOpenCalculate,
    onOpenCollect,
    onOpenList
}) => {
    const [feeData, setFeeData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- 1. LOGIC ID THỜI GIAN THU ---
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const idThoiGianThu = `${currentMonth}-${currentYear}`;

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = getToken();
            if (!token) return;

            setLoading(true);

            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const apiUrl = `http://localhost:8080/qlcc/phi/phi-bat-buoc/${idThoiGianThu}`;

                const response = await axios.get(apiUrl, config);

                if (response.data && response.data.result) {
                    setFeeData(response.data.result);
                } else {
                    setFeeData(null);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu khoản thu:", error);
                setFeeData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [idThoiGianThu]);

    // --- 2. TÍNH TOÁN SỐ LIỆU ---
    const stats = useMemo(() => {
        if (!feeData) return { mustCollect: 0, collected: 0, rate: 0 };

        const mustCollect = feeData.tongPhiAll || 0;

        const collected = feeData.danhSachTongThanhToan
            ? feeData.danhSachTongThanhToan.reduce((sum, item) => sum + (item.soTienDaNop || 0), 0)
            : 0;

        const rate = mustCollect > 0 ? ((collected / mustCollect) * 100).toFixed(1) : 0;

        return { mustCollect, collected, rate };
    }, [feeData]);

    // --- 3. BIẾN KIỂM TRA DỮ LIỆU CÓ Ý NGHĨA KHÔNG ---
    // Chỉ coi là "Có dữ liệu" khi feeData không null VÀ Tổng phải thu > 0
    const hasData = feeData && feeData.tongPhiAll > 0;

    const formatCurrency = (val) => val ? val.toLocaleString('vi-VN') + ' đ' : '0 đ';

    return (
        <div className="mandatory-dashboard">

            {/* THANH THAO TÁC NGHIỆP VỤ */}
            <div className="quick-actions-panel">
                <h3>Thao tác nghiệp vụ (T{currentMonth}/{currentYear})</h3>
                <div className="action-buttons">
                    <button className="btn-action create" onClick={onOpenCreate}>
                        <span className="icon">✚</span> Tạo khoản thu
                    </button>
                    <button className="btn-action collect" onClick={onOpenCollect}>
                        <span className="icon">💰</span> Thu phí
                    </button>
                    <button className="btn-action list" onClick={onOpenList}>
                        <span className="icon">📄</span> Xem danh sách
                    </button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="kpi-grid">
                {/* CARD 1: TỔNG PHẢI THU */}
                <div className="kpi-card blue">
                    <h4>Tổng Phải Thu (Tháng này)</h4>
                    {loading ? (
                        <div className="value" style={{ fontSize: '1.2rem', opacity: 0.7 }}>Đang tải...</div>
                    ) : hasData ? (
                        // Có dữ liệu > 0 thì hiện tiền
                        <div className="value">{formatCurrency(stats.mustCollect)}</div>
                    ) : (
                        // Không có dữ liệu hoặc = 0 thì hiện chữ báo
                        <div className="value" style={{ fontSize: '1.2rem', opacity: 0.7, fontStyle: 'italic' }}>
                            Chưa tạo đợt thu
                        </div>
                    )}
                </div>

                {/* CARD 2: THỰC THU */}
                <div className="kpi-card green">
                    <h4>Thực Thu (Tháng này)</h4>
                    {loading ? (
                        <div className="value" style={{ fontSize: '1.2rem', opacity: 0.7 }}>...</div>
                    ) : hasData ? (
                        <>
                            <div className="value">{formatCurrency(stats.collected)}</div>
                            <div className="sub-text">Đã thu từ {feeData.successCount || 0} căn hộ</div>
                        </>
                    ) : (
                        <div className="value" style={{ fontSize: '1.2rem', opacity: 0.7 }}>---</div>
                    )}
                </div>

                {/* CARD 3: TỶ LỆ HOÀN THÀNH */}
                <div className="kpi-card green">
                    <h4>Tỷ lệ hoàn thành</h4>
                    {loading ? (
                        <div className="value" style={{ fontSize: '1.2rem', opacity: 0.7 }}>...</div>
                    ) : hasData ? (
                        <>
                            <div className="value">{stats.rate}%</div>
                            <div className="sub-text">
                                Tiến độ: {feeData.successCount}/{feeData.totalCanHo} căn
                            </div>
                        </>
                    ) : (
                        <div className="value" style={{ fontSize: '1.2rem', opacity: 0.7 }}>---</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default MandatoryDashboard;