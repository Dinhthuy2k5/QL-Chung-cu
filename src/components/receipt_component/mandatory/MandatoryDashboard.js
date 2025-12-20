import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
} from 'chart.js';
import '../../../styles/receipt-styles/MandatoryDashboard.scss';

// Đăng ký các thành phần biểu đồ
ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale,
    PointElement, LineElement, Title
);

const MandatoryDashboard = ({
    onOpenCreate,
    onOpenCalculate,
    onOpenCollect,
    onOpenList,
    dashboardData = null
}) => {

    // --- MÔ PHỎNG DỮ LIỆU TỪ API ---
    const data = dashboardData || {
        // 1. Dữ liệu tháng hiện tại
        currentMonth: null,
        /* Ví dụ khi ĐÃ TẠO:
        currentMonth: {
            month: '12/2025',
            mustCollect: 150000000,
            collected: 120000000,
            completionRate: 80
        },
        */

        // 2. Dữ liệu Công nợ
        debt: {
            totalDebt: 30000000,
            topDebtors: [
                { room: 'A101', amount: 2500000, listMonths: ['10/2025', '11/2025'] },
                { room: 'B205', amount: 1200000, listMonths: ['11/2025'] },
                { room: 'C303', amount: 5000000, listMonths: ['09/2025', '10/2025'] },
            ]
        },

        // 3. Dữ liệu biểu đồ 3 năm (QUAN TRỌNG: Cấu trúc mới)
        revenueChart: {
            currentYear: 2025,
            dataCurrent: [140, 145, 150, 160, 155, 170, 175, 180, 190, 185, null, null], // Năm nay
            dataLast1: [100, 105, 110, 108, 125, 130, 140, 135, 145, 150, 155, 160],   // Năm ngoái
            dataLast2: [80, 85, 82, 90, 95, 100, 105, 100, 98, 110, 115, 120]         // Năm kia
        }
    };

    const hasCurrentData = !!data.currentMonth;
    const formatCurrency = (val) => val ? val.toLocaleString('vi-VN') + ' đ' : '0 đ';

    // --- CẤU HÌNH BIỂU ĐỒ TRÒN ---
    const paymentStatusData = {
        labels: hasCurrentData ? ['Đã thu', 'Còn lại'] : ['Chưa tạo đợt thu'],
        datasets: [{
            data: hasCurrentData
                ? [data.currentMonth.collected, data.currentMonth.mustCollect - data.currentMonth.collected]
                : [1],
            backgroundColor: hasCurrentData
                ? ['#28a745', '#dc3545']
                : ['#343a40'],
            borderWidth: 0,
        }]
    };

    // --- CẤU HÌNH BIỂU ĐỒ ĐƯỜNG (3 NĂM) ---
    // Lấy năm hiện tại để tính label cho các năm trước
    const curYear = data.revenueChart.currentYear;

    const revenueData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
            {
                label: `Năm ${curYear - 2}`, // Năm kia
                data: data.revenueChart.dataLast2,
                borderColor: '#6c757d', // Màu xám nhạt
                backgroundColor: 'rgba(108, 117, 125, 0.5)',
                tension: 0.4,
                borderDash: [5, 5], // Nét đứt
                pointRadius: 0, // Ẩn điểm cho đỡ rối
            },
            {
                label: `Năm ${curYear - 1}`, // Năm ngoái
                data: data.revenueChart.dataLast1,
                borderColor: '#17a2b8', // Màu xanh lơ
                backgroundColor: 'rgba(23, 162, 184, 0.5)',
                tension: 0.4,
                pointRadius: 3,
            },
            {
                label: `Năm ${curYear}`, // Năm nay (Nổi bật nhất)
                data: data.revenueChart.dataCurrent,
                borderColor: '#007bff', // Màu xanh chủ đạo
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                pointBackgroundColor: '#fff',
                pointBorderColor: '#007bff',
                pointRadius: 4.5, // Điểm to
                pointHoverRadius: 8,
                borderWidth: 3, // Đường đậm
                tension: 0.4,
            },
        ]
    };

    const lineOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#adb5bd', usePointStyle: true }
            },
            tooltip: {
                mode: 'index',
                intersect: false, // Hiển thị tooltip so sánh cả 3 năm tại 1 điểm cắt dọc
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                ticks: { color: '#adb5bd' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                beginAtZero: true
            },
            x: {
                ticks: { color: '#adb5bd' },
                grid: { display: false }
            }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false }
    };

    return (
        <div className="mandatory-dashboard">

            {/* 1. THANH THAO TÁC NHANH */}
            <div className="quick-actions-panel">
                <h3>Thao tác nghiệp vụ</h3>
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

            {/* 2. KPI CARDS */}
            <div className="kpi-grid">
                <div className="kpi-card blue">
                    <h4>Tổng Phải Thu (Tháng này)</h4>
                    {hasCurrentData ? (
                        <div className="value">{formatCurrency(data.currentMonth.mustCollect)}</div>
                    ) : (
                        <div className="value" style={{ color: '#6c757d', fontSize: '1.2rem', fontStyle: 'italic' }}>
                            Chưa tạo đợt thu
                        </div>
                    )}
                </div>

                <div className="kpi-card green">
                    <h4>Thực Thu (Tháng này)</h4>
                    {hasCurrentData ? (
                        <>
                            <div className="value">{formatCurrency(data.currentMonth.collected)}</div>
                            <div className="sub-text">Đạt {data.currentMonth.completionRate}% kế hoạch</div>
                        </>
                    ) : (
                        <div className="value" style={{ color: '#6c757d', fontSize: '1.2rem', fontStyle: 'italic' }}>
                            ---
                        </div>
                    )}
                </div>

                <div className="kpi-card red">
                    <h4>Tổng Nợ (Tích lũy)</h4>
                    <div className="value">{formatCurrency(data.debt.totalDebt)}</div>
                    <div className="sub-text">Cộng dồn từ các tháng trước</div>
                </div>
            </div>

            {/* 3. BIỂU ĐỒ & DANH SÁCH NỢ */}
            <div className="charts-grid">
                {/* Biểu đồ Đường: Xu hướng 3 năm */}
                <div className="chart-panel main-chart">
                    <h4>Xu hướng thu phí (3 năm gần nhất)</h4>
                    <div className="chart-wrapper">
                        <Line data={revenueData} options={lineOptions} />
                    </div>
                </div>

                {/* Biểu đồ Tròn */}
                <div className="chart-panel pie-chart">
                    <h4>Tỷ lệ hoàn thành (Tháng này)</h4>
                    <div className="chart-wrapper">
                        {hasCurrentData ? (
                            <Doughnut data={paymentStatusData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#adb5bd' } } } }} />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', opacity: 0.7 }}>
                                <span style={{ fontSize: '2rem' }}>📊</span>
                                <p style={{ margin: '8px 0 0' }}>Chưa có dữ liệu tháng này</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Danh sách nợ */}
                <div className="debt-list-panel">
                    <h4>⚠️ Cần nhắc nợ</h4>
                    {data.debt.topDebtors && data.debt.topDebtors.length > 0 ? (
                        <ul>
                            {data.debt.topDebtors.map((d, index) => (
                                <li key={index}>
                                    <div className="room-info">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span className="room" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>P.{d.room}</span>
                                            <span className="amount" style={{ color: '#fd5d93', fontWeight: 'bold' }}>{formatCurrency(d.amount)}</span>
                                        </div>
                                        <div className="month-badge" style={{
                                            marginTop: '5px',
                                            fontSize: '0.8rem',
                                            color: '#adb5bd',
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '4px 8px',
                                            borderRadius: '4px'
                                        }}>
                                            Nợ tháng: {d.listMonths.join(', ')}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#00f2c3', marginTop: '20px' }}>
                            🎉 Không có căn hộ nợ xấu
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MandatoryDashboard;