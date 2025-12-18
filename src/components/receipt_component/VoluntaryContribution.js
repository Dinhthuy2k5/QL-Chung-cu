import React, { useState, useEffect, useCallback } from "react";
import { getToken } from "../../services/localStorageService";
import axios from "axios";
import '../../styles/receipt-styles/VoluntaryContribution.scss';
import { useTranslation } from "react-i18next";

function VoluntaryContribution() {
    const { t } = useTranslation();

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

    const initialCreateForm = { tenKhoanDongGop: '', ngayBatDauThu: '', hanDongGop: '' };
    const [createForm, setCreateForm] = useState(initialCreateForm);

    const initialUpdateForm = {
        idKhoanDongGop: '', idCanHo: '', soTienDongGop: '',
        ngayDongGop: '', hinhThucThanhToan: 'Tiền mặt',
        nguoiNhan: '', ghiChu: ''
    };
    const [updateForm, setUpdateForm] = useState(initialUpdateForm);

    const [listContribution, setListContribution] = useState([]);

    // --- Các hàm xử lý giữ nguyên ---
    const toggleCreateModal = (status) => {
        setCreateModalOpen(status);
        if (!status) setCreateForm(initialCreateForm);
    };
    const toggleUpdateModal = (status) => {
        setUpdateModalOpen(status);
        if (!status) setUpdateForm(initialUpdateForm);
    };

    const handleCreateFormChange = (e) => {
        setCreateForm({ ...createForm, [e.target.name]: e.target.value });
    }
    const handleUpdateFormChange = (e) => {
        setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
    }

    const fetchContributions = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/khoan-dong-gop/all`;

        try {
            const response = await axios.get(apiUrl, config);
            setListContribution(response.data.result.danhSachKhoanDongGop || []);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    }, []);

    useEffect(() => {
        fetchContributions();
    }, [fetchContributions]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/khoan-dong-gop/create`;

        try {
            await axios.post(apiUrl, createForm, config);
            alert(t('voluntary_contribution.alerts.create_success') || "Tạo thành công!");
            toggleCreateModal(false);
            fetchContributions();
        } catch (error) {
            alert(t('voluntary_contribution.alerts.create_fail') || "Tạo thất bại");
        }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/khoan-dong-gop/chi-tiet`;

        try {
            await axios.post(apiUrl, updateForm, config);
            alert(t('voluntary_contribution.alerts.update_success') || "Cập nhật thành công!");
            toggleUpdateModal(false);
        } catch (error) {
            alert(t('voluntary_contribution.alerts.update_fail') || "Cập nhật thất bại");
        }
    }

    // --- Render Modal giữ nguyên, chỉ hiển thị code chính ---
    const renderCreateModal = () => (
        <div className="modal-overlay" onClick={() => toggleCreateModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header"><h3>{t('voluntary_contribution.modal_create.title') || "Tạo đợt đóng góp"}</h3><button onClick={() => toggleCreateModal(false)}>&times;</button></div>
                <form onSubmit={handleCreateSubmit}>
                    <div className="modal-body">
                        <div className="form-group full-width"><label>{t('voluntary_contribution.modal_create.label_name') || "Tên khoản đóng góp"}</label><input name="tenKhoanDongGop" value={createForm.tenKhoanDongGop} onChange={handleCreateFormChange} type="text" required /></div>
                        <div className="form-group"><label>{t('voluntary_contribution.modal_create.label_start_date') || "Ngày bắt đầu"}</label><input name="ngayBatDauThu" value={createForm.ngayBatDauThu} onChange={handleCreateFormChange} type="date" required /></div>
                        <div className="form-group"><label>{t('voluntary_contribution.modal_create.label_due_date') || "Hạn đóng góp"}</label><input name="hanDongGop" value={createForm.hanDongGop} onChange={handleCreateFormChange} type="date" required /></div>
                    </div>
                    <div className="modal-footer"><button type="submit">{t('voluntary_contribution.modal_create.create_button') || "Tạo mới"}</button></div>
                </form>
            </div>
        </div>
    );

    const renderUpdateModal = () => (
        <div className="modal-overlay" onClick={() => toggleUpdateModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header"><h3>{t('voluntary_contribution.modal_update.title') || "Cập nhật đóng góp"}</h3><button onClick={() => toggleUpdateModal(false)}>&times;</button></div>
                <form onSubmit={handleUpdateSubmit}>
                    <div className="modal-body">
                        <div className="form-group"><label>ID Khoản Đóng Góp</label><input name="idKhoanDongGop" value={updateForm.idKhoanDongGop} onChange={handleUpdateFormChange} type="number" required /></div>
                        <div className="form-group"><label>ID Căn Hộ</label><input name="idCanHo" value={updateForm.idCanHo} onChange={handleUpdateFormChange} type="number" required /></div>
                        <div className="form-group"><label>Số Tiền</label><input name="soTienDongGop" value={updateForm.soTienDongGop} onChange={handleUpdateFormChange} type="number" required /></div>
                        <div className="form-group"><label>Ngày Đóng</label><input name="ngayDongGop" value={updateForm.ngayDongGop} onChange={handleUpdateFormChange} type="date" required /></div>
                        <div className="form-group"><label>Hình Thức</label><input name="hinhThucThanhToan" value={updateForm.hinhThucThanhToan} onChange={handleUpdateFormChange} type="text" required /></div>
                        <div className="form-group"><label>Người Nhận</label><input name="nguoiNhan" value={updateForm.nguoiNhan} onChange={handleUpdateFormChange} type="text" required /></div>
                        <div className="form-group full-width"><label>Ghi Chú</label><textarea name="ghiChu" value={updateForm.ghiChu} onChange={handleUpdateFormChange} rows="3" /></div>
                    </div>
                    <div className="modal-footer"><button type="submit">{t('voluntary_contribution.modal_update.update_button') || "Cập nhật"}</button></div>
                </form>
            </div>
        </div>
    );

    return (
        // THAY ĐỔI QUAN TRỌNG: Dùng div.voluntary-container thay vì Fragment <>
        <div className="voluntary-container">
            {isCreateModalOpen && renderCreateModal()}
            {isUpdateModalOpen && renderUpdateModal()}

            <div className="section-header">
                <h2>{t('voluntary_contribution.title') || "QUẢN LÝ ĐÓNG GÓP TỰ NGUYỆN"}</h2>
                <p>{t('voluntary_contribution.description') || "Tạo các đợt vận động đóng góp và ghi nhận thông tin chi tiết."}</p>
            </div>
            <div className="section-actions">
                <button onClick={() => toggleCreateModal(true)}>{t('voluntary_contribution.create_campaign_button') || "Tạo đợt đóng góp"}</button>
                <button onClick={() => toggleUpdateModal(true)}>{t('voluntary_contribution.update_contribution_button') || "Cập nhật đóng góp"}</button>
            </div>

            <div className="receipt-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Khoản Đóng Góp</th>
                            <th>Ngày Tạo</th>
                            <th>Hạn Đóng Góp</th>
                            <th>Số Hộ Đóng</th>
                            <th>Tổng Tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listContribution.length > 0 ? (
                            listContribution.map(item => (
                                <tr key={item.idKhoanDongGop}>
                                    <td>{item.idKhoanDongGop}</td>
                                    <td>{item.tenKhoanDongGop}</td>
                                    <td>{item.ngayTao}</td>
                                    <td>{item.hanDongGop}</td>
                                    <td>{item.soCanHoDongGop}</td>
                                    <td>{(item.tongTienThuDuoc || 0).toLocaleString('vi-VN')} VNĐ</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Chưa có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VoluntaryContribution;