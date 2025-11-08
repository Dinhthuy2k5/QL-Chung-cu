import React, { useState, useEffect } from "react";
import '../../styles/resident-styles/EditModal.scss'; // Tạo file style cho modal
import { useTranslation } from "react-i18next"; // Import hook

// Đã chuyển sang Function Component
function EditModal({ show, onClose, onSave, isAddResident, resident }) {

    // Lấy hàm dịch 't'
    const { t } = useTranslation();

    // State nội bộ của modal để quản lý việc thay đổi input
    const [formData, setFormData] = useState({});

    // Tương đương với componentDidUpdate
    useEffect(() => {
        // Khi props 'resident' thay đổi (mở modal), cập nhật lại formData
        // Nếu là "Thêm mới", 'resident' sẽ là null, ta set formData là {}
        setFormData(resident ? { ...resident } : {});
    }, [resident, show]); // Chạy lại mỗi khi 'resident' hoặc 'show' thay đổi

    // Xử lý khi người dùng nhập liệu vào các ô input
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // Xử lý khi nhấn nút Lưu
    const handleSave = () => {
        onSave(formData);
    }

    // Nếu show là false, không render gì cả
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                {/* Sử dụng hàm t() để dịch tiêu đề */}
                <h3>{isAddResident ? t('edit_modal.title_add') : t('edit_modal.title_edit')}</h3>
                <div className="modal-body">
                    {isAddResident && (
                        <div className="form-group">
                            <label>{t('edit_modal.label_cccd')}</label>
                            <input type="text" name="cccd" value={formData.cccd || ''} onChange={handleInputChange} />
                        </div>
                    )}
                    <div className="form-group">
                        <label>{t('edit_modal.label_name')}</label>
                        <input type="text" name="hoVaTen" value={formData.hoVaTen || ''} onChange={handleInputChange} />
                    </div>
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
                        <label>{t('edit_modal.label_address')}</label>
                        <input type="text" name="diaChi" value={formData.diaChi || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('edit_modal.label_phone')}</label>
                        <input type="text" name="sdt" value={formData.sdt || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('edit_modal.label_email')}</label>
                        <input type="text" name="email" value={formData.email || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('edit_modal.label_relationship')}</label>
                        <input type="text" name="quanHe" value={formData.quanHe || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('edit_modal.label_status')}</label>
                        <input type="text" name="trangThai" value={formData.trangThai || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('edit_modal.label_household_head_cccd')}</label>
                        <input type="text" name="cccdChuHo" value={formData.cccdChuHo || ''} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="save-btn" onClick={handleSave}>{t('edit_modal.save_button')}</button>
                    <button className="cancel-btn" onClick={onClose}>{t('edit_modal.cancel_button')}</button>
                </div>
            </div>
        </div>
    );
}

export default EditModal;