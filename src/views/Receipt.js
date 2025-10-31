import React from "react";
import '../styles/receipt-styles/Receipt.scss'
import { getToken } from "../services/localStorageService";
import axios from "axios";
import MandatoryFeeList from "../components/receipt_component/MandatoryFeeList";
import VoluntaryContribution from "../components/receipt_component/VoluntaryContribution";
import ApartmentPaymentHistory from "../components/receipt_component/ApartmentPaymentHistory";

class Receipt extends React.Component {
    state = {

        activeTab: 'mandatory', // 'mandatory' hoặc 'voluntary'

        // Modal cho Phí bắt buộc
        isAddFeeModalOpen: false,       // Modal "Tạo khoản thu"
        isCollectFeeModalOpen: false,   // Modal "Thu phí"
        isResultModalOpen: false,       // Modal kết quả thanh toán
        isMandatoryListModalOpen: false, // Modal "Lập danh sách bắt buộc"

        // Modal cho Phí tự nguyện
        isVoluntaryCreateModalOpen: false,
        isVoluntaryUpdateModalOpen: false,

        isCalculateFeeModalOpen: false, // State cho modal "Tính tổng thanh toán"
        calculationForm: { // State cho form
            idThoiGianThu: ''
        },
        calculationResult: null, // State lưu kết quả tính tổng

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

    setActiveTab = (tab) => this.setState({ activeTab: tab });

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
    toggleMandatoryListModal = (status) => this.setState({ isMandatoryListModalOpen: status });
    toggleVoluntaryCreateModal = (status) => this.setState({ isVoluntaryCreateModalOpen: status });
    toggleVoluntaryUpdateModal = (status) => this.setState({ isVoluntaryUpdateModalOpen: status });

    toggleCalculateFeeModal = (status) => {
        // Reset form và kết quả khi đóng modal
        if (!status) {
            this.setState({
                calculationForm: { idThoiGianThu: '' },
                calculationResult: null
            });
        }
        this.setState({ isCalculateFeeModalOpen: status });
    };

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

    // Hàm xử lí input form tính tổng thanh toán
    handleCalculationFormChange = (event) => {
        this.setState({ calculationForm: { idThoiGianThu: event.target.value } });
    };

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

    handleTotalFeeSubmit = async (event) => {
        event.preventDefault();

        const { idThoiGianThu } = this.state.calculationForm;
        if (!idThoiGianThu) {
            alert("Vui lòng nhập ID Thời gian thu.");
            return;
        }

        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const data = { idThoiGianThu: idThoiGianThu };
        const apiUrl = `http://localhost:8080/qlcc/phi/tong-thanh-toan/batch`;

        try {
            console.log(`Submitting to ${apiUrl} with data:`, data);
            const response = await axios.post(apiUrl, data, config);
            console.log("Tính tổng thanh toán thành công:", response.data);
            // Lưu kết quả vào state để hiển thị
            this.setState({ calculationResult: response.data.result });
            alert("Đã tính tổng phí cho tất cả căn hộ thành công!");
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Lỗi không xác định.";
            console.error("Lỗi khi tính tổng phí:", errorMessage);
            alert(`Tính tổng phí thất bại: ${errorMessage}`);
        }


    }

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

    // Hàm render xác nhận thanh toán
    renderCollectFeeModal() {
        const { collectFeeForm } = this.state;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>Thu phí Bắt buộc</h3><button onClick={() => this.toggleCollectFeeModal(false)}>&times;</button></div>
                    <form onSubmit={this.handleCollectFeeSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>ID Thời gian thu </label>
                                <textarea name="idThoiGianThu" value={collectFeeForm.idThoiGianThu} onChange={this.handleCollectFeeFormChange} rows="4" placeholder="Ví dụ: 102025" required />
                            </div>
                            <div className="form-group">
                                <label>Danh sách ID Căn hộ đã nộp</label>
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

    // --- HÀM RENDER MỚI CHO MODAL "LẬP DANH SÁCH" ---
    renderMandatoryListModal() {
        return (
            <div className="modal-overlay">
                {/* Dùng class "extra-large" để modal rộng hơn */}
                <div className="modal-content extra-large">
                    <div className="modal-header">
                        <h3>Danh sách Khoản thu Bắt buộc</h3>
                        <button onClick={() => this.toggleMandatoryListModal(false)}>&times;</button>
                    </div>
                    <div className="modal-body full-width-body">
                        {/* Component MandatoryFeeList giờ nằm trong modal */}
                        <MandatoryFeeList />
                    </div>
                </div>
            </div>
        );
    }

    // --- HÀM RENDER MỚI CHO MODAL TÍNH TỔNG ---
    renderCalculateFeeModal() {
        const { calculationForm, calculationResult } = this.state;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>Tính tổng phí hàng loạt</h3><button onClick={() => this.toggleCalculateFeeModal(false)}>&times;</button></div>
                    <form onSubmit={this.handleTotalFeeSubmit}>
                        <div className="modal-body">
                            <div className="form-group full-width">
                                <label>ID Thời gian thu (VD: 102025)</label>
                                <p className="form-help-text">Nhập ID kỳ thu mà bạn muốn hệ thống tự động tính toán tổng phí (chung cư, xe, tiện ích) cho TẤT CẢ các căn hộ.</p>
                                <input name="idThoiGianThu" value={calculationForm.idThoiGianThu} onChange={this.handleCalculationFormChange} type="text" required />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" >Bắt đầu Tính toán</button>
                        </div>

                    </form>

                    {/* Hiển thị kết quả sau khi gọi API */}
                    {
                        calculationResult && (
                            <div className="modal-result-summary">
                                <h4>Kết quả tính toán:</h4>
                                <p><strong>Tổng số căn hộ:</strong> {calculationResult.totalCanHo}</p>
                                <p className="success"><strong>Tính thành công:</strong> {calculationResult.successCount}</p>
                                <p className="fail"><strong>Tính thất bại:</strong> {calculationResult.failCount}</p>
                                <p><i>(Chi tiết các căn hộ thất bại đã được ghi lại ở backend)</i></p>
                            </div>
                        )
                    }
                </div >
            </div >
        );
    }

    render() {
        const { activeTab } = this.state;
        return (
            <div className="receipt-container">
                {/* --- Render tất cả các modal ở đây --- */}
                {this.state.isAddFeeModalOpen && this.renderAddFeeModal()}
                {this.state.isCollectFeeModalOpen && this.renderCollectFeeModal()}
                {this.state.isResultModalOpen && this.renderPaymentResultModal()}
                {this.state.isMandatoryListModalOpen && this.renderMandatoryListModal()}
                {this.state.isCalculateFeeModalOpen && this.renderCalculateFeeModal()}

                {/* --- GIAO DIỆN TAB --- */}
                <div className="receipt-tabs">
                    <button
                        className={`tab-button ${activeTab === 'mandatory' ? 'active' : ''}`}
                        onClick={() => this.setActiveTab('mandatory')}
                    >
                        Quản lý Khoản thu Bắt buộc
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'voluntary' ? 'active' : ''}`}
                        onClick={() => this.setActiveTab('voluntary')}
                    >
                        Quản lý Đóng góp Tự nguyện
                    </button>
                    <button className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => this.setActiveTab('history')}>
                        Tra cứu Lịch sử Căn hộ
                    </button>
                </div>

                {/* --- NỘI DUNG CỦA TAB --- */}
                <div className="tab-content">
                    {activeTab === 'mandatory' && (
                        <>
                            <div className="section-header">
                                <h2>Quản lý Khoản thu Bắt buộc</h2>
                                <p>Tạo các khoản phí hàng tháng và ghi nhận thanh toán của cư dân.</p>
                            </div>
                            <div className="section-actions">
                                <button onClick={() => this.toggleAddFeeModal(true)}>1. Tạo Khoản thu</button>
                                <button onClick={() => this.toggleCalculateFeeModal(true)}>2. Tính tổng thanh toán</button>
                                <button onClick={() => this.toggleCollectFeeModal(true)}>3. Xác nhận Thanh toán</button>
                                <button onClick={() => this.toggleMandatoryListModal(true)}>4. Xem Danh sách Khoản thu</button>
                                {/* <button className="secondary-btn">Xuất Báo cáo</button> */}
                            </div>
                        </>
                    )}

                    {activeTab === 'voluntary' && (
                        <VoluntaryContribution />
                    )}
                    {activeTab === 'history' && <ApartmentPaymentHistory />}
                </div>

            </div>



        );
    }
}
export default Receipt;