import React, { useState } from "react";
import '../../styles/resident-styles/TemporaryModal.scss'
import { useTranslation } from "react-i18next";

function TemporaryAddressModal({ show, onClose, onSubmit }) {
    const { t } = useTranslation();

    const initialState = {
        cccd: '',
        hoVaTen: '',
        idCanHo: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        lyDo: ''
    };
    const [formData, setFormData] = useState(initialState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(initialState);
    }

    if (!show) return null;

    return (
        <div className="modal-overlay my-custom-modal-layout" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <h3>{t('temp_address_modal.title')}</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Hàng 1: CCCD và Họ tên */}
                        <div className="form-group">
                            <label htmlFor="cccd">{t('temp_address_modal.label_cccd')}</label>
                            <input
                                type="text"
                                name="cccd"
                                value={formData.cccd}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hoVaTen">{t('temp_address_modal.label_name')}</label>
                            <input
                                type="text"
                                name="hoVaTen"
                                value={formData.hoVaTen}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* ID Căn hộ */}
                        <div className="form-group">
                            <label htmlFor="idCanHo">{t('temp_address_modal.label_apartment_id')}</label>
                            <input
                                type="text"
                                name="idCanHo"
                                value={formData.idCanHo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Ngày tháng */}
                        <div className="form-group">
                            <label htmlFor="ngayBatDau">{t('temp_address_modal.label_start_date')}</label>
                            <input
                                type="date"
                                name="ngayBatDau"
                                value={formData.ngayBatDau}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ngayKetThuc">{t('temp_address_modal.label_end_date')}</label>
                            <input
                                type="date"
                                name="ngayKetThuc"
                                value={formData.ngayKetThuc}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Lý do */}
                        <div className="form-group">
                            <label htmlFor="lyDo">{t('temp_address_modal.label_reason')}</label>
                            <textarea
                                name="lyDo"
                                rows="3"
                                value={formData.lyDo}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="submit-btn">
                            {t('temp_address_modal.button_confirm')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TemporaryAddressModal;