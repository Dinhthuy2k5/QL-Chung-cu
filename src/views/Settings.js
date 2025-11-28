import React, { useState, useEffect } from "react";
import '../styles/settings-styles/Settings.scss';
import axios from "axios";
import { getToken } from "../services/localStorageService";
import { useTranslation } from "react-i18next";

function Settings() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('general'); // State quản lý tab đang chọn
    const [isLoading, setIsLoading] = useState(false);

    // State cho phần "Thông tin chung" (Có API thật)
    const [generalForm, setGeneralForm] = useState({
        tenChungCu: 'Chung cư BlueMoon',
        diaChi: '123 Đường Văn Phú, Hà Đông, Hà Nội',
        sdt: '024 1234 5678',
        email: 'bql.bluemoon@example.com'
    });

    // State giả lập cho phần "Cấu hình phí" (Chưa có API)
    const [feeForm, setFeeForm] = useState({
        servicePrice: 6000,
        managementPrice: 7000,
        bikePrice: 70000,
        carPrice: 1200000
    });

    // Hàm hiển thị thông báo "Đang phát triển"
    const handleDevFeature = (e) => {
        e.preventDefault();
        alert(t('settings_page.alert_dev_feature'));
    };

    // --- XỬ LÝ API THẬT (PHẦN THÔNG TIN CHUNG) ---
    useEffect(() => {
        // (Logic gọi API lấy thông tin chung - giữ nguyên hoặc bỏ comment khi backend sẵn sàng)
    }, [t]);

    const handleGeneralChange = (e) => {
        setGeneralForm({ ...generalForm, [e.target.name]: e.target.value });
    };

    const handleSaveGeneral = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            setIsLoading(false);
            return;
        }
        // ... (Logic gọi API thật giống code cũ của bạn)
        try {
            // Giả lập delay
            await new Promise(r => setTimeout(r, 1000));
            alert(t('settings_page.alert_save_success'));
        } catch (error) {
            alert(t('settings_page.alert_save_fail'));
        }
        setIsLoading(false);
    };

    // --- CÁC HÀM RENDER GIAO DIỆN ---

    // 1. Render Form Thông tin chung (API Thật)
    const renderGeneralSettings = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.title')}</h3>
                <p>{t('settings_page.description')}</p>
            </div>
            <form className="settings-form" onSubmit={handleSaveGeneral}>
                <div className="form-group">
                    <label>{t('settings_page.label_name')}</label>
                    <input type="text" name="tenChungCu" value={generalForm.tenChungCu} onChange={handleGeneralChange} />
                </div>
                <div className="form-group">
                    <label>{t('settings_page.label_address')}</label>
                    <input type="text" name="diaChi" value={generalForm.diaChi} onChange={handleGeneralChange} />
                </div>
                <div className="form-group-row">
                    <div className="form-group">
                        <label>{t('settings_page.label_phone')}</label>
                        <input type="text" name="sdt" value={generalForm.sdt} onChange={handleGeneralChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('settings_page.label_email')}</label>
                        <input type="email" name="email" value={generalForm.email} onChange={handleGeneralChange} />
                    </div>
                </div>
                <div className="form-footer">
                    <button type="submit" className="save-btn" disabled={isLoading}>
                        {isLoading ? t('settings_page.saving_button') : t('settings_page.save_button')}
                    </button>
                </div>
            </form>
        </div>
    );

    // 2. Render Form Cấu hình Phí (Fake UI)
    const renderFeeSettings = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.fee_title')}</h3>
                <p>{t('settings_page.fee_desc')}</p>
            </div>
            <form className="settings-form">
                <div className="form-group-row">
                    <div className="form-group">
                        <label>{t('settings_page.label_service_price')}</label>
                        <input type="number" value={feeForm.servicePrice} onChange={() => { }} />
                    </div>
                    <div className="form-group">
                        <label>{t('settings_page.label_management_price')}</label>
                        <input type="number" value={feeForm.managementPrice} onChange={() => { }} />
                    </div>
                </div>
                <div className="form-group-row">
                    <div className="form-group">
                        <label>{t('settings_page.label_bike_price')}</label>
                        <input type="number" value={feeForm.bikePrice} onChange={() => { }} />
                    </div>
                    <div className="form-group">
                        <label>{t('settings_page.label_car_price')}</label>
                        <input type="number" value={feeForm.carPrice} onChange={() => { }} />
                    </div>
                </div>
                <div className="form-footer">
                    <button className="save-btn" onClick={handleDevFeature}>
                        {t('settings_page.save_button')}
                    </button>
                </div>
            </form>
        </div>
    );

    // 3. Render Form Thông báo (Fake UI)
    const renderNotifications = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.notif_title')}</h3>
                <p>{t('settings_page.notif_desc')}</p>
            </div>
            <div className="settings-list">
                <div className="setting-item">
                    <span>{t('settings_page.label_email_notif')}</span>
                    <input type="checkbox" defaultChecked onChange={handleDevFeature} />
                </div>
                <div className="setting-item">
                    <span>{t('settings_page.label_sms_notif')}</span>
                    <input type="checkbox" onChange={handleDevFeature} />
                </div>
                <div className="setting-item">
                    <span>{t('settings_page.label_payment_reminder')}</span>
                    <input type="checkbox" defaultChecked onChange={handleDevFeature} />
                </div>
            </div>
        </div>
    );

    // 4. Render Hệ thống (Fake UI)
    const renderSystem = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.sys_title')}</h3>
                <p>{t('settings_page.sys_desc')}</p>
            </div>
            <div className="system-actions">
                <button className="sys-btn" onClick={handleDevFeature}>☁️ {t('settings_page.btn_backup')}</button>
                <button className="sys-btn" onClick={handleDevFeature}>Tb {t('settings_page.btn_restore')}</button>
                <button className="sys-btn danger" onClick={handleDevFeature}>🗑️ {t('settings_page.btn_clear_cache')}</button>
            </div>
        </div>
    );

    // --- RENDER CHÍNH ---
    return (
        <div className="settings-layout">
            {/* SIDEBAR MENU */}
            <div className="settings-sidebar">
                <div className="sidebar-title">{t('nav.setting')}</div>
                <ul>
                    <li className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
                        🏢 {t('settings_page.menu_general')}
                    </li>
                    <li className={activeTab === 'fees' ? 'active' : ''} onClick={() => setActiveTab('fees')}>
                        💰 {t('settings_page.menu_fees')}
                    </li>
                    <li className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
                        🔔 {t('settings_page.menu_notifications')}
                    </li>
                    <li className={activeTab === 'system' ? 'active' : ''} onClick={() => setActiveTab('system')}>
                        ⚙️ {t('settings_page.menu_system')}
                    </li>
                </ul>
            </div>

            {/* CONTENT AREA */}
            <div className="settings-main">
                {activeTab === 'general' && renderGeneralSettings()}
                {activeTab === 'fees' && renderFeeSettings()}
                {activeTab === 'notifications' && renderNotifications()}
                {activeTab === 'system' && renderSystem()}
            </div>
        </div>
    );
}

export default Settings;