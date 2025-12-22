import React, { useState, useEffect, useCallback } from "react";
import { getToken } from "../../services/localStorageService";
import axios from "axios";
import '../../styles/receipt-styles/VoluntaryContribution.scss';
import { useTranslation } from "react-i18next";

function VoluntaryContribution({ cache, setCache }) {
    const { t } = useTranslation();

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

    // ... (Giữ nguyên các state form: initialCreateForm, createForm, initialUpdateForm, updateForm) ...
    const initialCreateForm = { tenKhoanDongGop: '', ngayBatDauThu: '', hanDongGop: '' };
    const [createForm, setCreateForm] = useState(initialCreateForm);

    const initialUpdateForm = {
        idKhoanDongGop: '', idCanHo: '', soTienDongGop: '',
        ngayDongGop: '', hinhThucThanhToan: 'Tiền mặt',
        nguoiNhan: '', ghiChu: ''
    };
    const [updateForm, setUpdateForm] = useState(initialUpdateForm);
    const [listContribution, setListContribution] = useState(cache || []);

    // ... (Giữ nguyên các hàm xử lý: toggleModal, handleFormChange, fetchContributions, handleSubmit...) ...
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
            const data = response.data.result.danhSachKhoanDongGop || [];
            setListContribution(data);
            if (setCache) setCache(data);
        } catch (error) { console.error(error); }
    }, [setCache]);

    useEffect(() => {
        if (!cache) fetchContributions();
    }, [cache, fetchContributions]);

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
            fetchContributions();
        } catch (error) {
            alert(t('voluntary_contribution.alerts.update_fail') || "Cập nhật thất bại");
        }
    }

    // ... (Giữ nguyên phần render Modal: renderCreateModal, renderUpdateModal) ...
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
        <div className="voluntary-container">
            {isCreateModalOpen && renderCreateModal()}
            {isUpdateModalOpen && renderUpdateModal()}

            {/* --- 1. PHẦN THAO TÁC NGHIỆP VỤ (ĐỒNG BỘ VỚI BẮT BUỘC) --- */}
            <div className="quick-actions-panel">
                <h3>Thao tác nghiệp vụ</h3>
                <div className="action-buttons">
                    <button className="btn-action create" onClick={() => toggleCreateModal(true)}>
                        <span className="icon">✚</span> {t('voluntary_contribution.create_campaign_button') || "Tạo đợt đóng góp"}
                    </button>
                    <button className="btn-action update" onClick={() => toggleUpdateModal(true)}>
                        <span className="icon">✎</span> {t('voluntary_contribution.update_contribution_button') || "Cập nhật đóng góp"}
                    </button>
                </div>
            </div>

            {/* --- 2. PHẦN BẢNG DỮ LIỆU --- */}
            <div className="receipt-table-container">
                {/* Thêm tiêu đề nhỏ cho bảng nếu cần */}
                <h4>
                    Danh sách các đợt vận động
                </h4>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Khoản Đóng Góp</th>
                            <th>Ngày Thu</th>
                            <th>Hạn Đóng Góp</th>
                            <th>Số Hộ Đóng</th>
                            <th>Tổng Tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listContribution.length > 0 ? (
                            listContribution.map(item => (
                                <tr key={item.idKhoanDongGop}>
                                    <td className="highlight-id">#{item.idKhoanDongGop}</td>
                                    <td style={{ fontWeight: 600, color: 'white' }}>{item.tenKhoanDongGop}</td>
                                    <td>{item.ngayThu
                                        ? new Date(item.ngayThu).toLocaleDateString('vi-VN')
                                        : '---'}</td>
                                    <td>{item.hanThu
                                        ? new Date(item.hanThu).toLocaleDateString('vi-VN')
                                        : '---'}</td>
                                    <td style={{ textAlign: 'center' }}>{item.soCanHoDongGop}</td>
                                    <td style={{ color: '#00f2c3', fontWeight: 'bold' }}>
                                        {(item.tongTienThuDuoc || 0).toLocaleString('vi-VN')} VNĐ
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', fontStyle: 'italic', opacity: 0.7 }}>Chưa có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VoluntaryContribution;