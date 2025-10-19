import React from "react";
import '../styles/receipt-styles/Receipt.scss'
import { getToken } from "../services/localStorageService";
import axios from "axios";
import MandatoryFeeList from "../components/receipt_component/MandatoryFeeList";

class Receipt extends React.Component {
    state = {

        activeView: 'main', // 'main', 'addFee', 'collectFee', 'mandatoryList'
        // State cho các modal
        isAddFeeModalOpen: false,
        isCollectFeeModalOpen: false,
        isResultModalOpen: false, // Modal mới để hiển thị kết quả thanh toán

        loaiKhoanThu: '',
        // Một state duy nhất cho tất cả các trường của form "Tạo khoản thu"
        addFeeForm: {
            idCanHo: '',
            idThoiGianThu: '',
            tienDien: '',
            tienNuoc: '',
            tienInternet: '',
            phiDichVuPerM2: '',
            phiQuanLyPerM2: '',
            tienXeMayPerXe: '',
            tienXeOtoPerXe: ''
        },

        // State cho form "Thu phí"
        collectFeeForm: {
            idThoiGianThu: '',
            danhSachIdCanHo: '', // Sẽ là một chuỗi "1, 2, 3" từ input
        },
        // State để lưu kết quả từ API thanh toán
        paymentResult: null,
    };

    // Hàm để thay đổi view
    setView = (view) => this.setState({ activeView: view });

    // Hàm reset state của form tạo khoản thu
    resetAddFeeForm = () => {
        this.setState({
            addFeeForm: {
                idCanHo: '', idThoiGianThu: '', tienDien: '', tienNuoc: '',
                tienInternet: '', phiDichVuPerM2: '', phiQuanLyPerM2: '', tienXeMayPerXe: '', tienXeOtoPerXe: ''
            }
        });
    }


    toggleAddFeeModal = (status) => {
        if (!status) { // Nếu đóng modal, reset form
            this.setState({ loaiKhoanThu: '' });
            this.resetAddFeeForm();
        }
        this.setState({
            isAddFeeModalOpen: status
        });
    }

    toggleCollectFeeModal = (status) => {
        // Reset form khi đóng modal
        if (!status) {
            this.setState({ collectFeeForm: { idThoiGianThu: '', danhSachIdCanHo: '' } });
        }
        this.setState({ isCollectFeeModalOpen: status });
    };

    toggleResultModal = (status) => this.setState({ isResultModalOpen: status });

    // --- CÁC HÀM XỬ LÝ FORM ---

