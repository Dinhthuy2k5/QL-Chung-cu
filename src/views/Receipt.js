import React from "react";
import '../styles/receipt-styles/Receipt.scss'
import { getToken } from "../services/localStorageService";
import axios from "axios";
import MandatoryFeeList from "../components/receipt_component/MandatoryFeeList";
import VoluntaryContribution from "../components/receipt_component/VoluntaryContribution";
import ApartmentPaymentHistory from "../components/receipt_component/ApartmentPaymentHistory";

import { withTranslation } from "react-i18next";

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
        const { t } = this.props; // Lấy t

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        let apiUrl = '';
        let data = {};
        const { loaiKhoanThu, addFeeForm } = this.state;

        // Xây dựng URL và data dựa trên loại khoản thu được chọn
        switch (loaiKhoanThu) {
            case "fee_type_utility":
                apiUrl = `http://localhost:8080/qlcc/phi/tien-ich`;
                data = {
                    idCanHo: addFeeForm.idCanHo,
                    idThoiGianThu: addFeeForm.idThoiGianThu,
                    tienDien: addFeeForm.tienDien,
                    tienNuoc: addFeeForm.tienNuoc,
                    tienInternet: addFeeForm.tienInternet,
                };
                break;
            case "fee_type_apartment":
                apiUrl = `http://localhost:8080/qlcc/phi/phi-chung-cu/batch`;
                data = {
                    idThoiGianThu: addFeeForm.idThoiGianThu,
                    phiDichVuPerM2: addFeeForm.phiDichVuPerM2,
                    phiQuanLyPerM2: addFeeForm.phiQuanLyPerM2,
                };
                break;
            case "fee_type_parking":
                apiUrl = `http://localhost:8080/qlcc/phi/phi-gui-xe/batch`;
                data = {
                    idThoiGianThu: addFeeForm.idThoiGianThu,
                    tienXeMayPerXe: addFeeForm.tienXeMayPerXe,
                    tienXeOtoPerXe: addFeeForm.tienXeOtoPerXe,
                };
                break;
            default:
                alert(t('receipt_page.alerts.invalid_fee_type'));
                return;
        }

        try {
            console.log(`Submitting to ${apiUrl} with data:`, data);
            const response = await axios.post(apiUrl, data, config);
            console.log("Tạo khoản thu thành công:", response.data);
            alert(t('receipt_page.alerts.create_success'));
            this.toggleAddFeeModal(false);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Lỗi không xác định.";
            console.error("Lỗi khi tạo khoản thu:", errorMessage);
            alert(t('receipt_page.alerts.create_fail', { error: errorMessage }));
        }
    }


    handleCollectFeeSubmit = async (event) => {
        event.preventDefault();
        const { t } = this.props;
        const { idThoiGianThu, danhSachIdCanHo } = this.state.collectFeeForm;
        if (!idThoiGianThu || !danhSachIdCanHo) {
            alert(t('receipt_page.alerts.collect_missing_info'));
            return;
        }

        // Chuyển đổi chuỗi "1, 2, 3" thành mảng các số [1, 2, 3]
        const idArray = danhSachIdCanHo.split(',')
            .map(id => Number(id.trim()))
            .filter(id => !isNaN(id) && id > 0);

        if (idArray.length === 0) {
            alert(t('receipt_page.alerts.collect_invalid_ids'));
            return;
        }

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
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
            alert(t('receipt_page.alerts.collect_fail', { error: errorMessage }));
        }
    };

    handleTotalFeeSubmit = async (event) => {
        event.preventDefault();
        const { t } = this.props;

        const { idThoiGianThu } = this.state.calculationForm;
        if (!idThoiGianThu) {
            alert(t('receipt_page.alerts.calculate_missing_id'));
            return;
        }

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
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
            alert(t('receipt_page.alerts.calculate_success'));
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Lỗi không xác định.";
            console.error("Lỗi khi tính tổng phí:", errorMessage);
            alert(t('receipt_page.alerts.calculate_fail', { error: errorMessage }));
        }


    }

    // Hàm render modal tạo khoản thu
    renderAddFeeModal() {
        const { addFeeForm, loaiKhoanThu } = this.state;
        const { t } = this.props;
        // Tạo đối tượng feeTypes để lưu cả key và giá trị dịch
        const feeTypes = {
            "fee_type_apartment": t('receipt_page.modal_create_fee.fee_type_apartment'),
            "fee_type_parking": t('receipt_page.modal_create_fee.fee_type_parking'),
            "fee_type_utility": t('receipt_page.modal_create_fee.fee_type_utility')
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>{t('receipt_page.modal_create_fee.title')}</h3><button onClick={() => this.toggleAddFeeModal(false)}>&times;</button></div>
                    <form onSubmit={this.handleAddFeeSubmit}>
                        <div className="modal-body">
                            <div className="form-group full-width">
                                <label>{t('receipt_page.modal_create_fee.label_fee_type')}</label>
                                <select name="loaiKhoanThu" value={loaiKhoanThu} onChange={this.handleLoaiKhoanThuChange} required>
                                    <option value="" disabled>{t('receipt_page.modal_create_fee.placeholder_fee_type')}</option>
                                    {/* Lặp qua Object.keys để dùng key cho value và value cho hiển thị */}
                                    {Object.keys(feeTypes).map(key => <option key={key} value={key}>{feeTypes[key]}</option>)}
                                </select>

                            </div>
                            {/* --- Render có điều kiện cho Phí tiện ích --- */}
                            {loaiKhoanThu === "fee_type_utility" && (
                                <>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_apartment_id')}</label><input name="idCanHo" value={addFeeForm.idCanHo} onChange={this.handleAddFeeFormChange} type="text" required /></div>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_time_id')}</label><input name="idThoiGianThu" value={addFeeForm.idThoiGianThu} onChange={this.handleAddFeeFormChange} type="text" required /></div>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_electricity')}</label><input name="tienDien" value={addFeeForm.tienDien} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_water')}</label><input name="tienNuoc" value={addFeeForm.tienNuoc} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_internet')}</label><input name="tienInternet" value={addFeeForm.tienInternet} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                </>
                            )}

                            {/* --- Render có điều kiện cho Phí chung cư --- */}
                            {loaiKhoanThu === "fee_type_apartment" && (
                                <>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_time_id')}</label><input name="idThoiGianThu" value={addFeeForm.idThoiGianThu} onChange={this.handleAddFeeFormChange} type="text" required /></div>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_service_fee')}</label><input name="phiDichVuPerM2" value={addFeeForm.phiDichVuPerM2} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_management_fee')}</label><input name="phiQuanLyPerM2" value={addFeeForm.phiQuanLyPerM2} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                </>
                            )}
                            {/* --- Render có điều kiện cho Phí gửi xe --- */}
                            {loaiKhoanThu === "fee_type_parking" && (
                                <>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_time_id')}</label><input name="idThoiGianThu" value={addFeeForm.idThoiGianThu} onChange={this.handleAddFeeFormChange} type="text" required /></div>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_motorcycle_fee')}</label><input name="tienXeMayPerXe" value={addFeeForm.tienXeMayPerXe} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                    <div className="form-group"><label>{t('receipt_page.modal_create_fee.label_car_fee')}</label><input name="tienXeOtoPerXe" value={addFeeForm.tienXeOtoPerXe} onChange={this.handleAddFeeFormChange} type="number" required /></div>
                                </>
                            )}

                        </div>


                        <div className="modal-footer"><button type="submit">{t('receipt_page.modal_create_fee.create_button')}</button></div>
                    </form>
                </div>
            </div>
        );
    };

    // Hàm render xác nhận thanh toán
    renderCollectFeeModal() {
        const { collectFeeForm } = this.state;
        const { t } = this.props;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>{t('receipt_page.modal_collect_fee.title')}</h3><button onClick={() => this.toggleCollectFeeModal(false)}>&times;</button></div>
                    <form onSubmit={this.handleCollectFeeSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>{t('receipt_page.modal_collect_fee.label_time_id')} </label>
                                <textarea name="idThoiGianThu" value={collectFeeForm.idThoiGianThu} onChange={this.handleCollectFeeFormChange} rows="4" placeholder="Ví dụ: 102025" required />
                            </div>
                            <div className="form-group">
                                <label>{t('receipt_page.modal_collect_fee.label_apartment_ids')}</label>
                                <textarea name="danhSachIdCanHo" value={collectFeeForm.danhSachIdCanHo} onChange={this.handleCollectFeeFormChange} rows="4" placeholder="Ví dụ: 1, 2, 5" required />
                            </div>
                        </div>
                        <div className="modal-footer"><button type="submit">{t('receipt_page.modal_collect_fee.confirm_button')}</button></div>
                    </form>
                </div>
            </div>
        );
    }


    // --- HÀM MỚI ĐỂ RENDER MODAL KẾT QUẢ ---
    renderPaymentResultModal() {
        const { paymentResult } = this.state;
        const { t } = this.props;
        if (!paymentResult) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content large">
                    <div className="modal-header"><h3>{t('receipt_page.modal_payment_result.title')}</h3><button onClick={() => this.toggleResultModal(false)}>&times;</button></div>
                    <div className="modal-body">
                        <div className="result-summary">
                            <div className="summary-item"><span>{t('receipt_page.modal_payment_result.total_apartments')}</span><strong>{paymentResult.totalCanHo}</strong></div>
                            <div className="summary-item success"><span>{t('receipt_page.modal_payment_result.success')}</span><strong>{paymentResult.successCount}</strong></div>
                            <div className="summary-item fail"><span>{t('receipt_page.modal_payment_result.failed')}</span><strong>{paymentResult.failCount}</strong></div>
                            <div className="summary-item total"><span>{t('receipt_page.modal_payment_result.total_collected')}</span><strong>{paymentResult.tongPhiAll.toLocaleString('vi-VN')} VNĐ</strong></div>
                        </div>
                        <div className="result-table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t('receipt_page.modal_payment_result.header_apartment_id')}</th>
                                        <th>{t('receipt_page.modal_payment_result.header_total_apartment_fee')}</th>
                                        <th>{t('receipt_page.modal_payment_result.header_service_fee')}</th>
                                        <th>{t('receipt_page.modal_payment_result.header_management_fee')}</th> {/* Sửa: phiQuanLy */}
                                        <th>{t('receipt_page.modal_payment_result.header_utility_fee')}</th>
                                        <th>{t('receipt_page.modal_payment_result.header_status')}</th>
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
                    <div className="modal-footer"><button onClick={() => this.toggleResultModal(false)}>{t('receipt_page.modal_payment_result.close_button')}</button></div>
                </div>
            </div>
        );
    }

    // --- HÀM RENDER MỚI CHO MODAL "LẬP DANH SÁCH" ---
    renderMandatoryListModal() {
        const { t } = this.props;
        return (
            <div className="modal-overlay">
                {/* Dùng class "extra-large" để modal rộng hơn */}
                <div className="modal-content extra-large">
                    <div className="modal-header">
                        <h3>{t('receipt_page.modal_mandatory_list.title')}</h3>
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
        const { t } = this.props;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>{t('receipt_page.modal_calculate_fee.title')}</h3><button onClick={() => this.toggleCalculateFeeModal(false)}>&times;</button></div>
                    <form onSubmit={this.handleTotalFeeSubmit}>
                        <div className="modal-body">
                            <div className="form-group full-width">
                                <label>{t('receipt_page.modal_calculate_fee.label_time_id')}</label>
                                <p className="form-help-text">{t('receipt_page.modal_calculate_fee.help_text')}</p>
                                <input name="idThoiGianThu" value={calculationForm.idThoiGianThu} onChange={this.handleCalculationFormChange} type="text" required />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" >{t('receipt_page.modal_calculate_fee.start_button')}</button>
                        </div>

                    </form>

                    {/* Hiển thị kết quả sau khi gọi API */}
                    {
                        calculationResult && (
                            <div className="modal-result-summary">
                                <h4>{t('receipt_page.modal_calculate_fee.result_title')}</h4>
                                <p><strong>{t('receipt_page.modal_calculate_fee.result_total')}</strong> {calculationResult.totalCanHo}</p>
                                <p className="success"><strong>{t('receipt_page.modal_calculate_fee.result_success')}</strong> {calculationResult.successCount}</p>
                                <p className="fail"><strong>{t('receipt_page.modal_calculate_fee.result_failed')}</strong> {calculationResult.failCount}</p>
                                <p><i>{t('receipt_page.modal_calculate_fee.result_note')}</i></p>
                            </div>
                        )
                    }
                </div >
            </div >
        );
    }

    render() {
        const { activeTab } = this.state;
        const { t } = this.props;
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
                        {t('receipt_page.tab_mandatory')}
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'voluntary' ? 'active' : ''}`}
                        onClick={() => this.setActiveTab('voluntary')}
                    >
                        {t('receipt_page.tab_voluntary')}
                    </button>
                    <button className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => this.setActiveTab('history')}>
                        {t('receipt_page.tab_history')}
                    </button>
                </div>

                {/* --- NỘI DUNG CỦA TAB --- */}
                <div className="tab-content">
                    {activeTab === 'mandatory' && (
                        <>
                            <div className="section-header">
                                <h2>{t('receipt_page.mandatory_title')}</h2>
                                <p>{t('receipt_page.mandatory_desc')}</p>
                            </div>
                            <div className="section-actions">
                                <button onClick={() => this.toggleAddFeeModal(true)}>{t('receipt_page.mandatory_btn_create')}</button>
                                <button onClick={() => this.toggleCalculateFeeModal(true)}>{t('receipt_page.mandatory_btn_calculate')}</button>
                                <button onClick={() => this.toggleCollectFeeModal(true)}>{t('receipt_page.mandatory_btn_collect')}</button>
                                <button onClick={() => this.toggleMandatoryListModal(true)}>{t('receipt_page.mandatory_btn_list')}</button>
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
export default withTranslation()(Receipt);