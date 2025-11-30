import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../../services/localStorageService';
import { useTranslation } from 'react-i18next';
import '../../../styles/receipt-styles/CreateFeeWizard.scss'; // Tái sử dụng style hoặc tạo file riêng

const CreateFeeWizard = ({ onClose, onRefresh }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [apartments, setApartments] = useState([]);

    // --- STATE DỮ LIỆU ---
    const [idThoiGianThu, setIdThoiGianThu] = useState('');

    const [aptFee, setAptFee] = useState({ phiDichVu: '', phiQuanLy: '' });
    const [parkingFee, setParkingFee] = useState({ xeMay: '', oto: '' });

    // Dữ liệu tiện ích: { "ID_CAN_HO": { dien: 0, nuoc: 0, net: 0 } }
    const [utilities, setUtilities] = useState({});

    // --- LẤY DANH SÁCH CĂN HỘ (Cho bước 4) ---
    useEffect(() => {
        const fetchApartments = async () => {
            const token = getToken();
            try {
                const res = await axios.get('http://localhost:8080/qlcc/can-ho', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.data.result) {
                    setApartments(res.data.result);
                    // Khởi tạo state tiện ích cho từng căn hộ
                    const initUtils = {};
                    res.data.result.forEach(apt => {
                        initUtils[apt.idCanHo] = { tienDien: '', tienNuoc: '', tienInternet: '' };
                    });
                    setUtilities(initUtils);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách căn hộ:", error);
            }
        };
        fetchApartments();
    }, []);

    // --- XỬ LÝ INPUT TIỆN ÍCH ---
    const handleUtilityChange = (idCanHo, field, value) => {
        setUtilities(prev => ({
            ...prev,
            [idCanHo]: { ...prev[idCanHo], [field]: value }
        }));
    };

    // --- HÀM SUBMIT CUỐI CÙNG ---
    const handleFinalSubmit = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn tạo và tính toán phí?")) return;

        setLoading(true);
        const token = getToken();
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            // 1. Gửi Phí Chung Cư (Batch)
            await axios.post('http://localhost:8080/qlcc/phi/phi-chung-cu/batch', {
                idThoiGianThu,
                phiDichVuPerM2: aptFee.phiDichVu,
                phiQuanLyPerM2: aptFee.phiQuanLy
            }, config);

            // 2. Gửi Phí Gửi Xe (Batch)
            await axios.post('http://localhost:8080/qlcc/phi/phi-gui-xe/batch', {
                idThoiGianThu,
                tienXeMayPerXe: parkingFee.xeMay,
                tienXeOtoPerXe: parkingFee.oto
            }, config);

            // 3. Gửi Phí Tiện Ích (Loop từng căn hộ)
            // Lưu ý: Nếu backend có API batch cho tiện ích thì tốt hơn, nếu không phải loop
            const utilityPromises = apartments.map(apt => {
                const utilData = utilities[apt.idCanHo];
                // Chỉ gửi nếu có nhập dữ liệu (hoặc gửi 0 tùy logic backend)
                return axios.post('http://localhost:8080/qlcc/phi/tien-ich', {
                    idCanHo: apt.idCanHo,
                    idThoiGianThu,
                    tienDien: utilData.tienDien || 0,
                    tienNuoc: utilData.tienNuoc || 0,
                    tienInternet: utilData.tienInternet || 0
                }, config);
            });
            await Promise.all(utilityPromises);

            // 4. Gọi API Tính Tổng Thanh Toán
            await axios.post('http://localhost:8080/qlcc/phi/tong-thanh-toan/batch', {
                idThoiGianThu
            }, config);

            alert(t('create_fee_wizard.success_message'));
            onRefresh(); // Tải lại danh sách bên ngoài nếu cần
            onClose();   // Đóng modal

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER TỪNG BƯỚC ---
    return (
        <div className="modal-overlay">
            <div className="modal-content wizard-modal">
                <div className="modal-header">
                    <h3>Tạo Khoản Thu (Bước {step}/4)</h3>
                    <button onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {/* BƯỚC 1: THỜI GIAN */}
                    {step === 1 && (
                        <div className="form-group full-width">
                            <label>{t('create_fee_wizard.label_time_id')}</label>
                            <input type="text" value={idThoiGianThu} onChange={e => setIdThoiGianThu(e.target.value)} autoFocus />
                        </div>
                    )}

                    {/* BƯỚC 2: PHÍ CHUNG CƯ */}
                    {step === 2 && (
                        <>
                            <h4>{t('create_fee_wizard.step_2_title')}</h4>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>{t('create_fee_wizard.label_service')}</label>
                                    <input type="number" value={aptFee.phiDichVu} onChange={e => setAptFee({ ...aptFee, phiDichVu: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>{t('create_fee_wizard.label_management')}</label>
                                    <input type="number" value={aptFee.phiQuanLy} onChange={e => setAptFee({ ...aptFee, phiQuanLy: e.target.value })} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* BƯỚC 3: PHÍ GỬI XE */}
                    {step === 3 && (
                        <>
                            <h4>{t('create_fee_wizard.step_3_title')}</h4>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>{t('create_fee_wizard.label_bike')}</label>
                                    <input type="number" value={parkingFee.xeMay} onChange={e => setParkingFee({ ...parkingFee, xeMay: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>{t('create_fee_wizard.label_car')}</label>
                                    <input type="number" value={parkingFee.oto} onChange={e => setParkingFee({ ...parkingFee, oto: e.target.value })} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* BƯỚC 4: PHÍ TIỆN ÍCH (BẢNG NHẬP LIỆU) */}
                    {step === 4 && (
                        <div className="utility-input-container">
                            <h4>{t('create_fee_wizard.step_4_title')}</h4>

                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            {/* Các class CSS sẽ tự động căn chỉnh padding và border */}
                                            <th>{t('create_fee_wizard.table_apt_id')}</th>
                                            <th>{t('create_fee_wizard.table_electric')}</th>
                                            <th>{t('create_fee_wizard.table_water')}</th>
                                            <th>{t('create_fee_wizard.table_internet')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {apartments.map((apt) => (
                                            <tr key={apt.idCanHo}>
                                                <td>
                                                    {apt.soNha}
                                                    <span>(ID: {apt.idCanHo})</span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="utility-input"
                                                        value={utilities[apt.idCanHo]?.tienDien || ''}
                                                        onChange={(e) => handleUtilityChange(apt.idCanHo, 'tienDien', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="utility-input"
                                                        value={utilities[apt.idCanHo]?.tienNuoc || ''}
                                                        onChange={(e) => handleUtilityChange(apt.idCanHo, 'tienNuoc', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="utility-input"
                                                        value={utilities[apt.idCanHo]?.tienInternet || ''}
                                                        onChange={(e) => handleUtilityChange(apt.idCanHo, 'tienInternet', e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER ĐIỀU HƯỚNG */}
                <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                    {step > 1 ? (
                        <button className="secondary-btn" onClick={() => setStep(step - 1)}>{t('create_fee_wizard.btn_back')}</button>
                    ) : <div></div>}

                    {step < 4 ? (
                        <button onClick={() => {
                            if (step === 1 && !idThoiGianThu) return alert("Vui lòng nhập ID thời gian");
                            setStep(step + 1)
                        }}>{t('create_fee_wizard.btn_next')}</button>
                    ) : (
                        <button onClick={handleFinalSubmit} disabled={loading}>
                            {loading ? "Đang xử lý..." : t('create_fee_wizard.btn_submit')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateFeeWizard;