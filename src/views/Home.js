import React from "react";
import '../styles/home-styles/Home.scss';
import { useNavigate } from "react-router-dom";
import { withRouter } from "../HOC/withRouter";
// Chuyển sang dùng Line Chart cho đẹp hơn
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Để tạo hiệu ứng màu nền dưới đường biểu đồ
} from 'chart.js';
import axios from "axios";
import { getToken } from "../services/localStorageService";
import { withTranslation } from 'react-i18next';

// Đăng ký các thành phần cho Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Component StatCard được thiết kế lại nhỏ gọn
function StatCard({ icon, title, count, linkTo, color, navigate, t }) {
    return (
        <div className="stat-card-mini" onClick={() => navigate(linkTo)}>
            <div className={`card-icon-wrapper ${color}`}>
                <span className="material-icons">{icon}</span>
            </div>
            <div className="card-content">
                <p className="card-title">{title}</p>
                <h3 className="card-count">{count}</h3>
            </div>
            <div className="card-arrow">➔</div>
        </div>
    );
}

class Home extends React.Component {

    state = {
        activeActivityTab: 'resident',
        chartData: null,
        residentActivities: [],
        feeActivities: [],
    };



    // --- CẬP NHẬT MỚI: GỌI API ĐỂ LẤY ROLE ---
    setDefaultTabByRole = async () => {
        const token = getToken();
        if (!token) return;

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        // API lấy thông tin người dùng hiện tại
        const apiUrl = 'http://localhost:8080/qlcc/users/myInfo';

        try {
            const response = await axios.get(apiUrl, config);

            // Dữ liệu trả về theo cấu trúc trong ảnh bạn gửi: result -> role
            const userInfo = response.data.result;

            console.log("Current User Info:", userInfo); // Debug xem log

            // Lấy role và chuyển về chữ hoa để so sánh chuẩn xác
            const role = userInfo.role ? userInfo.role.toUpperCase() : "";
            const username = userInfo.username ? userInfo.username.toLowerCase() : "";

            // Logic: Nếu là Kế toán (Role là KETOAN hoặc username chứa ketoan) -> Tab Thu phí
            if (role.includes("KETOAN") || username.includes("ketoan")) {
                this.setState({ activeActivityTab: 'fee' });
            } else {
                // Trường hợp còn lại (QUANLY, ADMIN...) -> Tab Cư dân
                this.setState({ activeActivityTab: 'resident' });
            }

        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            // Nếu lỗi API, giữ mặc định là 'resident'
            this.setState({ activeActivityTab: 'resident' });
        }
    }

    // --- 1. API LẤY DỮ LIỆU BIỂU ĐỒ (6 tháng gần nhất) ---
    fetchChartData = async () => {
        const token = getToken();
        if (!token) return;

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = 'http://localhost:8080/qlcc/thong-ke-thu-phi/sau-thang-gan-nhat';

        try {
            const response = await axios.get(apiUrl, config);
            const apiData = response.data.result;

            const labels = apiData.danhSachThang.map(item => item.thangNam);
            const data = apiData.danhSachThang.map(item => item.tongTienThu / 1000000); // Đơn vị: Triệu VNĐ

            this.setState({
                chartData: {
                    labels: labels,
                    datasets: [{
                        label: 'Tổng thu (Triệu VNĐ)',
                        data: data,
                        borderColor: '#007bff', // Màu đường
                        backgroundColor: 'rgba(0, 123, 255, 0.15)', // Màu nền dưới đường
                        borderWidth: 3,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#007bff',
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.4, // Độ cong mềm mại
                        fill: true, // Tô màu nền
                    }]
                }
            });

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu biểu đồ:", error);
        }
    }

