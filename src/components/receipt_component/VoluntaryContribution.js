import React from "react";
import { getToken } from "../../services/localStorageService";
import axios from "axios";
import '../../styles/receipt-styles/VoluntaryContribution.scss'

class VoluntaryContribution extends React.Component {

    state = {
        // Modals
        isCreateModalOpen: false,
        isUpdateModalOpen: false,

        // Form "Tạo đợt đóng góp"
        createForm: {
            tenKhoanDongGop: '',
            ngayBatDauThu: '',
            hanDongGop: ''
        },
        // Form "Cập nhật chi tiết"
        updateForm: {
            idKhoanDongGop: '',
            idCanHo: '',
            soTienDongGop: '',
            ngayDongGop: '',
            hinhThucThanhToan: 'Tiền mặt', // Giá trị mặc định
            nguoiNhan: '',
            ghiChu: ''
        },

        // Dữ liệu
        listContribution: []

    }

    //  Modal Toggles 
    toggleCreateModal = (status) => this.setState({ isCreateModalOpen: status });
    toggleUpdateModal = (status) => this.setState({ isUpdateModalOpen: status });

    //  Form Handlers 
    handleCreateFormChange = (e) => {
        this.setState({ createForm: { ...this.state.createForm, [e.target.name]: e.target.value } });
    }

    handleUpdateFormChange = (e) => {
        this.setState({ updateForm: { ...this.state.updateForm, [e.target.name]: e.target.value } });
    }

    // API call
    fetchContributions = async () => {

        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/khoan-dong-gop/all`;

        try {
            const response = await axios.get(apiUrl, config);
            console.log("Lấy thông tin đóng góp thành công")
            this.setState({ listContribution: response.data.result.danhSachKhoanDongGop })

        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Không thể lấy thông tin đóng góp.'}`);
        }

    }

    componentDidMount() {
        this.fetchContributions(); // Tải danh sách khi component được render
    }


    handleCreateSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/khoan-dong-gop/create`;

        const data = this.state.createForm;

        try {
            await axios.post(apiUrl, data, config);
            alert("Tạo đợt đóng góp thành công!");
            this.toggleCreateModal(false);
            this.fetchContributions(); // Tải lại danh sách
        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Không thể tạo đợt đóng góp.'}`);
        }
    }

    handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/khoan-dong-gop/chi-tiet`;

        const data = this.state.updateForm;

        try {
            await axios.post(apiUrl, data, config);
            alert("Cập nhật chi tiết đóng góp thành công!");
            this.toggleUpdateModal(false);

        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Không thể cập nhật chi tiết đóng góp.'}`);
        }

    }

    // Render Functions
    renderCreateModal() {
        const { createForm } = this.state;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>Tạo Đợt Đóng góp</h3><button onClick={() => this.toggleCreateModal(false)}>&times;</button></div>
                    <form onSubmit={this.handleCreateSubmit}>
                        <div className="modal-body">
                            <div className="form-group full-width"><label>Tên khoản đóng góp</label><input name="tenKhoanDongGop" value={createForm.tenKhoanDongGop} onChange={this.handleCreateFormChange} type="text" required /></div>
                            <div className="form-group"><label>Ngày bắt đầu thu</label><input name="ngayBatDauThu" value={createForm.ngayBatDauThu} onChange={this.handleCreateFormChange} type="date" required /></div>
                            <div className="form-group"><label>Hạn đóng góp</label><input name="hanDongGop" value={createForm.hanDongGop} onChange={this.handleCreateFormChange} type="date" required /></div>
                        </div>
                        <div className="modal-footer"><button type="submit">Tạo</button></div>
                    </form>
                </div>
            </div>
        );
    }

    renderUpdateModal() {
        const { updateForm } = this.state;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>Cập nhật Chi tiết Đóng góp</h3><button onClick={() => this.toggleUpdateModal(false)}>&times;</button></div>
                    <form onSubmit={this.handleUpdateSubmit}>
                        <div className="modal-body">
                            <div className="form-group"><label>ID Khoản đóng góp</label><input name="idKhoanDongGop" value={updateForm.idKhoanDongGop} onChange={this.handleUpdateFormChange} type="number" required /></div>
                            <div className="form-group"><label>ID Căn hộ</label><input name="idCanHo" value={updateForm.idCanHo} onChange={this.handleUpdateFormChange} type="number" required /></div>
                            <div className="form-group"><label>Số tiền đóng góp</label><input name="soTienDongGop" value={updateForm.soTienDongGop} onChange={this.handleUpdateFormChange} type="number" required /></div>
                            <div className="form-group"><label>Ngày đóng góp</label><input name="ngayDongGop" value={updateForm.ngayDongGop} onChange={this.handleUpdateFormChange} type="date" required /></div>
                            <div className="form-group"><label>Hình thức thanh toán</label><input name="hinhThucThanhToan" value={updateForm.hinhThucThanhToan} onChange={this.handleUpdateFormChange} type="text" required /></div>
                            <div className="form-group"><label>Người nhận</label><input name="nguoiNhan" value={updateForm.nguoiNhan} onChange={this.handleUpdateFormChange} type="text" required /></div>
                            <div className="form-group full-width"><label>Ghi chú</label><textarea name="ghiChu" value={updateForm.ghiChu} onChange={this.handleUpdateFormChange} rows="3" /></div>
                        </div>
                        <div className="modal-footer"><button type="submit">Cập nhật</button></div>
                    </form>
                </div>
            </div>
        );
    }

    render() {
        const { listContribution } = this.state;
        return (
            <>
                {this.state.isCreateModalOpen && this.renderCreateModal()}
                {this.state.isUpdateModalOpen && this.renderUpdateModal()}

                <div className="section-header">
                    <h2>Quản lý Đóng góp Tự nguyện</h2>
                    <p>Tạo các đợt vận động đóng góp và ghi nhận thông tin chi tiết.</p>
                </div>
                <div className="section-actions">
                    <button onClick={() => this.toggleCreateModal(true)}>Tạo đợt đóng góp</button>
                    <button onClick={() => this.toggleUpdateModal(true)}>Cập nhật đóng góp</button>
                </div>

                <div className="receipt-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên khoản đóng góp</th>
                                <th>Ngày tạo</th>
                                <th>Hạn đóng góp</th>
                                <th>Số hộ đóng góp</th>
                                <th>Tổng tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listContribution.length > 0 ? (
                                listContribution.map(item => (
                                    <tr key={item.idKhoanDongGop}>
                                        <td>{item.idKhoanDongGop}</td>
                                        <td>{item.tenKhoanDongGop}</td>
                                        <td>{item.ngayThu}</td>
                                        <td>{item.hanThu}</td>
                                        <td>{item.soCanHoDongGop}</td>
                                        <td>{item.tongTienThuDuoc.toLocaleString('vi-VN')} VNĐ</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6">Chưa có đợt đóng góp nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

export default VoluntaryContribution;