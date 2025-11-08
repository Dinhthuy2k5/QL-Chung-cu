import React, { useState } from "react";
import '../../styles/resident-styles/TemporaryAddressModal.scss';
import { useTranslation } from "react-i18next"; // 1. Import hook

// 2. Chuyển sang Function Component, nhận props
function TemporaryAddressModal({ show, onClose, onSubmit }) {

    // 3. Lấy hàm t
    const { t } = useTranslation();

    // 4. Chuyển đổi state
    // Sử dụng một state object duy nhất để dễ quản lý
    const initialState = {
        cccd: '',
        hoVaTen: '',
        idCanHo: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        lyDo: ''
    };
    const [formData, setFormData] = useState(initialState);

    // 5. Chuyển đổi hàm
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault(); // Ngăn form reload lại trang
        onSubmit(formData);     // Gửi dữ liệu từ state lên component cha
        setFormData(initialState); // Reset form sau khi submit
    }

    if (!show) {
        return null;
    }

    // 6. Dịch toàn bộ văn bản trong JSX
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{t('temp_address_modal.title')}</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <form className="absence-form" onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="cccd">{t('temp_address_modal.label_cccd')}</label>
                            <input
                                type="text"
                                id="cccd"
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
                                id="hoVaTen"
                                name="hoVaTen"
                                value={formData.hoVaTen}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="idCanHo">{t('temp_address_modal.label_apartment_id')}</label>
                            <input
                                type="text"
                                id="idCanHo"
                                name="idCanHo"
                                value={formData.idCanHo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ngayBatDau">{t('temp_address_modal.label_start_date')}</label>
                            <input
                                type="date"
                                id="ngayBatDau"
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
                                id="ngayKetThuc"
                                name="ngayKetThuc"
                                value={formData.ngayKetThuc}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lyDo">{t('temp_address_modal.label_reason')}</label>
                            <textarea
                                id="lyDo"
                                name="lyDo"
                                rows="4"
                                value={formData.lyDo}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="submit-btn">{t('temp_address_modal.button_confirm')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TemporaryAddressModal;