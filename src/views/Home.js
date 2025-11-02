import React from "react";
import '../styles/home-styles/Home.scss';
import { useNavigate } from "react-router-dom";
import { withRouter } from "../HOC/withRouter"; // Import HOC của bạn
import { Bar } from 'react-chartjs-2'; // Import biểu đồ
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { getToken } from "../services/localStorageService";

// Đăng ký các thành phần cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Component con cho các thẻ thống kê
function StatCard(props) {
    const navigate = props.navigate;
    return (
        <div className="stat-card" onClick={() => navigate(props.linkTo)}>
            <div className="card-header">
                <span className="card-icon">{props.icon}</span>
                <h3 className="card-title">{props.title}</h3>
            </div>
            <div className="card-body">
                <span className="label">Tổng số:</span>
                <span className="count">{props.count}</span>
            </div>
            <button className="view-all-button">Xem tất cả</button>
        </div>
    );
}

class Home extends React.Component {

    // Thêm state để quản lý tab hoạt động
    state = {
        activeActivityTab: 'resident', // 'resident' hoặc 'fee'
        chartData: null // 2. Chuyển chartData vào state để cập nhật động
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

    // 4. Gọi API khi component được tải
    componentDidMount() {
        this.fetchChartData();
    }

    // Tách dữ liệu hoạt động thành 2 mảng riêng biệt
    residentActivities = [
        { id: 1, type: 'Tạm trú', text: 'Nguyễn Văn C (Căn hộ 101) vừa đăng ký tạm trú.' },
        { id: 2, type: 'Tạm vắng', text: 'Trần Thị B (Căn hộ 205) vừa đăng ký tạm vắng.' },
        { id: 4, type: 'Thêm mới', text: 'Gia đình ông D (Căn hộ 301) vừa thêm nhân khẩu mới.' }
    ];

    feeActivities = [
        { id: 3, type: 'Thu phí', text: 'Hộ gia đình căn hộ 102 vừa thanh toán phí tháng 10.' },
        { id: 5, type: 'Đóng góp', text: 'Bà E (Căn hộ 404) đã ủng hộ quỹ từ thiện 500.000 VNĐ.' }
    ];

    // Hàm thay đổi tab
    setActivityTab = (tab) => {
        this.setState({ activeActivityTab: tab });
    }

    render() {
        const { totalApartments, totalResidents } = this.props; // Nhận thêm totalResidents từ App.js
        const { activeActivityTab, chartData } = this.state; // 5. Lấy chartData từ state

        // Chọn danh sách hoạt động dựa trên tab đang active
        const activitiesToDisplay = activeActivityTab === 'resident' ? this.residentActivities : this.feeActivities;

        return (
            <div className="home-container">
                {/* --- HÀNG THỐNG KÊ NHANH --- */}
                <div className="stat-cards-container">
                    <StatCard
                        navigate={this.props.navigate}
                        icon="🏢"
                        title="Căn hộ"
                        count={totalApartments || 0}
                        linkTo="/apartments"
                    />
                    <StatCard
                        navigate={this.props.navigate}
                        icon="👥"
                        title="Cư dân"
                        count={totalResidents || 0} // Bạn cần truyền prop này từ App.js
                        linkTo="/residents"
                    />
                    <StatCard
                        navigate={this.props.navigate}
                        icon="💰"
                        title="Khoản thu"
                        count={0} // Thay bằng state của bạn
                        linkTo="/receipts"
                    />
                </div>

                {/* --- BẢNG ĐIỀU KHIỂN CHÍNH --- */}
                <div className="main-dashboard-grid">
                    {/* --- CỘT TRÁI: BIỂU ĐỒ --- */}
                    <div className="dashboard-panel chart-panel">
                        <div className="panel-header">
                            <h4>Thống kê Thu phí 6 tháng gần nhất</h4>
                        </div>
                        <div className="panel-body">
                            {/* 6. Kiểm tra chartData trước khi render */}
                            {chartData ? (
                                <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                            ) : (
                                <p style={{ textAlign: 'center' }}>Đang tải dữ liệu biểu đồ...</p>
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
                                    Biến động Cư dân
                                </button>
                                <button
                                    className={`tab-button ${activeActivityTab === 'fee' ? 'active' : ''}`}
                                    onClick={() => this.setActivityTab('fee')}
                                >
                                    Biến động Thu phí
                                </button>
                            </div>
                        </div>
                        <div className="panel-body">
                            <ul className="activity-list">
                                {activitiesToDisplay.map(activity => (
                                    <li key={activity.id} className={`activity-item ${activity.type.toLowerCase().replace(/ /g, '-')}`}>
                                        <div className="activity-type">{activity.type}</div>
                                        <div className="activity-text">{activity.text}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);