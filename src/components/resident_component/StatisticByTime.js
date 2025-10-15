import React from "react";
import { error } from "three";
import { getToken } from "../../services/localStorageService";
import axios from "axios";
import '../../styles/resident-styles/StatisticByTime.scss'

class StatisticByTime extends React.Component {

    state = {
        ngayBatDau: '',
        ngayKetThuc: '',
        soLuongNhanKhauMoi: null,
        isLoading: false,
        error: null

    }

    // Xử lý khi người dùng thay đổi ngày
    handleDateChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleStatistic = async () => {
        const { ngayBatDau, ngayKetThuc } = this.state;

        if (!ngayBatDau || !ngayKetThuc) {
            alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
            return;
        }

        this.setState({
            isLoading: true,
            error: null,
            soLuongNhanKhauMoi: null
        });

        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            this.setState({ isLoading: false });
            return;
        }
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };

        const data = {
            ngayBatDau: ngayBatDau,
            ngayKetThuc: ngayKetThuc
        };

        try {
            const apiUrl = `http://localhost:8080/qlcc/thong-ke/khoang-thoi-gian`;
            const response = await axios.post(apiUrl, data, config);

            console.log("Thống kê theo thời gian thành công");
            this.setState({
                soLuongNhanKhauMoi: response.data.result.soLuongNhanKhauMoi,
                isLoading: false
            });
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Không thể kết nối đến server.";
            console.error("Có lỗi khi thống kê:", errorMessage);
            this.setState({
                error: `Lỗi: ${errorMessage}`,
                isLoading: false
            });
        }


    }

    render() {
        const { ngayBatDau, ngayKetThuc, soLuongNhanKhauMoi, isLoading, error } = this.state;

        return (
            <div className="time-statistic-container">
                <h3 className="title" >Thống kê Nhân khẩu theo Thời gian </h3>
                <div className="time-statistic-controls">
                    <div className="date-picker-group">
                        <label htmlFor="ngayBatDau">Từ ngày: </label>
                        <input
                            type="date"
                            id="ngayBatDau"
                            name="ngayBatDau"
                            value={ngayBatDau}
                            onChange={this.handleDateChange}
                        />
                    </div>
                    <div className="date-picker-group">
                        <label htmlFor="ngayKetThuc">Đến ngày:</label>
                        <input
                            type="date"
                            id="ngayKetThuc"
                            name="ngayKetThuc"
                            value={ngayKetThuc}
                            onChange={this.handleDateChange}
                        />
                    </div>
                    <button onClick={this.handleStatistic} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Thống kê'}
                    </button>

                </div>

                <div className="time-statistic-results">
                    {error && <p className="error-message">{error}</p>}

                    {soLuongNhanKhauMoi !== null && (
                        <div className="result-box">
                            <span className="result-label">Số lượng nhân khẩu mới trong khoảng thời gian đã chọn:</span>
                            <span className="result-count">{soLuongNhanKhauMoi}</span>
                        </div>
                    )}
                </div>

            </div>

        )
    }
}

export default StatisticByTime;