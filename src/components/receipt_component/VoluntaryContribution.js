import React, { useState, useEffect, useCallback } from "react";
import { getToken } from "../../services/localStorageService";
import axios from "axios";
import '../../styles/receipt-styles/VoluntaryContribution.scss';
// 1. Import hook
import { useTranslation } from "react-i18next";

// 2. Chuyển sang Function Component
function VoluntaryContribution() {

    // 3. Lấy hàm 't'
    const { t } = useTranslation();

    // 4. Chuyển đổi state
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

    // 5. Chuyển đổi các hàm
    const toggleCreateModal = (status) => {
        setCreateModalOpen(status);
        if (!status) setCreateForm(initialCreateForm); // Reset form khi đóng
    };
    const toggleUpdateModal = (status) => {
        setUpdateModalOpen(status);
        if (!status) setUpdateForm(initialUpdateForm); // Reset form khi đóng
    };

    const handleCreateFormChange = (e) => {
        setCreateForm({ ...createForm, [e.target.name]: e.target.value });
    }
    const handleUpdateFormChange = (e) => {
        setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
    }

    const fetchContributions = useCallback(async () => {
        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/khoan-dong-gop/all`;

        try {
            const response = await axios.get(apiUrl, config);
            console.log("Lấy thông tin đóng góp thành công");
            setListContribution(response.data.result.danhSachKhoanDongGop || []);
        } catch (error) {
            alert(t('voluntary_contribution.alerts.load_fail'));
        }
    }, [t]); // Thêm 't' vào dependency array

    useEffect(() => {
        fetchContributions();
    }, [fetchContributions]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) { alert(t('alerts.session_expired')); return; }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/khoan-dong-gop/create`;

        try {
            await axios.post(apiUrl, createForm, config);
            alert(t('voluntary_contribution.alerts.create_success'));
            toggleCreateModal(false);
            fetchContributions();
        } catch (error) {
            alert(`${t('voluntary_contribution.alerts.create_fail')}: ${error.response?.data?.message || ''}`);
        }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) { alert(t('alerts.session_expired')); return; }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/khoan-dong-gop/chi-tiet`;

        try {
            await axios.post(apiUrl, updateForm, config);
            alert(t('voluntary_contribution.alerts.update_success'));
            toggleUpdateModal(false);
        } catch (error) {
            alert(`${t('voluntary_contribution.alerts.update_fail')}: ${error.response?.data?.message || ''}`);
        }
    }

    // --- 6. Dịch JSX trong các hàm render ---
    const renderCreateModal = () => {
        return (
            <div className="modal-overlay" onClick={() => toggleCreateModal(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header"><h3>{t('voluntary_contribution.modal_create.title')}</h3><button onClick={() => toggleCreateModal(false)}>&times;</button></div>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="modal-body">
                            <div className="form-group full-width"><label>{t('voluntary_contribution.modal_create.label_name')}</label><input name="tenKhoanDongGop" value={createForm.tenKhoanDongGop} onChange={handleCreateFormChange} type="text" required /></div>
                            <div className="form-group"><label>{t('voluntary_contribution.modal_create.label_start_date')}</label><input name="ngayBatDauThu" value={createForm.ngayBatDauThu} onChange={handleCreateFormChange} type="date" required /></div>
                            <div className="form-group"><label>{t('voluntary_contribution.modal_create.label_due_date')}</label><input name="hanDongGop" value={createForm.hanDongGop} onChange={handleCreateFormChange} type="date" required /></div>
                        </div>
                        <div className="modal-footer"><button type="submit">{t('voluntary_contribution.modal_create.create_button')}</button></div>
                    </form>
                </div>
            </div>
        );
    }

    const renderUpdateModal = () => {
        return (
            <div className="modal-overlay" onClick={() => toggleUpdateModal(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header"><h3>{t('voluntary_contribution.modal_update.title')}</h3><button onClick={() => toggleUpdateModal(false)}>&times;</button></div>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="modal-body">
                            <div className="form-group"><label>{t('voluntary_contribution.modal_update.label_contribution_id')}</label><input name="idKhoanDongGop" value={updateForm.idKhoanDongGop} onChange={handleUpdateFormChange} type="number" required /></div>
                            <div className="form-group"><label>{t('voluntary_contribution.modal_update.label_apartment_id')}</label><input name="idCanHo" value={updateForm.idCanHo} onChange={handleUpdateFormChange} type="number" required /></div>
                            <div className="form-group"><label>{t('voluntary_contribution.modal_update.label_amount')}</label><input name="soTienDongGop" value={updateForm.soTienDongGop} onChange={handleUpdateFormChange} type="number" required /></div>
                            <div className="form-group"><label>{t('voluntary_contribution.modal_update.label_date')}</label><input name="ngayDongGop" value={updateForm.ngayDongGop} onChange={handleUpdateFormChange} type="date" required /></div>
                            <div className="form-group"><label>{t('voluntary_contribution.modal_update.label_payment_method')}</label><input name="hinhThucThanhToan" value={updateForm.hinhThucThanhToan} onChange={handleUpdateFormChange} type="text" required /></div>
                            <div className="form-group"><label>{t('voluntary_contribution.modal_update.label_receiver')}</label><input name="nguoiNhan" value={updateForm.nguoiNhan} onChange={handleUpdateFormChange} type="text" required /></div>
                            <div className="form-group full-width"><label>{t('voluntary_contribution.modal_update.label_notes')}</label><textarea name="ghiChu" value={updateForm.ghiChu} onChange={handleUpdateFormChange} rows="3" /></div>
                        </div>
                        <div className="modal-footer"><button type="submit">{t('voluntary_contribution.modal_update.update_button')}</button></div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <>
            {isCreateModalOpen && renderCreateModal()}
            {isUpdateModalOpen && renderUpdateModal()}

            <div className="section-header">
                <h2>{t('voluntary_contribution.title')}</h2>
                <p>{t('voluntary_contribution.description')}</p>
            </div>
            <div className="section-actions">
                <button onClick={() => toggleCreateModal(true)}>{t('voluntary_contribution.create_campaign_button')}</button>
                <button onClick={() => toggleUpdateModal(true)}>{t('voluntary_contribution.update_contribution_button')}</button>
            </div>

            <div className="receipt-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{t('voluntary_contribution.table_header.id')}</th>
                            <th>{t('voluntary_contribution.table_header.name')}</th>
                            <th>{t('voluntary_contribution.table_header.created_date')}</th>
                            <th>{t('voluntary_contribution.table_header.due_date')}</th>
                            <th>{t('voluntary_contribution.table_header.household_count')}</th>
                            <th>{t('voluntary_contribution.table_header.total_amount')}</th>
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
                            <tr><td colSpan="6">{t('voluntary_contribution.no_data')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default VoluntaryContribution;