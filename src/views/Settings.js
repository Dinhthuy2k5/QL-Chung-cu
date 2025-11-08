import React, { useState, useEffect } from "react";
import '../styles/settings-styles/Settings.scss';
import axios from "axios";
import { getToken } from "../services/localStorageService";
// 1. Import hook
import { useTranslation } from "react-i18next";

// 2. Chuyển sang Function Component
function Settings() {

    // 3. Lấy hàm 't'
    const { t } = useTranslation();

    // 4. Chuyển đổi state
    const [formData, setFormData] = useState({
        tenChungCu: 'Chung cư BlueMoon',
        diaChi: '123 Đường Văn Phú, Hà Đông, Hà Nội',
        sdt: '024 1234 5678',
        email: 'bql.bluemoon@example.com'
    });
    const [isLoading, setIsLoading] = useState(false);

    // 5. Chuyển đổi componentDidMount sang useEffect
    useEffect(() => {
        // (Bạn có thể bỏ comment phần này khi API của bạn sẵn sàng)
        // const fetchSettings = async () => {
        //     const token = getToken();
        //     if (!token) {
        //         console.error("Không tìm thấy token");
        //         return;
        //     }
        //     const config = { headers: { 'Authorization': `Bearer ${token}` } };
        //     try {
        //         const response = await axios.get('http://localhost:8080/qlcc/settings', config);
        //         const settings = response.data.result;
        //         setFormData({
        //             tenChungCu: settings.tenChungCu,
        //             diaChi: settings.diaChi,
        //             sdt: settings.sdt,
        //             email: settings.email,
        //         });
        //     } catch (error) {
        //         console.error(t('settings_page.alert_load_fail'), error);
        //     }
        // };
        // fetchSettings();
    }, [t]); // Thêm 't' vào dependency array

    // 6. Chuyển đổi các hàm class
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSaveSettings = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            setIsLoading(false);
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const data = formData; // Dữ liệu đã có trong state formData
        const apiUrl = `http://localhost:8080/qlcc/settings/update`;

        try {
            console.log("Saving settings:", data);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập gọi API

            alert(t('settings_page.alert_save_success'));
            setIsLoading(false);
        } catch (error) {
            const errorMsg = error.response?.data?.message || t('settings_page.alert_save_fail');
            alert(`${t('user_profile.alert_update_fail')}: ${errorMsg}`);
            setIsLoading(false);
        }
    }

    // 7. Trả về JSX (đã dịch)
    return (
        <div className="settings-container">
            <div className="settings-panel">
                <div className="panel-header">
                    <h2>{t('settings_page.title')}</h2>
                    <p>{t('settings_page.description')}</p>
                </div>

                <form className="settings-form" onSubmit={handleSaveSettings}>
                    <div className="form-group">
                        <label htmlFor="tenChungCu">{t('settings_page.label_name')}</label>
                        <input
                            type="text"
                            name="tenChungCu"
                            id="tenChungCu"
                            value={formData.tenChungCu}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="diaChi">{t('settings_page.label_address')}</label>
                        <input
                            type="text"
                            name="diaChi"
                            id="diaChi"
                            value={formData.diaChi}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label htmlFor="sdt">{t('settings_page.label_phone')}</label>
                            <input
                                type="text"
                                name="sdt"
                                id="sdt"
                                value={formData.sdt}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{t('settings_page.label_email')}</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="save-btn" disabled={isLoading}>
                            {isLoading ? t('settings_page.saving_button') : t('settings_page.save_button')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;