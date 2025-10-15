import React from "react";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import '../../styles/resident-styles/ResidentQueryHistory.scss'

class ResidentQueryHistory extends React.Component {
    state = {
        cccdToQuery: '', // Lưu CCCD nhập vào
        historyList: [],  // Lưu kết quả từ API
        isLoading: false, // Quản lý trạng thái loading
        error: null  // Quản lý lỗi
    };

    handleInputChange = (event) => {
        this.setState({
            cccdToQuery: event.target.value
        });
    }

    handleSearch = async () => {
        const { cccdToQuery } = this.state;
        if (!cccdToQuery) {
            alert("Vui lòng nhập CCCD cần truy vấn.");
            return;
        }
        this.setState({ isLoading: true, error: null, historyList: [] });
        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            this.setState({ isLoading: false });
            return;
        }

        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };

        try {
            const apiUrl = `http://localhost:8080/qlcc/nhan-khau/history/${cccdToQuery}`;
            const response = await axios.get(apiUrl, config);

            console.log("Lấy lịch sử thay đổi thành công");
            this.setState({
                historyList: response.data.result,
                isLoading: false
            });

        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Không thể kết nối đến server.";
            console.error("Có lỗi khi lấy lịch sử thay đổi:", errorMessage);
            this.setState({
                error: `Lỗi: ${errorMessage}`,
                isLoading: false
            });
        }
    }

    render() {
        const { cccdToQuery, historyList, isLoading, error } = this.state;

        return (
            <div className="history-container">
                <div className="history-search-bar">
                    <input
                        type="text"
                        placeholder="Nhập CCCD của nhân khẩu..."
                        value={cccdToQuery}
                        onChange={this.handleInputChange}
                    />
                    <button onClick={this.handleSearch} disabled={isLoading}>
                        {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </div>

                <div className="history-results">
                    {error && <p className="error-message">{error}</p>}
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>CCCD Nhân khẩu</th>
                                <th>Thông tin thay đổi</th>
                                <th>Ngày thay đổi</th>
                                <th>Người thực hiện</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5">Đang tải dữ liệu...</td>
                                </tr>
                            ) : historyList && historyList.length > 0 ? (
                                historyList.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.cccdNhanKhau}</td>
                                        <td>{item.thongTinThayDoi}</td>
                                        <td>{item.ngayThayDoi}</td>
                                        <td>{item.nguoiThucHien}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">Không có dữ liệu để hiển thị.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ResidentQueryHistory;