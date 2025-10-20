import React from "react";
import { getToken } from "../../services/localStorageService";
import axios from "axios";
import '../../styles/receipt-styles/ApartmentPaymentHistory.scss'

class ApartmentPaymentHistory extends React.Component {
    state = {
        idCanHo: '',            // Lưu ID Căn hộ nhập vào
        historyData: null,     // Lưu kết quả từ API
        isLoading: false,
        error: null,
    }

    handleInputChange = (e) => {
        this.setState({ idCanHo: e.target.value });
    }

    handleSearch = async () => {
        const { idCanHo } = this.state;
        if (!idCanHo) {
            alert("Vui lòng nhập ID Căn hộ.");
            return;
        }

        this.setState({
            isLoading: true,
            error: null,
            historyData: null,
        })

        const token = getToken();
        if (!token) {
            this.setState({ isLoading: false, error: "Phiên đăng nhập đã hết hạn." });
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const apiUrl = `http://localhost:8080/qlcc/thong-ke-thu-phi/can-ho/${idCanHo}`;
        try {
            const response = await axios.get(apiUrl, config);
            console.log("Lấy lịch sử thanh toán thành công:", response.data);
            this.setState({ historyData: response.data.result, isLoading: false });
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Không tìm thấy thông tin hoặc có lỗi xảy ra.";
            this.setState({ error: `Lỗi: ${errorMessage}`, isLoading: false });
        }
    }

    formatCurrency = (number) => (number || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    render() {
        const { idCanHo, historyData, isLoading, error } = this.state;

        return (
            <div className="history-container">
                <div className="history-search-controls">
                    <input
                        type="number"
                        placeholder="Nhập id căn hộ cần tra cứu ..."
                        value={idCanHo}
                        onChange={this.handleInputChange}
                    />
                    <button onClick={this.handleSearch} disabled={isLoading}>
                        {isLoading ? "Đang tìm ..." : "Tra cứu"}
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}

                {historyData && (
                    <div className="history-results">
                        {/* --- Phần Tóm tắt --- */}
                        <div className="history-summary">
                            <div className="summary-item"><span>Phải nộp (Bắt buộc)</span><strong>{this.formatCurrency(historyData.tongPhiBatBuocPhaiNop)}</strong></div>
                            <div className="summary-item success"><span>Đã nộp (Bắt buộc)</span><strong>{this.formatCurrency(historyData.tongPhiBatBuocDaNop)}</strong></div>
                            <div className="summary-item fail"><span>Còn thiếu (Bắt buộc)</span><strong>{this.formatCurrency(historyData.tongPhiBatBuocConThieu)}</strong></div>
                            <div className="summary-item voluntary"><span>Đã đóng góp (Tự nguyện)</span><strong>{this.formatCurrency(historyData.tongDongGopTuNguyen)}</strong></div>
                        </div>

                        {/* --- Bảng Phí Bắt buộc --- */}
                        <h4>Lịch sử Phí Bắt buộc</h4>
                        <div className="history-table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Kỳ thu</th><th>Tổng phí</th><th>Đã nộp</th><th>Còn nợ</th><th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.danhSachPhiBatBuoc.map(item => (
                                        <tr key={item.idThoiGianThu}>
                                            <td>{item.idThoiGianThu}</td>
                                            <td>{this.formatCurrency(item.tongPhi)}</td>
                                            <td>{this.formatCurrency(item.soTienDaNop)}</td>
                                            <td>{this.formatCurrency(item.soDu)}</td>
                                            <td><span className={`status ${item.trangThai.toLowerCase()}`}>{item.trangThai.replace('_', ' ')}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* --- Bảng Đóng góp Tự nguyện --- */}
                        <h4>Lịch sử Đóng góp Tự nguyện</h4>
                        <div className="history-table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tên khoản đóng góp</th><th>Ngày đóng góp</th><th>Số tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.danhSachDongGop.map(item => (
                                        <tr key={item.idKhoanDongGop}>
                                            <td>{item.tenKhoanDongGop}</td>
                                            <td>{item.ngayDongGop}</td>
                                            <td>{this.formatCurrency(item.soTienDongGop)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


            </div>
        )
    }

}

export default ApartmentPaymentHistory;