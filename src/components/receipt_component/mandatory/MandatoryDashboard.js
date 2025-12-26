import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getToken } from '../../../services/localStorageService';
import '../../../styles/receipt-styles/MandatoryDashboard.scss';

const MandatoryDashboard = ({
    onOpenCreate,
    onOpenCalculate,
    onOpenCollect,
    onOpenList,
    currentPeriodId // <--- THÊM PROP NÀY: ID đợt thu muốn xem (VD: "12-2025")
}) => {
    const [feeData, setFeeData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- LOGIC XÁC ĐỊNH ID ĐỢT THU ---
    // Ưu tiên dùng ID truyền từ ngoài vào. Nếu không có thì lấy tháng hiện tại.
    const idThoiGianThu = useMemo(() => {
        if (currentPeriodId) return currentPeriodId;

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        return `${currentMonth}${currentYear}`; // Format mặc định: 12-2025
    }, [currentPeriodId]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = getToken();
            if (!token) return;

            setLoading(true);

            // --- LOG ĐỂ DEBUG ---
            console.log("Dashboard đang gọi API với ID:", idThoiGianThu);

            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const apiUrl = `http://localhost:8080/qlcc/phi/phi-bat-buoc/${idThoiGianThu}`;

                const response = await axios.get(apiUrl, config);

                // --- LOG KẾT QUẢ TRẢ VỀ ---
                console.log("Kết quả API Dashboard:", response.data);

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

    // --- TÍNH TOÁN SỐ LIỆU ---
    const stats = useMemo(() => {
        // Nếu API trả về null hoặc không có danh sách -> Trả về 0
        if (!feeData || !feeData.danhSachTongThanhToan) return { mustCollect: 0, collected: 0, rate: 0, paidCount: 0 };

        // 1. TỔNG PHẢI THU: Lấy từ 'tongPhiAll' của API
        const mustCollect = feeData.tongPhiAll || 0;

        // 2. THỰC THU: Tổng 'soTienDaNop'
        const collected = feeData.danhSachTongThanhToan.reduce((sum, item) => sum + (item.soTienDaNop || 0), 0);

        // 3. TỶ LỆ HOÀN THÀNH (THEO TIỀN)
        const rate = mustCollect > 0 ? ((collected / mustCollect) * 100).toFixed(1) : 0;

        // 4. SỐ CĂN HỘ ĐÃ NỘP (Đếm thủ công theo trạng thái)
        const paidCount = feeData.danhSachTongThanhToan.filter(item => item.trangThai === 'DA_THANH_TOAN').length;

        return { mustCollect, collected, rate, paidCount };
    }, [feeData]);

    // Điều kiện hiển thị dữ liệu: Phải có object feeData
    // Lưu ý: Dù tongPhiAll = 0 (vừa tạo xong chưa tính phí) thì vẫn coi là "có dữ liệu" để hiện số 0
    const hasData = feeData !== null;

    const formatCurrency = (val) => val ? val.toLocaleString('vi-VN') + ' đ' : '0 đ';

    return (
        <div className="mandatory-dashboard">

            {/* THANH THAO TÁC NGHIỆP VỤ */}
            <div className="quick-actions-panel">
                <h3>Thao tác nghiệp vụ (Kỳ thu: {idThoiGianThu})</h3>
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
                        <div className="value">{formatCurrency(stats.mustCollect)}</div>
                    ) : (
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
                <div className="kpi-card purple">
                    <h4>Tỷ lệ hoàn thành</h4>
                    {loading ? (
                        <div className="value" style={{ fontSize: '1.2rem', opacity: 0.7 }}>...</div>
                    ) : hasData ? (
                        <>
                            <div className="value">{stats.rate}%</div>
                            <div className="sub-text">
                                {/* Dùng stats.paidCount thay vì feeData.successCount */}
                                Tiến độ: {stats.paidCount}/{feeData.totalCanHo} căn
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