import React from "react";
import { error } from "three";
import { getToken } from "../../services/localStorageService";
import '../../styles/receipt-styles/MandatoryFeeList.scss'
import axios from "axios";

class MandatoryFeeList extends React.Component {
    state = {
        idThoiGianThu: '', // Lưu ID thời gian thu nhập vào
        feeData: null,     // Lưu toàn bộ kết quả từ API
        isLoading: false,
        error: null,
    };

    handleInputChange = (event) => {
        this.setState({ idThoiGianThu: event.target.value });
    }

    handleGenerateList = async () => {
        const { idThoiGianThu } = this.state;
        if (!idThoiGianThu) {
            alert("Vui lòng nhập ID Thời gian thu.");
            return;
        }

        this.setState({ isLoading: true, error: null, feeData: null });
        const token = getToken();
        if (!token) {
            this.setState({ isLoading: false, error: "Phiên đăng nhập đã hết hạn." });
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/phi/phi-bat-buoc/${idThoiGianThu}`;

        try {
            const response = await axios.get(apiUrl, config);
            console.log("Lập danh sách thành công:", response.data);
            this.setState({ feeData: response.data.result, isLoading: false });
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Không thể kết nối đến server.";
            console.error("Lỗi khi lập danh sách:", errorMessage);
            this.setState({ error: `Lỗi: ${errorMessage}`, isLoading: false });
        }
    }

    // Helper function to format currency
    formatCurrency = (number) => {
        return (number || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    render() {
        const { idThoiGianThu, feeData, isLoading, error } = this.state;

        return (
            <div className="fee-list-container">
                <div className="fee-list-controls">
                    <input
                        type="text"
                        placeholder="Nhập ID Thời gian thu (VD: 102025)"
                        value={idThoiGianThu}
                        onChange={this.handleInputChange}
                    />
                    <button onClick={this.handleGenerateList} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Lập danh sách'}
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}

                {feeData && (
                    <div className="fee-list-results">
                        {/* Khu vực tóm tắt */}
                        <div className="fee-list-summary">
                            <div className="summary-item"><span>Ngày thu</span><strong>{feeData.ngayThu}</strong></div>
                            <div className="summary-item"><span>Hạn thu</span><strong>{feeData.hanThu}</strong></div>
                            <div className="summary-item success"><span>Đã nộp</span><strong>{feeData.successCount} / {feeData.totalCanHo}</strong></div>
                            <div className="summary-item total"><span>Tổng thu</span><strong>{this.formatCurrency(feeData.tongPhiAll)}</strong></div>
                        </div>

                        {/* Bảng chi tiết */}
                        <div className="fee-list-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID Căn hộ</th>
                                        <th>Trạng thái</th>
                                        <th>Tổng Phí</th>
                                        <th>Phí Chung cư</th>
                                        <th>Phí Gửi Xe</th>
                                        <th>Phí Tiện ích</th>
                                        <th>Đã nộp</th>
                                        <th>Còn nợ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeData.danhSachTongThanhToan.map(item => (
                                        <tr key={item.idCanHo}>
                                            <td>{item.idCanHo}</td>
                                            <td><span className={`status ${item.trangThai === 'DA_THANH_TOAN' ? 'paid' : 'unpaid'}`}>{item.trangThai.replace('_', ' ')}</span></td>
                                            <td>{this.formatCurrency(item.tongPhi)}</td>
                                            <td>{this.formatCurrency(item.tongPhiChungCu)}</td>
                                            <td>{this.formatCurrency(item.tongGuiXe)}</td>
                                            <td>{this.formatCurrency(item.tongTienIch)}</td>
                                            <td>{this.formatCurrency(item.soTienDaNop)}</td>
                                            <td>{this.formatCurrency(item.soDu)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }

}

export default MandatoryFeeList;