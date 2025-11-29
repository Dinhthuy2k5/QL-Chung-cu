import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../../../services/localStorageService';
import { useTranslation } from 'react-i18next';
import '../../../styles/receipt-styles/Receipt.scss';

const CollectFeeWizard = ({ onClose, onResult }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [idThoiGianThu, setIdThoiGianThu] = useState('');
    const [feeList, setFeeList] = useState([]); // Danh sách lấy từ API
    const [selectedIds, setSelectedIds] = useState([]); // Danh sách ID các căn hộ được chọn

    // --- BƯỚC 1: LẤY DANH SÁCH CĂN HỘ & TRẠNG THÁI ---
    const handleFetchList = async () => {
        if (!idThoiGianThu) return alert(t('mandatory_fee_list.alert_time_id_required'));

        setLoading(true);
        const token = getToken();
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            // Gọi API lấy danh sách phí chi tiết (như MandatoryFeeList)
            const res = await axios.get(`http://localhost:8080/qlcc/phi/phi-bat-buoc/${idThoiGianThu}`, config);

            if (res.data.result && res.data.result.danhSachTongThanhToan) {
                // Lọc ra những căn hộ CHƯA nộp tiền để hiển thị cho người dùng chọn
                // Hoặc hiển thị tất cả nhưng disable những người đã nộp
                setFeeList(res.data.result.danhSachTongThanhToan);
                setStep(2);
            }
        } catch (error) {
            alert("Không tìm thấy dữ liệu cho kỳ thu này.");
        } finally {
            setLoading(false);
        }
    };

    // --- XỬ LÝ CHECKBOX ---
    const handleCheckboxChange = (idCanHo) => {
        setSelectedIds(prev => {
            if (prev.includes(idCanHo)) {
                return prev.filter(id => id !== idCanHo); // Bỏ chọn
            } else {
                return [...prev, idCanHo]; // Chọn thêm
            }
        });
    };

    // --- BƯỚC 2: GỬI DANH SÁCH ĐÃ CHỌN ---
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

            // Gọi callback để hiển thị kết quả ở component cha (Receipt.js hoặc MandatoryFeeTab.js)
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
            <div className="modal-content large">
                <div className="modal-header">
                    <h3>{step === 1 ? t('collect_fee_wizard.step_1_title') : t('collect_fee_wizard.step_2_title')}</h3>
                    <button onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {/* BƯỚC 1: NHẬP ID THỜI GIAN */}
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

                    {/* BƯỚC 2: DANH SÁCH CHECKBOX */}
                    {step === 2 && (
                        <div className="table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="selection-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }}>
                                            {/* Checkbox chọn tất cả (tùy chọn) */}
                                        </th>
                                        <th>{t('collect_fee_wizard.table_apt_id')}</th>
                                        <th>{t('collect_fee_wizard.table_total')}</th>
                                        <th>{t('collect_fee_wizard.table_status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeList.map(item => {
                                        const isPaid = item.trangThai === 'DA_THANH_TOAN';
                                        return (
                                            <tr key={item.idCanHo} style={{ opacity: isPaid ? 0.6 : 1 }}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        disabled={isPaid} // Không cho chọn nếu đã nộp
                                                        checked={selectedIds.includes(item.idCanHo)}
                                                        onChange={() => handleCheckboxChange(item.idCanHo)}
                                                        style={{ transform: 'scale(1.5)', cursor: isPaid ? 'not-allowed' : 'pointer' }}
                                                    />
                                                </td>
                                                <td>Căn hộ {item.idCanHo}</td>
                                                <td>{formatCurrency(item.tongPhi)}</td>
                                                <td style={{ color: isPaid ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                                                    {isPaid ? t('collect_fee_wizard.status_paid') : t('collect_fee_wizard.status_unpaid')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
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