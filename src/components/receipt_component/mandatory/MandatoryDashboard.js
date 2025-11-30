import React from 'react';
// 1. Thay đổi import: Dùng Line thay vì Bar
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement, // Cần thiết cho biểu đồ đường
    LineElement,  // Cần thiết cho biểu đồ đường
    Title
} from 'chart.js';
import '../../../styles/receipt-styles/MandatoryDashboard.scss';

// Đăng ký các thành phần biểu đồ
ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale,
    PointElement, LineElement, Title // Đăng ký thêm Point và Line
);

const MandatoryDashboard = ({ onOpenCreate, onOpenCalculate, onOpenCollect, onOpenList }) => {

    // --- DỮ LIỆU GIẢ LẬP KPI ---
    const kpiData = {
        mustCollect: 150000000,
        collected: 120000000,
        debt: 30000000,
        completionRate: 80
    };

    // --- DỮ LIỆU BIỂU ĐỒ TRÒN (Tỷ lệ đóng) ---
    const paymentStatusData = {
        labels: ['Đã hoàn thành', 'Chưa đóng', 'Còn nợ'],
        datasets: [{
            data: [120, 25, 5],
            backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
            borderWidth: 0,
        }]
    };

    // --- DỮ LIỆU BIỂU ĐỒ ĐƯỜNG (SO SÁNH 3 NĂM) ---
    // Giả lập dữ liệu doanh thu của 3 năm gần nhất để so sánh
    const revenueData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
            {
                label: 'Năm 2023',
                data: [80, 85, 82, 90, 95, 100, 105, 100, 98, 110, 115, 120], // Dữ liệu năm cũ
                borderColor: '#6c757d', // Màu xám (quá khứ)
                backgroundColor: 'rgba(108, 117, 125, 0.5)',
                tension: 0.4, // Độ cong của đường (0: thẳng, 1: rất cong)
                borderDash: [5, 5], // Nét đứt để phân biệt năm cũ
            },
            {
                label: 'Năm 2024',
                data: [100, 105, 110, 108, 125, 130, 140, 135, 145, 150, 155, 160], // Năm ngoái
                borderColor: '#17a2b8', // Màu xanh lơ
                backgroundColor: 'rgba(23, 162, 184, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Năm 2025', // Năm hiện tại (Nổi bật nhất)
                data: [140, 145, 150, 160, 155, 170, 175, 180, 190, 185, null, null], // Chưa có dữ liệu T11, T12
                borderColor: '#007bff', // Màu xanh dương chủ đạo
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                pointBackgroundColor: '#fff', // Điểm trắng
                pointBorderColor: '#007bff',
                pointRadius: 5, // Điểm to hơn để dễ nhìn
                borderWidth: 3, // Đường đậm hơn
                tension: 0.4,
            },
        ]
    };

    // Tùy chọn hiển thị cho biểu đồ đường
    const lineOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#adb5bd', usePointStyle: true } // Màu chữ chú thích
            },
            tooltip: {
                mode: 'index', // Hiển thị tooltip của cả 3 năm cùng lúc khi di chuột vào 1 tháng
                intersect: false,
            }
        },
        scales: {
            y: {
                ticks: { color: '#adb5bd' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }, // Lưới mờ
                beginAtZero: true
            },
            x: {
                ticks: { color: '#adb5bd' },
                grid: { display: false } // Ẩn lưới dọc cho thoáng
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    const topDebtors = [
        { room: 'A101', amount: 2500000, months: 2 },
        { room: 'B205', amount: 1200000, months: 1 },
        { room: 'C303', amount: 5000000, months: 4 },
    ];

    const formatCurrency = (val) => val.toLocaleString('vi-VN') + ' đ';

    return (
        <div className="mandatory-dashboard">

            {/* 1. THANH THAO TÁC NHANH */}
            <div className="quick-actions-panel">
                <h3>Thao tác nghiệp vụ</h3>
                <div className="action-buttons">
                    <button className="btn-action create" onClick={onOpenCreate}>
                        <span className="icon">✚</span> Tạo khoản thu
                    </button>
                    {/* <button className="btn-action calc" onClick={onOpenCalculate}>
                        <span className="icon">🧮</span> Tính toán
                    </button> */}
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
                    <div className="value">{formatCurrency(kpiData.mustCollect)}</div>
                </div>
                <div className="kpi-card green">
                    <h4>Thực Thu</h4>
                    <div className="value">{formatCurrency(kpiData.collected)}</div>
                    <div className="sub-text">Đạt {kpiData.completionRate}% kế hoạch</div>
                </div>
                <div className="kpi-card red">
                    <h4>Tổng Nợ (Công nợ)</h4>
                    <div className="value">{formatCurrency(kpiData.debt)}</div>
                </div>
            </div>

            {/* 3. BIỂU ĐỒ & DANH SÁCH NỢ */}
            <div className="charts-grid">
                {/* Biểu đồ Đường: So sánh 3 năm */}
                <div className="chart-panel main-chart">
                    <h4>Xu hướng thu phí (3 năm gần nhất)</h4>
                    <div className="chart-wrapper">
                        {/* Thay Bar bằng Line */}
                        <Line data={revenueData} options={lineOptions} />
                    </div>
                </div>

                {/* Biểu đồ Tròn: Tỷ lệ đóng */}
                <div className="chart-panel pie-chart">
                    <h4>Tỷ lệ hoàn thành (Tháng này)</h4>
                    <div className="chart-wrapper">
                        <Doughnut data={paymentStatusData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#adb5bd' } } } }} />
                    </div>
                </div>

                {/* Danh sách nợ cần chú ý */}
                <div className="debt-list-panel">
                    <h4>⚠️ Cần nhắc nợ</h4>
                    <ul>
                        {topDebtors.map((d, index) => (
                            <li key={index}>
                                <div className="room-info">
                                    <span className="room">P.{d.room}</span>
                                    <span className="month-badge">Nợ {d.months} tháng</span>
                                </div>
                                <div className="amount">{formatCurrency(d.amount)}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MandatoryDashboard;