    // --- 2. API LẤY BIẾN ĐỘNG CƯ DÂN ---
    fetchResidentActivities = async () => {
        const token = getToken();
        if (!token) return;

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = 'http://localhost:8080/qlcc/bien-dong-cu-dan';

        try {
            const response = await axios.get(apiUrl, config);
            if (response.data && response.data.result) {
                // Sắp xếp mới nhất lên đầu và lấy 5-7 item
                const sortedActivities = response.data.result
                    .sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao))
                    .slice(0, 7);

                this.setState({ residentActivities: sortedActivities });
            }
        } catch (error) {
            console.error("Lỗi khi tải biến động cư dân:", error);
        }
    }

    // --- 3. API LẤY BIẾN ĐỘNG THU PHÍ ---
    fetchFeeActivities = async () => {
        const token = getToken();
        if (!token) return;
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = 'http://localhost:8080/qlcc/bien-dong-thu-phi';

        try {
            const response = await axios.get(apiUrl, config);
            if (response.data && response.data.result) {
                const sortedActivities = response.data.result
                    .sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao))
                    .slice(0, 7);
                this.setState({ feeActivities: sortedActivities });
            }
        } catch (error) {
            console.error("Lỗi khi tải biến động thu phí:", error);
        }
    }

    componentDidMount() {
        this.setDefaultTabByRole(); // 1. Xác định tab mặc định ngay khi load
        this.fetchChartData();
        this.fetchResidentActivities();
        this.fetchFeeActivities();
    }

    setActivityTab = (tab) => {
        this.setState({ activeActivityTab: tab });
    }

    render() {
        const { totalApartments, totalResidents, t, navigate } = this.props;
        const { activeActivityTab, chartData, residentActivities, feeActivities } = this.state;

        const activitiesToDisplay = activeActivityTab === 'resident' ? residentActivities : feeActivities;

        // Tùy chọn hiển thị biểu đồ
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }, // Ẩn chú thích mặc định
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#adb5bd' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)', borderDash: [5, 5] },
                    ticks: { color: '#adb5bd' },
                    beginAtZero: true
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        };

        return (
            <div className="home-dashboard">

                {/* --- HÀNG 1: THẺ THỐNG KÊ NHỎ GỌN --- */}
                <div className="dashboard-stats-row">
                    <StatCard
                        navigate={navigate}
                        t={t}
                        icon="🏢" // Hoặc icon SVG
                        title={t('home_card.title_apartment')}
                        count={totalApartments || 0}
                        linkTo="/apartments"
                        color="blue"
                    />
                    <StatCard
                        navigate={navigate}
                        t={t}
                        icon="👥"
                        title={t('home_card.title_resident')}
                        count={totalResidents || 0}
                        linkTo="/residents"
                        color="green"
                    />
                    <StatCard
                        navigate={navigate}
                        t={t}
                        icon="💰"
                        title={t('home_card.title_receipt')}
                        count={0}
                        linkTo="/receipts"
                        color="purple"
                    />
                    {/* Thêm thẻ Thống kê nhanh khác nếu muốn */}
                    <StatCard
                        navigate={navigate}
                        t={t}
                        icon="📊"
                        title="Báo cáo"
                        count="CSV"
                        linkTo="/receipts"
                        color="orange"
                    />
                </div>

                {/* --- HÀNG 2: MAIN CONTENT (CHIA 2 CỘT) --- */}
                <div className="dashboard-main-content">

                    {/* CỘT TRÁI: BIỂU ĐỒ DOANH THU (CHIẾM 65%) */}
                    <div className="dashboard-panel chart-panel">
                        <div className="panel-header">
                            <div>
                                <h4>{t('dashboard.fee_stats_title')}</h4>
                                <p className="sub-text">Xu hướng thu phí thực tế theo từng tháng</p>
                            </div>
                            <div className="chart-legend">
                                <span className="dot"></span> Tổng thu
                            </div>
                        </div>
                        <div className="panel-body chart-wrapper">
                            {chartData ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <div className="loading-state">{t('dashboard.loading')}</div>
                            )}
                        </div>
                    </div>

                    {/* CỘT PHẢI: HOẠT ĐỘNG GẦN ĐÂY (CHIẾM 35%) */}
                    <div className="dashboard-panel activity-panel">
                        <div className="panel-header-tabs">
                            <button
                                className={`tab-btn ${activeActivityTab === 'resident' ? 'active' : ''}`}
                                onClick={() => this.setActivityTab('resident')}
                            >
                                {t('dashboard.resident_activity_tab')}
                            </button>
                            <button
                                className={`tab-btn ${activeActivityTab === 'fee' ? 'active' : ''}`}
                                onClick={() => this.setActivityTab('fee')}
                            >
                                {t('dashboard.fee_activity_tab')}
                            </button>
                        </div>

                        <div className="panel-body list-wrapper">
                            <ul className="activity-list">
                                {activitiesToDisplay.length > 0 ? (
                                    activitiesToDisplay.map((activity, index) => {
                                        // 1. Lấy loại hoạt động từ API (ưu tiên 'type', fallback sang 'loai' nếu có)
                                        // API của bạn trả về: "Đóng góp", "Thu phí", "Tạm trú"...
                                        const rawType = activity.type || activity.loai || 'Thông báo';

                                        // 2. Chuyển đổi sang class name chuẩn để dùng trong SCSS
                                        // Ví dụ: "Đóng góp" -> "đóng-góp", "Thu phí" -> "thu-phí"
                                        const typeClass = rawType.toLowerCase().trim().replace(/\s+/g, '-');

                                        // 3. Chọn icon
                                        const icon = activeActivityTab === 'resident' ? '👤' : '💲';

                                        return (
                                            <li key={index} className="activity-item">
                                                <div className={`activity-icon ${activeActivityTab === 'resident' ? 'res' : 'fee'}`}>
                                                    {icon}
                                                </div>
                                                <div className="activity-content">
                                                    {/* Class động: 'thu-phí', 'đóng-góp', 'tạm-trú'... khớp với SCSS */}
                                                    <span className={`activity-type-badge ${typeClass}`}>
                                                        {rawType}
                                                    </span>
                                                    <p className="activity-msg">{activity.text}</p>
                                                    <span className="activity-time">
                                                        {activity.ngayTao ? new Date(activity.ngayTao).toLocaleDateString('vi-VN') : 'Vừa xong'}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <div className="empty-state">
                                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="No Data" width="60" />
                                        <p>{t('dashboard.no_activity')}</p>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(withTranslation()(Home));