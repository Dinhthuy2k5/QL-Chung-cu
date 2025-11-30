import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../../../services/localStorageService';
import { useTranslation } from 'react-i18next';
// Chúng ta sẽ tái sử dụng file CSS của CreateFeeWizard để đồng bộ giao diện
import '../../../styles/receipt-styles/CreateFeeWizard.scss';

const CollectFeeWizard = ({ onClose, onResult }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [idThoiGianThu, setIdThoiGianThu] = useState('');
    const [feeList, setFeeList] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const handleFetchList = async () => {
        if (!idThoiGianThu) return alert(t('mandatory_fee_list.alert_time_id_required'));

        setLoading(true);
        const token = getToken();
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            const res = await axios.get(`http://localhost:8080/qlcc/phi/phi-bat-buoc/${idThoiGianThu}`, config);
            if (res.data.result && res.data.result.danhSachTongThanhToan) {
                setFeeList(res.data.result.danhSachTongThanhToan);
                setStep(2);
            }
        } catch (error) {
            alert("Không tìm thấy dữ liệu cho kỳ thu này.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (idCanHo) => {
        setSelectedIds(prev => {
            if (prev.includes(idCanHo)) {
                return prev.filter(id => id !== idCanHo);
            } else {
                return [...prev, idCanHo];
            }
        });
    };

    const handleConfirmPayment = async () => {
        if (selectedIds.length === 0) {
            return alert(t('collect_fee_wizard.alert_select_required'));
        }

        setLoading(true);
        const token = getToken();
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            const data = { danhSachIdCanHo: selectedIds };
            const apiUrl = `http://localhost:8080/qlcc/phi/thanh-toan/${idThoiGianThu}`;
            const response = await axios.post(apiUrl, data, config);
            onResult(response.data.result);
            onClose();
        } catch (error) {
            alert("Lỗi khi xác nhận thanh toán: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) => (val || 0).toLocaleString('vi-VN') + ' đ';

    return (
        <div className="modal-overlay">
            {/* Sử dụng class wizard-modal để có kích thước nhỏ gọn giống CreateFeeWizard */}
            <div className="modal-content wizard-modal">
                <div className="modal-header">
                    <h3>{step === 1 ? t('collect_fee_wizard.step_1_title') : t('collect_fee_wizard.step_2_title')}</h3>
                    <button onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {step === 1 && (
                        <div className="form-group full-width">
                            <label>{t('collect_fee_wizard.label_time_id')}</label>
                            <input
                                type="text"
                                value={idThoiGianThu}
                                onChange={e => setIdThoiGianThu(e.target.value)}
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="utility-input-container">
                            {/* Không cần tiêu đề h4 nếu muốn tối giản, hoặc thêm vào nếu thích */}
                            <div className="table-wrapper">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            {/* Cột 1: Căn hộ */}
                                            <th>{t('collect_fee_wizard.table_apt_id')}</th>
                                            {/* Cột 2: Tổng tiền */}
                                            <th>{t('collect_fee_wizard.table_total')}</th>
                                            {/* Cột 3: Trạng thái */}
                                            <th>{t('collect_fee_wizard.table_status')}</th>
                                            {/* Cột 4: Checkbox (Xác nhận thanh toán) */}
                                            <th style={{ textAlign: 'center', width: '150px' }}>
                                                Xác nhận thanh toán
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feeList.map(item => {
                                            const isPaid = item.trangThai === 'DA_THANH_TOAN';
                                            return (
                                                <tr key={item.idCanHo} style={{ opacity: isPaid ? 0.5 : 1 }}>
                                                    <td>Căn hộ {item.idCanHo}</td>
                                                    <td>{formatCurrency(item.tongPhi)}</td>
                                                    <td style={{
                                                        color: isPaid ? '#28a745' : '#dc3545',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {isPaid ? t('collect_fee_wizard.status_paid') : t('collect_fee_wizard.status_unpaid')}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            disabled={isPaid}
                                                            checked={selectedIds.includes(item.idCanHo)}
                                                            onChange={() => handleCheckboxChange(item.idCanHo)}
                                                            style={{
                                                                transform: 'scale(1.5)',
                                                                cursor: isPaid ? 'not-allowed' : 'pointer',
                                                                accentColor: '#007bff' // Màu xanh cho checkbox
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {step === 1 ? (
                        <button onClick={handleFetchList} disabled={loading}>
                            {loading ? "Đang tải..." : t('collect_fee_wizard.btn_fetch_list')}
                        </button>
                    ) : (
                        <>
                            <button className="secondary-btn" onClick={() => setStep(1)} style={{ marginRight: 'auto' }}>
                                Quay lại
                            </button>
                            <button onClick={handleConfirmPayment} disabled={loading || selectedIds.length === 0}>
                                {loading ? "Đang xử lý..." : t('collect_fee_wizard.btn_confirm_selected', { count: selectedIds.length })}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectFeeWizard;