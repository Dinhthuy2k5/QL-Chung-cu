import React from "react";
import '../styles/home-styles/Home.scss';
import { useNavigate } from "react-router-dom";
import { withRouter } from "../HOC/withRouter"; // Import HOC của bạn
import { Bar } from 'react-chartjs-2'; // Import biểu đồ
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { getToken } from "../services/localStorageService";

import { withTranslation } from 'react-i18next';
import { useTranslation } from "react-i18next";
// Đăng ký các thành phần cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Component con cho các thẻ thống kê
function StatCard(props) {
    const navigate = props.navigate;
    const { t } = useTranslation();
    return (
        <div className="stat-card" onClick={() => navigate(props.linkTo)}>
            <div className="card-header">
                <span className="card-icon">{props.icon}</span>
                <h3 className="card-title">{props.title}</h3>
            </div>
            <div className="card-body">
                <span className="label">{t('home_card.total_count')}</span>
                <span className="count">{props.count}</span>
            </div>
            <button className="view-all-button">{t('home_card.view_all')}</button>
        </div>
    );
}

class Home extends React.Component {

    // Thêm state để quản lý tab hoạt động
    state = {
        activeActivityTab: 'resident', // 'resident' hoặc 'fee'
        chartData: null, // 2. Chuyển chartData vào state để cập nhật động
        residentActivities: [], // <-- để nhận dữ liệu API cho biến động dân cư
        feeActivities: [],  // <-- để nhận dữ liệu API cho biến động thu phí
    };

    // 3. Hàm gọi API lấy dữ liệu biểu đồ
    fetchChartData = async () => {
        const token = getToken();
        if (!token) return; // Không gọi API nếu chưa đăng nhập

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = 'http://localhost:8080/qlcc/thong-ke-thu-phi/sau-thang-gan-nhat';

        try {
            const response = await axios.get(apiUrl, config);
            const apiData = response.data.result;

            // Xử lý dữ liệu API trả về để khớp với định dạng của Chart.js
            const labels = apiData.danhSachThang.map(item => item.thangNam);
            const data = apiData.danhSachThang.map(item => item.tongTienThu / 1000000); // Chia cho 1 triệu

            this.setState({
                chartData: {
                    labels: labels,
                    datasets: [{
                        label: 'Tổng thu (triệu VNĐ)',
                        data: data,
                        backgroundColor: 'rgba(0, 123, 255, 0.7)',
                        borderRadius: 5,
                    }]
                }
            });

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu biểu đồ:", error);
        }
    }

    // HÀM gọi API LẤY BIẾN ĐỘNG CƯ DÂN 
    fetchResidentActivities = async () => {
        const token = getToken();
        if (!token) return;

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = 'http://localhost:8080/qlcc/bien-dong-cu-dan';

        try {
            const response = await axios.get(apiUrl, config);
            if (response.data && response.data.result) {
                // Sắp xếp lại, giả sử API trả về mảng, lấy 5 mục mới nhất
                const sortedActivities = response.data.result
                    .sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao)) // Sắp xếp theo ngayTao mới nhất
                    .slice(0, 5); // Chỉ lấy 5 mục

                this.setState({ residentActivities: sortedActivities });
            }
        } catch (error) {
            console.error("Lỗi khi tải biến động cư dân:", error);
        }
    }

    // HÀM gọi API LẤY BIẾN ĐỘNG THU PHÍ
    fetchFeeActivities = async () => {

        const token = getToken();
        if (!token) return;

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = 'http://localhost:8080/qlcc/bien-dong-thu-phi';

        try {
            const response = await axios.get(apiUrl, config);
            if (response.data && response.data.result) {
                // Sắp xếp lại, giả sử API trả về mảng, lấy 5 mục mới nhất
                const sortedActivities = response.data.result
                    .sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao)) // Sắp xếp theo ngayTao mới nhất
                    .slice(0, 5); // Chỉ lấy 5 mục

                this.setState({ feeActivities: sortedActivities });
            }
        } catch (error) {
            console.error("Lỗi khi tải biến động thu phí:", error);
        }
    }

    // 4. Gọi API khi component được tải
    componentDidMount() {
        this.fetchChartData();
        this.fetchResidentActivities();
        this.fetchFeeActivities();
    }

    // Hàm thay đổi tab
    setActivityTab = (tab) => {
        this.setState({ activeActivityTab: tab });
    }

    render() {
        const { totalApartments, totalResidents, t } = this.props; // Nhận thêm totalResidents từ App.js
        const { activeActivityTab, chartData, residentActivities, feeActivities } = this.state; // 5. Lấy chartData, residentActivities, feeActivities từ state

        // Chọn danh sách hoạt động dựa trên tab đang active
        const activitiesToDisplay = activeActivityTab === 'resident' ? residentActivities : feeActivities;

        return (
            <div className="home-container">
                {/* --- HÀNG THỐNG KÊ NHANH --- */}
                <div className="stat-cards-container">
                    <StatCard
                        navigate={this.props.navigate}
                        icon="🏢"
                        title={t('home_card.title_apartment')}
                        count={totalApartments || 0}
                        linkTo="/apartments"
                    />
                    <StatCard
                        navigate={this.props.navigate}
                        icon="👥"
                        title={t('home_card.title_resident')}
                        count={totalResidents || 0} // Bạn cần truyền prop này từ App.js
                        linkTo="/residents"
                    />
                    <StatCard
                        navigate={this.props.navigate}
                        icon="💰"
                        title={t('home_card.title_receipt')}
                        count={0} // Thay bằng state của bạn
                        linkTo="/receipts"
                    />
                </div>

                {/* --- BẢNG ĐIỀU KHIỂN CHÍNH --- */}
                <div className="main-dashboard-grid">
                    {/* --- CỘT TRÁI: BIỂU ĐỒ --- */}
                    <div className="dashboard-panel chart-panel">
                        <div className="panel-header">
                            <h4>{t('dashboard.fee_stats_title')}</h4>
                        </div>
                        <div className="panel-body">
                            {/* 6. Kiểm tra chartData trước khi render */}
                            {chartData ? (
                                <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                            ) : (
                                <p style={{ textAlign: 'center' }}>{t('dashboard.loading')}</p>
                            )}
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: HOẠT ĐỘNG GẦN ĐÂY --- */}
                    <div className="dashboard-panel activity-panel">
                        <div className="panel-header">
                            {/* --- TẠO CÁC TAB ĐIỀU HƯỚNG --- */}
                            <div className="activity-tabs">
                                <button
                                    className={`tab-button ${activeActivityTab === 'resident' ? 'active' : ''}`}
                                    onClick={() => this.setActivityTab('resident')}
                                >
                                    {t('dashboard.resident_activity_tab')}
                                </button>
                                <button
                                    className={`tab-button ${activeActivityTab === 'fee' ? 'active' : ''}`}
                                    onClick={() => this.setActivityTab('fee')}
                                >
                                    {t('dashboard.fee_activity_tab')}
                                </button>
                            </div>
                        </div>
                        <div className="panel-body">
                            <ul className="activity-list">
                                {activitiesToDisplay.length > 0 ? (
                                    activitiesToDisplay.map(activity => (
                                        <li key={activity.id} className={`activity-item ${activity.loai.toLowerCase().replace(/ /g, '-')}`}>
                                            <div className="activity-type">{activity.loai}</div>
                                            <div className="activity-text">{activity.text}</div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="activity-item-empty">{t('dashboard.no_activity')}</li>
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