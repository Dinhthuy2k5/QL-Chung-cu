import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { getToken } from '../../../services/localStorageService';
import { useTranslation } from 'react-i18next';
// Reuse CSS
import '../../../styles/receipt-styles/CreateFeeWizard.scss';

const CollectFeeWizard = ({ onClose }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [idThoiGianThu, setIdThoiGianThu] = useState('');
    const [feeList, setFeeList] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    // New state for result
    const [paymentResult, setPaymentResult] = useState(null);

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

            // Set result state to show success screen
            setPaymentResult(response.data.result);
            setStep(3); // Move to result step
        } catch (error) {
            alert("Lỗi khi xác nhận thanh toán: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) => (val || 0).toLocaleString('vi-VN') + ' đ';

    // Helper to reset and close
    const handleCloseFinal = () => {
        setPaymentResult(null);
        onClose();
    };

    const modalContent = (
        <div className="modal-overlay">
            <div className="modal-content wizard-modal" style={step === 3 ? { maxWidth: '450px', borderRadius: '16px' } : {}}>
                {/* Header (Hidden on Step 3 for cleaner look, optional) */}
                {step !== 3 && (
                    <div className="modal-header">
                        <h3>
                            {step === 1 && t('collect_fee_wizard.step_1_title')}
                            {step === 2 && t('collect_fee_wizard.step_2_title')}
                        </h3>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>
                )}

                {/* Body */}
                <div className="modal-body" style={step === 3 ? { padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' } : {}}>

                    {/* STEP 1: Enter Time ID */}
                    {step === 1 && (
                        <div className="form-group full-width">
                            <label>{t('collect_fee_wizard.label_time_id')}</label>
                            <input
                                type="text"
                                value={idThoiGianThu}
                                onChange={e => setIdThoiGianThu(e.target.value)}
                                autoFocus
                                placeholder="VD: 102025"
                            />
                        </div>
                    )}

                    {/* STEP 2: Select Apartments */}
                    {step === 2 && (
                        <div className="utility-input-container">
                            <div className="table-wrapper">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>{t('collect_fee_wizard.table_apt_id')}</th>
                                            <th>{t('collect_fee_wizard.table_total')}</th>
                                            <th>{t('collect_fee_wizard.table_status')}</th>
                                            <th style={{ textAlign: 'center', width: '100px' }}>
                                                Xác nhận
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
                                                        fontWeight: 'bold', fontSize: '0.9rem'
                                                    }}>
                                                        {isPaid ? t('collect_fee_wizard.status_paid') : t('collect_fee_wizard.status_unpaid')}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            disabled={isPaid}
                                                            checked={selectedIds.includes(item.idCanHo)}
                                                            onChange={() => handleCheckboxChange(item.idCanHo)}
                                                            style={{ transform: 'scale(1.2)', cursor: isPaid ? 'not-allowed' : 'pointer', accentColor: '#007bff' }}
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

                    {/* STEP 3: Result (REDESIGNED - COMPACT & HORIZONTAL) */}
                    {step === 3 && paymentResult && (
                        <>
                            {/* Icon Checkmark with Glow */}
                            <div style={{
                                width: '70px', height: '70px',
                                background: 'linear-gradient(135deg, #00f2c3, #009879)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2.5rem', color: 'white',
                                marginBottom: '20px',
                                boxShadow: '0 0 20px rgba(0, 242, 195, 0.4)'
                            }}>
                                ✓
                            </div>

                            {/* Title */}
                            <h4 style={{
                                color: '#ffffff',
                                fontSize: '1.2rem',
                                marginBottom: '30px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: '700'
                            }}>
                                Thanh toán hoàn tất!
                            </h4>

                            {/* Stats Grid (Horizontal) */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px',
                                width: '100%'
                            }}>
                                {/* Box Thành Công */}
                                <div style={{
                                    background: 'rgba(30, 58, 138, 0.4)', // Dark Blue tint
                                    border: '1px solid rgba(0, 242, 195, 0.3)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                    <span style={{ fontSize: '0.8rem', color: '#a0aec0', textTransform: 'uppercase', marginBottom: '5px' }}>Thành công</span>
                                    <strong style={{ fontSize: '2rem', color: '#00f2c3', lineHeight: '1' }}>
                                        {paymentResult.successCount}
                                    </strong>
                                    {/* Bottom border stripe */}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#00f2c3' }}></div>
                                </div>

                                {/* Box Thất Bại */}
                                <div style={{
                                    background: 'rgba(76, 29, 149, 0.2)', // Dark Purple tint
                                    border: '1px solid rgba(253, 93, 147, 0.3)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                    <span style={{ fontSize: '0.8rem', color: '#a0aec0', textTransform: 'uppercase', marginBottom: '5px' }}>Thất bại</span>
                                    <strong style={{ fontSize: '2rem', color: '#fd5d93', lineHeight: '1' }}>
                                        {paymentResult.failCount}
                                    </strong>
                                    {/* Bottom border stripe */}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#fd5d93' }}></div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer" style={step === 3 ? { borderTop: 'none', paddingTop: 0, paddingBottom: '30px', justifyContent: 'center' } : {}}>
                    {step === 1 && (
                        <button onClick={handleFetchList} disabled={loading}>
                            {loading ? "Đang tải..." : t('collect_fee_wizard.btn_fetch_list')}
                        </button>
                    )}

                    {step === 2 && (
                        <>
                            <button className="secondary-btn" onClick={() => setStep(1)} style={{ marginRight: 'auto' }}>
                                Quay lại
                            </button>
                            <button onClick={handleConfirmPayment} disabled={loading || selectedIds.length === 0}>
                                {loading ? "Đang xử lý..." : t('collect_fee_wizard.btn_confirm_selected', { count: selectedIds.length })}
                            </button>
                        </>
                    )}

                    {/* Step 3: Big Close Button */}
                    {step === 3 && (
                        <button onClick={handleCloseFinal} style={{
                            width: '100%',
                            margin: 0,
                            padding: '12px',
                            fontSize: '1rem',
                            background: '#4361ee', // Primary Blue
                            borderRadius: '8px',
                            boxShadow: '0 4px 15px rgba(67, 97, 238, 0.4)'
                        }}>
                            Đóng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default CollectFeeWizard;