import React, { useState, useEffect } from "react";
import '../../styles/resident-styles/EditModal.scss'; // Import file SCSS mới
import { useTranslation } from "react-i18next";

function EditModal({ show, onClose, onSave, isAddResident, resident }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});

    // Reset form data khi modal mở hoặc resident thay đổi
    useEffect(() => {
        if (show) {
            setFormData(resident ? { ...resident } : {});
        }
    }, [resident, show]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSave = () => {
        onSave(formData);
    }

    if (!show) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <h3>{isAddResident ? t('edit_modal.title_add') : t('edit_modal.title_edit')}</h3>

                <div className="modal-body">
                    {/* Nhóm 1: Thông tin định danh */}
                    {isAddResident && (
                        <div className="form-group">
                            <label>{t('edit_modal.label_cccd')}</label>
                            <input type="text" name="cccd" value={formData.cccd || ''} onChange={handleInputChange} placeholder="Nhập CCCD..." />
                        </div>
                    )}
                    <div className="form-group">
                        <label>{t('edit_modal.label_name')}</label>
                        <input type="text" name="hoVaTen" value={formData.hoVaTen || ''} onChange={handleInputChange} placeholder="Nguyễn Văn A" />
                    </div>

                    {/* Nhóm 2: Thông tin cá nhân */}
                    <div className="form-group">
                        <label>{t('edit_modal.label_gender')}</label>
                        <select name="gioiTinh" value={formData.gioiTinh || ''} onChange={handleInputChange}>
                            <option value="" disabled>{t('edit_modal.gender_placeholder')}</option>
                            <option value="NAM">{t('edit_modal.gender_male')}</option>
                            <option value="NỮ">{t('edit_modal.gender_female')}</option>
                            <option value="KHÁC">{t('edit_modal.gender_other')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('edit_modal.label_dob')}</label>
                        <input type="date" name="ngaySinh" value={formData.ngaySinh || ''} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>{t('edit_modal.label_ethnicity')}</label>
                        <input type="text" name="danToc" value={formData.danToc || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('edit_modal.label_religion')}</label>
                        <input type="text" name="tonGiao" value={formData.tonGiao || ''} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>{t('edit_modal.label_nationality')}</label>
                        <input type="text" name="quocTich" value={formData.quocTich || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('edit_modal.label_phone')}</label>
                        <input type="text" name="sdt" value={formData.sdt || ''} onChange={handleInputChange} />
                    </div>

                    {/* Nhóm 3: Thông tin liên lạc - Địa chỉ chiếm 2 cột (full-width) nếu muốn */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>{t('edit_modal.label_address')}</label>
                        <input type="text" name="diaChi" value={formData.diaChi || ''} onChange={handleInputChange} placeholder="Số nhà, đường, phường/xã..." />
                    </div>

                    <div className="form-group">
                        <label>{t('edit_modal.label_email')}</label>
                        <input type="text" name="email" value={formData.email || ''} onChange={handleInputChange} />
                    </div>

                    {/* Nhóm 4: Hộ khẩu */}
                    <div className="form-group">
                        <label>{t('edit_modal.label_household_head_cccd')}</label>
                        <input type="text" name="cccdChuHo" value={formData.cccdChuHo || ''} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>{t('edit_modal.label_relationship')}</label>
                        <input type="text" name="quanHe" value={formData.quanHe || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('edit_modal.label_status')}</label>
                        <input type="text" name="trangThai" value={formData.trangThai || ''} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>{t('edit_modal.cancel_button')}</button>
                    <button className="save-btn" onClick={handleSave}>{t('edit_modal.save_button')}</button>
                </div>
            </div>
        </div>
    );
}

export default EditModal;