    handleLoaiKhoanThuChange = (event) => {
        // Khi thay đổi loại khoản thu, reset dữ liệu form cũ
        this.resetAddFeeForm();
        this.setState({ loaiKhoanThu: event.target.value });
    }
    // Hàm chung để xử lý tất cả các input trong form tạo khoản thu
    handleAddFeeFormChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            addFeeForm: { ...prevState.addFeeForm, [name]: value }
        }));
    }

    handleCollectFeeFormChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            collectFeeForm: { ...prevState.collectFeeForm, [name]: value }
        }));
    }

    // --- CÁC HÀM GỌI API ---
    handleAddFeeSubmit = async (event) => {

        event.preventDefault();

        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        let apiUrl = '';
        let data = {};
        const { loaiKhoanThu, addFeeForm } = this.state;

        // Xây dựng URL và data dựa trên loại khoản thu được chọn
        switch (loaiKhoanThu) {
            case "Phí tiện ích":
                apiUrl = `http://localhost:8080/qlcc/phi/tien-ich`;
                data = {
                    idCanHo: addFeeForm.idCanHo,
                    idThoiGianThu: addFeeForm.idThoiGianThu,
                    tienDien: addFeeForm.tienDien,
                    tienNuoc: addFeeForm.tienNuoc,
                    tienInternet: addFeeForm.tienInternet,
                };
                break;
            case "Phí chung cư":
                apiUrl = `http://localhost:8080/qlcc/phi/phi-chung-cu/batch`;
                data = {
                    idThoiGianThu: addFeeForm.idThoiGianThu,
                    phiDichVuPerM2: addFeeForm.phiDichVuPerM2,
                    phiQuanLyPerM2: addFeeForm.phiQuanLyPerM2,
                };
                break;
            case "Phí gửi xe":
                apiUrl = `http://localhost:8080/qlcc/phi/phi-gui-xe/batch`;
                data = {
                    idThoiGianThu: addFeeForm.idThoiGianThu,
                    tienXeMayPerXe: addFeeForm.tienXeMayPerXe,
                    tienXeOtoPerXe: addFeeForm.tienXeOtoPerXe,
                };
                break;
            default:
                alert("Vui lòng chọn một loại khoản thu hợp lệ.");
                return;
        }

        try {
            console.log(`Submitting to ${apiUrl} with data:`, data);
            const response = await axios.post(apiUrl, data, config);
            console.log("Tạo khoản thu thành công:", response.data);
            alert("Tạo khoản thu thành công!");
            this.toggleAddFeeModal(false);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Lỗi không xác định.";
            console.error("Lỗi khi tạo khoản thu:", errorMessage);
            alert(`Tạo khoản thu thất bại: ${errorMessage}`);
        }
    }


    handleCollectFeeSubmit = async (event) => {
        event.preventDefault();

        const { idThoiGianThu, danhSachIdCanHo } = this.state.collectFeeForm;
        if (!idThoiGianThu || !danhSachIdCanHo) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        // Chuyển đổi chuỗi "1, 2, 3" thành mảng các số [1, 2, 3]
        const idArray = danhSachIdCanHo.split(',')
            .map(id => Number(id.trim()))
            .filter(id => !isNaN(id) && id > 0);

        if (idArray.length === 0) {
            alert("Danh sách ID căn hộ không hợp lệ.");
            return;
        }

        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const data = { danhSachIdCanHo: idArray };
        const apiUrl = `http://localhost:8080/qlcc/phi/thanh-toan/${idThoiGianThu}`;

        try {
            console.log(`Submitting to ${apiUrl} with data:`, data);
            const response = await axios.post(apiUrl, data, config);

            console.log("Thanh toán thành công:", response.data);

            // Lưu kết quả và mở modal kết quả
            this.setState({ paymentResult: response.data.result });
            this.toggleCollectFeeModal(false); // Đóng modal thu phí
            this.toggleResultModal(true);     // Mở modal kết quả

        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Lỗi không xác định.";
            console.error("Lỗi khi thu phí:", errorMessage);
            alert(`Thu phí thất bại: ${errorMessage}`);
        }
    };

    // Hàm render modal tạo khoản thu
    renderAddFeeModal() {
        const { addFeeForm, loaiKhoanThu } = this.state;
        const feeTypes = [
            "Phí chung cư",
            "Phí gửi xe",
            "Phí tiện ích"
        ];

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>Tạo khoản thu</h3><button onClick={() => this.toggleAddFeeModal(false)}>&times;</button></div>
                    <form onSubmit={this.handleAddFeeSubmit}>
                        <div className="modal-body">
                            <div className="form-group full-width">
                                <label>Loại khoản thu</label>
                                <select name="loaiKhoanThu" value={loaiKhoanThu} onChange={this.handleLoaiKhoanThuChange} required>
                                    <option value="" disabled>-- Chọn loại khoản thu --</option>
                                    {feeTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>

                            </div>
                            {/* --- Render có điều kiện cho Phí tiện ích --- */}
                            {loaiKhoanThu === "Phí tiện ích" && (
                                <>
                                    <div className="form-group"><label>Id Căn hộ</label><input name="idCanHo" value={addFeeForm.idCanHo} onChange={this.handleAddFeeFormChange} type="text" required /></div>
                                    <div className="form-group"><label>Id Thời gian thu</label><input name="idThoiGianThu" value={addFeeForm.idThoiGianThu} onChange={this.handleAddFeeFormChange} type="text" required /></div>
                                    <div className="form-group"><label>Tiền điện</label><input name="tienDien" value={addFeeForm.tienDien} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                    <div className="form-group"><label>Tiền nước</label><input name="tienNuoc" value={addFeeForm.tienNuoc} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                    <div className="form-group"><label>Tiền Internet</label><input name="tienInternet" value={addFeeForm.tienInternet} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                </>
                            )}

                            {/* --- Render có điều kiện cho Phí chung cư --- */}
                            {loaiKhoanThu === "Phí chung cư" && (
                                <>
                                    <div className="form-group"><label>Id Thời gian thu</label><input name="idThoiGianThu" value={addFeeForm.idThoiGianThu} onChange={this.handleAddFeeFormChange} type="text" required /></div>
                                    <div className="form-group"><label>Phí dịch vụ trên 1m2</label><input name="phiDichVuPerM2" value={addFeeForm.phiDichVuPerM2} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                    <div className="form-group"><label>Phí quản lý trên 1m2</label><input name="phiQuanLyPerM2" value={addFeeForm.phiQuanLyPerM2} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                </>
                            )}
                            {/* --- Render có điều kiện cho Phí gửi xe --- */}
                            {loaiKhoanThu === "Phí gửi xe" && (
                                <>
                                    <div className="form-group"><label>Id Thời gian thu</label><input name="idThoiGianThu" value={addFeeForm.idThoiGianThu} onChange={this.handleAddFeeFormChange} type="text" required /></div>
                                    <div className="form-group"><label>Phí gửi 1 xe máy</label><input name="tienXeMayPerXe" value={addFeeForm.tienXeMayPerXe} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                    <div className="form-group"><label>Phí gửi 1 ô tô</label><input name="tienXeOtoPerXe" value={addFeeForm.tienXeOtoPerXe} onChange={this.handleAddFeeFormChange} type="number" required /></div>

                                </>
                            )}

                        </div>


                        <div className="modal-footer"><button type="submit">Tạo</button></div>
                    </form>
                </div>
            </div>
        );
    };

    renderCollectFeeModal() {
        const { collectFeeForm } = this.state;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>Thu phí Bắt buộc</h3><button onClick={() => this.toggleCollectFeeModal(false)}>&times;</button></div>
                    <form onSubmit={this.handleCollectFeeSubmit}>
                        <div className="modal-body">
                            <div className="form-group full-width">
                                <label>ID Thời gian thu (VD: 102025 cho tháng 10/2025)</label>
                                <input name="idThoiGianThu" value={collectFeeForm.idThoiGianThu} onChange={this.handleCollectFeeFormChange} type="text" required />
                            </div>
                            <div className="form-group full-width">
                                <label>Danh sách ID Căn hộ đã nộp (cách nhau bởi dấu phẩy)</label>
                                <textarea name="danhSachIdCanHo" value={collectFeeForm.danhSachIdCanHo} onChange={this.handleCollectFeeFormChange} rows="4" placeholder="Ví dụ: 1, 2, 5" required />
                            </div>
                        </div>
                        <div className="modal-footer"><button type="submit">Xác nhận Thanh toán</button></div>
                    </form>
                </div>
            </div>
        );
    }


    // --- HÀM MỚI ĐỂ RENDER MODAL KẾT QUẢ ---
    renderPaymentResultModal() {
        const { paymentResult } = this.state;
        if (!paymentResult) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content large">
                    <div className="modal-header"><h3>Kết quả Thanh toán</h3><button onClick={() => this.toggleResultModal(false)}>&times;</button></div>
                    <div className="modal-body">
                        <div className="result-summary">
                            <div className="summary-item"><span>Tổng Căn hộ</span><strong>{paymentResult.totalCanHo}</strong></div>
                            <div className="summary-item success"><span>Thành công</span><strong>{paymentResult.successCount}</strong></div>
                            <div className="summary-item fail"><span>Thất bại</span><strong>{paymentResult.failCount}</strong></div>
                            <div className="summary-item total"><span>Tổng Phí Thu</span><strong>{paymentResult.tongPhiAll.toLocaleString('vi-VN')} VNĐ</strong></div>
                        </div>
                        <div className="result-table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID Căn hộ</th>
                                        <th>Tổng Phí Chung cư</th>
                                        <th>Phí Dịch vụ</th>
                                        <th>Phí Gửi xe</th>
                                        <th>Phí Tiện ích</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentResult.danhSachTongThanhToan.map(item => (
                                        <tr key={item.idCanHo}>
                                            <td>{item.idCanHo}</td>
                                            {/* Thêm fallback '|| 0' vào trước mỗi lệnh .toLocaleString */}
                                            <td>{(item.tongPhiChungCu || 0).toLocaleString('vi-VN')}</td>
                                            <td>{(item.phiDichVu || 0).toLocaleString('vi-VN')}</td>
                                            <td>{(item.phiQuanLy || 0).toLocaleString('vi-VN')}</td>
                                            <td>{(item.tongTienIch || 0).toLocaleString('vi-VN')}</td>
                                            <td className={item.trangThai === 'THÀNH CÔNG' ? 'status-success' : 'status-fail'}>{item.trangThai}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer"><button onClick={() => this.toggleResultModal(false)}>Đóng</button></div>
                </div>
            </div>
        );
    }

    render() {
        const { activeView } = this.state;
        return (
            <div className="receipt-container">
                {/* --- Thanh điều hướng phụ --- */}
                <div className="receipt-actions sub-nav">
                    <button
                        className={activeView === 'main' ? 'active' : ''}
                        onClick={() => this.setView('main')}
                    >
                        Bảng điều khiển
                    </button>
                    <button
                        className={activeView === 'mandatoryList' ? 'active' : ''}
                        onClick={() => this.setView('mandatoryList')}
                    >
                        Lập danh sách Bắt buộc
                    </button>
                    <button>Lập danh sách Tự nguyện</button>
                </div>

                {/* --- Render có điều kiện dựa trên activeView --- */}

                {activeView === 'main' && (
                    <>
                        <div className="receipt-actions">
                            <button onClick={this.toggleAddFeeModal}>Tạo khoản thu</button>
                            <button onClick={this.toggleCollectFeeModal}>Thu phí</button>
                            <button> Xuất báo cáo</button>
                        </div>
                        <div className="receipt-table-container">
                            {/* Bảng chính của bạn sẽ ở đây */}
                        </div>
                    </>
                )}

                {activeView === 'mandatoryList' && <MandatoryFeeList />}

                {/* --- Các modal vẫn hoạt động bình thường --- */}
                {this.state.isAddFeeModalOpen && this.renderAddFeeModal()}
                {this.state.isCollectFeeModalOpen && this.renderCollectFeeModal()}
                {this.state.isResultModalOpen && this.renderPaymentResultModal()}
            </div>
        );
    }
}
export default Receipt;