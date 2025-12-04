import React, { useState } from "react";
import '../../styles/resident-styles/MyNewModal.scss'
import { useTranslation } from "react-i18next";

function TemporaryAbsenceModal({ show, onClose, onSubmit }) {
    const { t } = useTranslation();

    const [cccd, setCccd] = useState('');
    const [ngayBatDau, setNgayBatDau] = useState('');
    const [ngayKetThuc, setNgayKetThuc] = useState('');
    const [lyDo, setLyDo] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cccd') setCccd(value);
        if (name === 'ngayBatDau') setNgayBatDau(value);
        if (name === 'ngayKetThuc') setNgayKetThuc(value);
        if (name === 'lyDo') setLyDo(value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ cccd, ngayBatDau, ngayKetThuc, lyDo });
        // Reset
        setCccd(''); setNgayBatDau(''); setNgayKetThuc(''); setLyDo('');
    }

    if (!show) return null;

    return (
        <div className="modal-overlay my-custom-modal-layout" onClick={onClose}>
            {/* stopPropagation để click vào modal không bị đóng */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <h3>{t('temp_absence_modal.title')}</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
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
                                placeholder="0123456789..."
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
                                rows="3"
                                value={lyDo}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="submit-btn">
                            {t('temp_absence_modal.button_confirm')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TemporaryAbsenceModal;