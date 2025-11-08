import React, { useState } from "react";
import '../../styles/resident-styles/TemporaryAbsenceModal.scss';
import { useTranslation } from "react-i18next"; // 1. Import hook

// 2. Chuyển sang Function Component, nhận props
function TemporaryAbsenceModal({ show, onClose, onSubmit }) {

    // 3. Lấy hàm t
    const { t } = useTranslation();

    // 4. Chuyển đổi state
    const [cccd, setCccd] = useState('');
    const [ngayBatDau, setNgayBatDau] = useState('');
    const [ngayKetThuc, setNgayKetThuc] = useState('');
    const [lyDo, setLyDo] = useState('');

    // 5. Chuyển đổi hàm
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'cccd') setCccd(value);
        if (name === 'ngayBatDau') setNgayBatDau(value);
        if (name === 'ngayKetThuc') setNgayKetThuc(value);
        if (name === 'lyDo') setLyDo(value);
    }

    const handleSubmit = (event) => {
        event.preventDefault(); // Ngăn form reload lại trang
        // Gửi dữ liệu từ state lên component cha
        onSubmit({ cccd, ngayBatDau, ngayKetThuc, lyDo });
        // Reset form sau khi submit
        setCccd('');
        setNgayBatDau('');
        setNgayKetThuc('');
        setLyDo('');
    }

    if (!show) {
        return null;
    }

    // 6. Dịch toàn bộ văn bản trong JSX
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{t('temp_absence_modal.title')}</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <form className="absence-form" onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="cccd">{t('temp_absence_modal.label_cccd')}</label>
                            <input
                                type="text"
                                id="cccd"
                                name="cccd"
                                value={cccd}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ngayBatDau">{t('temp_absence_modal.label_start_date')}</label>
                            <input
                                type="date"
                                id="ngayBatDau"
                                name="ngayBatDau"
                                value={ngayBatDau}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ngayKetThuc">{t('temp_absence_modal.label_end_date')}</label>
                            <input
                                type="date"
                                id="ngayKetThuc"
                                name="ngayKetThuc"
                                value={ngayKetThuc}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lyDo">{t('temp_absence_modal.label_reason')}</label>
                            <textarea
                                id="lyDo"
                                name="lyDo"
                                rows="4"
                                value={lyDo}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="submit-btn">{t('temp_absence_modal.button_confirm')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TemporaryAbsenceModal;