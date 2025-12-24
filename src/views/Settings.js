import React, { useState, useEffect } from "react";
import '../styles/settings-styles/Settings.scss';
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getToken } from "../services/localStorageService"; // 1. Import hàm lấy token

function Settings() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);

    // 2. Xác định quyền: Nếu không có token => là Khách (chỉ xem)
    const isGuest = !getToken();

    // --- 1. STATE: THÔNG TIN CHUNG ---
    const [generalForm, setGeneralForm] = useState({
        tenChungCu: 'Chung cư BlueMoon',
        diaChi: '123 Đường Văn Phú, Hà Đông, Hà Nội',
        sdt: '024 1234 5678',
        email: 'bql.bluemoon@example.com'
    });

    // --- 2. STATE: NGÂN HÀNG (VIETQR) ---
    const [bankForm, setBankForm] = useState({
        bankId: 'MB',
        accountNumber: '0334960588',
        accountName: 'BAN QUAN LY BLUE MOON',
        template: 'compact'
    });

    // --- 3. STATE: QUY ĐỊNH ---
    const [rulesForm, setRulesForm] = useState({
        closingDate: 25,
        deadlineDate: 5,
        maxMotorbike: 3,
        maxCar: 2,
        lateFeePercent: 0.04
    });

    // --- 4. STATE: MẪU THÔNG BÁO ---
    const [templateForm, setTemplateForm] = useState({
        emailSubject: 'Thông báo phí dịch vụ tháng {thang}',
        emailContent: 'Kính gửi cư dân {ten_cu_dan}, căn hộ {can_ho}.\nTổng phí tháng {thang} của quý khách là: {tong_tien}.\nVui lòng thanh toán trước ngày {han_nop}.\nXin cảm ơn!'
    });

    const handleDevFeature = (e) => {
        if (e) e.preventDefault();
        if (isGuest) return; // Khách không bấm được
        alert(t('settings_page.alert_dev_feature'));
    };

    const handleChange = (e, setForm, form) => {
        // Nếu là khách thì chặn luôn sự kiện thay đổi
        if (isGuest) return;

        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (isGuest) return; // Chặn double-check

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert(t('settings_page.alert_save_success'));
        }, 800);
    };

    // ==========================================
    // RENDER CÁC TAB
    // ==========================================

    // 1. Render: Thông tin chung
    const renderGeneralSettings = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.general.title')}</h3>
                <p>{t('settings_page.general.desc')}</p>
            </div>
            <form className="settings-form" onSubmit={handleSave}>
                <div className="form-group">
                    <label>{t('settings_page.general.label_name')}</label>
                    <input
                        type="text" name="tenChungCu"
                        value={generalForm.tenChungCu}
                        onChange={(e) => handleChange(e, setGeneralForm, generalForm)}
                        readOnly={isGuest} // Khóa nếu là khách
                    />
                </div>
                <div className="form-group">
                    <label>{t('settings_page.general.label_address')}</label>
                    <input
                        type="text" name="diaChi"
                        value={generalForm.diaChi}
                        onChange={(e) => handleChange(e, setGeneralForm, generalForm)}
                        readOnly={isGuest}
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>{t('settings_page.general.label_phone')}</label>
                        <input
                            type="text" name="sdt"
                            value={generalForm.sdt}
                            onChange={(e) => handleChange(e, setGeneralForm, generalForm)}
                            readOnly={isGuest}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('settings_page.general.label_email')}</label>
                        <input
                            type="email" name="email"
                            value={generalForm.email}
                            onChange={(e) => handleChange(e, setGeneralForm, generalForm)}
                            readOnly={isGuest}
                        />
                    </div>
                </div>
                {/* Chỉ hiện nút Lưu nếu KHÔNG phải là khách */}
                {!isGuest && (
                    <div className="form-footer">
                        <button type="submit" className="save-btn" disabled={isLoading}>
                            {isLoading ? t('settings_page.saving_button') : t('settings_page.save_button')}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );

    // 2. Render: Ngân hàng & QR
    const renderBankSettings = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.bank.title')}</h3>
                <p>{t('settings_page.bank.desc')}</p>
            </div>
            <form className="settings-form" onSubmit={handleSave}>
                <div className="form-row">
                    <div className="form-group">
                        <label>{t('settings_page.bank.label_bank')}</label>
                        <select
                            name="bankId"
                            value={bankForm.bankId}
                            onChange={(e) => handleChange(e, setBankForm, bankForm)}
                            disabled={isGuest} // Select dùng disabled thay vì readOnly
                        >
                            <option value="MB">MB Bank</option>
                            <option value="VCB">Vietcombank</option>
                            <option value="TCB">Techcombank</option>
                            <option value="BIDV">BIDV</option>
                            <option value="ICB">VietinBank</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('settings_page.bank.label_acc_number')}</label>
                        <input
                            type="text" name="accountNumber"
                            value={bankForm.accountNumber}
                            onChange={(e) => handleChange(e, setBankForm, bankForm)}
                            readOnly={isGuest}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>{t('settings_page.bank.label_acc_name')}</label>
                    <input
                        type="text" name="accountName"
                        value={bankForm.accountName}
                        onChange={(e) => handleChange(e, setBankForm, bankForm)}
                        readOnly={isGuest}
                    />
                </div>

                {/* Preview QR - Vẫn hiển thị cho khách xem */}
                <div className="form-group">
                    <label style={{ color: '#00f2c3' }}>{t('settings_page.bank.label_qr_preview')}</label>
                    <div style={{ marginTop: '15px', padding: '15px', background: 'white', width: 'fit-content', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={`https://img.vietqr.io/image/${bankForm.bankId}-${bankForm.accountNumber}-${bankForm.template}.png?amount=500000&addInfo=TEST QR&accountName=${encodeURIComponent(bankForm.accountName)}`}
                            alt="QR Preview"
                            style={{ height: '180px', objectFit: 'contain' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                        />
                        <span style={{ color: '#333', fontSize: '0.8rem', marginTop: '10px', fontWeight: 'bold' }}>{t('settings_page.bank.preview_note')}</span>
                    </div>
                </div>

                {!isGuest && (
                    <div className="form-footer">
                        <button type="submit" className="save-btn" disabled={isLoading}>
                            {isLoading ? t('settings_page.saving_button') : t('settings_page.save_button')}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );

    // 3. Render: Quy định & Hạn mức
    const renderRulesSettings = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.rules.title')}</h3>
                <p>{t('settings_page.rules.desc')}</p>
            </div>
            <form className="settings-form" onSubmit={handleSave}>
                <div className="form-row">
                    <div className="form-group">
                        <label>{t('settings_page.rules.label_closing_date')}</label>
                        <input type="number" name="closingDate" min="1" max="31" value={rulesForm.closingDate} onChange={(e) => handleChange(e, setRulesForm, rulesForm)} readOnly={isGuest} />
                        <small style={{ color: 'gray', fontSize: '0.8rem' }}>{t('settings_page.rules.note_closing_date')}</small>
                    </div>
                    <div className="form-group">
                        <label>{t('settings_page.rules.label_deadline')}</label>
                        <input type="number" name="deadlineDate" min="1" max="31" value={rulesForm.deadlineDate} onChange={(e) => handleChange(e, setRulesForm, rulesForm)} readOnly={isGuest} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>{t('settings_page.rules.label_max_motorbike')}</label>
                        <input type="number" name="maxMotorbike" value={rulesForm.maxMotorbike} onChange={(e) => handleChange(e, setRulesForm, rulesForm)} readOnly={isGuest} />
                    </div>
                    <div className="form-group">
                        <label>{t('settings_page.rules.label_max_car')}</label>
                        <input type="number" name="maxCar" value={rulesForm.maxCar} onChange={(e) => handleChange(e, setRulesForm, rulesForm)} readOnly={isGuest} />
                    </div>
                </div>

                <div className="form-group">
                    <label>{t('settings_page.rules.label_late_fee')}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="number" name="lateFeePercent" step="0.01" value={rulesForm.lateFeePercent} onChange={(e) => handleChange(e, setRulesForm, rulesForm)} style={{ width: '120px' }} readOnly={isGuest} />
                        <span>% / ngày</span>
                    </div>
                </div>

                {!isGuest && (
                    <div className="form-footer">
                        <button type="submit" className="save-btn" disabled={isLoading}>
                            {isLoading ? t('settings_page.saving_button') : t('settings_page.save_button')}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );

    // 4. Render: Mẫu thông báo
    const renderTemplates = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.template.title')}</h3>
                <p>{t('settings_page.template.desc')}</p>
            </div>
            <form className="settings-form" onSubmit={handleSave}>
                <div className="form-group">
                    <label>{t('settings_page.template.label_subject')}</label>
                    <input type="text" name="emailSubject" value={templateForm.emailSubject} onChange={(e) => handleChange(e, setTemplateForm, templateForm)} readOnly={isGuest} />
                </div>

                <div className="form-group">
                    <label>{t('settings_page.template.label_content')}</label>
                    <textarea
                        rows="8"
                        name="emailContent"
                        value={templateForm.emailContent}
                        onChange={(e) => handleChange(e, setTemplateForm, templateForm)}
                        readOnly={isGuest}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: '#1e1e2f',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white',
                            borderRadius: '8px',
                            fontFamily: 'inherit',
                            fontSize: '0.95rem',
                            resize: 'vertical'
                        }}
                    />
                    <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#00f2c3', background: 'rgba(0, 242, 195, 0.1)', padding: '10px', borderRadius: '6px' }}>
                        <strong>{t('settings_page.template.support_vars_title')}</strong><br />
                        <code>{`{ten_cu_dan}`}</code>: {t('settings_page.template.var_resident')} &nbsp;|&nbsp;
                        <code>{`{can_ho}`}</code>: {t('settings_page.template.var_apartment')} &nbsp;|&nbsp;
                        <code>{`{thang}`}</code>: {t('settings_page.template.var_month')} &nbsp;|&nbsp;
                        <code>{`{tong_tien}`}</code>: {t('settings_page.template.var_total')} &nbsp;|&nbsp;
                        <code>{`{han_nop}`}</code>: {t('settings_page.template.var_deadline')}
                    </div>
                </div>

                {!isGuest && (
                    <div className="form-footer">
                        <button type="submit" className="save-btn" disabled={isLoading}>
                            {isLoading ? t('settings_page.saving_button') : t('settings_page.save_button')}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );

    // 5. Render: Cấu hình thông báo (Toggle)
    const renderNotifications = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.notif.title')}</h3>
                <p>{t('settings_page.notif.desc')}</p>
            </div>
            <div className="settings-list">
                <div className="setting-item">
                    <div className="item-info">
                        <strong>{t('settings_page.notif.email_title')}</strong>
                        <span>{t('settings_page.notif.email_desc')}</span>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked onChange={handleDevFeature} disabled={isGuest} />
                        <span className="slider round" style={{ opacity: isGuest ? 0.5 : 1, cursor: isGuest ? 'not-allowed' : 'pointer' }}></span>
                    </label>
                </div>
                <div className="setting-item">
                    <div className="item-info">
                        <strong>{t('settings_page.notif.app_title')}</strong>
                        <span>{t('settings_page.notif.app_desc')}</span>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked onChange={handleDevFeature} disabled={isGuest} />
                        <span className="slider round" style={{ opacity: isGuest ? 0.5 : 1, cursor: isGuest ? 'not-allowed' : 'pointer' }}></span>
                    </label>
                </div>
                <div className="setting-item">
                    <div className="item-info">
                        <strong>{t('settings_page.notif.sms_title')}</strong>
                        <span>{t('settings_page.notif.sms_desc')}</span>
                    </div>
                    <label className="switch">
                        <input type="checkbox" onChange={handleDevFeature} disabled={isGuest} />
                        <span className="slider round" style={{ opacity: isGuest ? 0.5 : 1, cursor: isGuest ? 'not-allowed' : 'pointer' }}></span>
                    </label>
                </div>
            </div>
        </div>
    );

    // 6. Render: Hệ thống
    const renderSystem = () => (
        <div className="settings-content fade-in">
            <div className="content-header">
                <h3>{t('settings_page.sys.title')}</h3>
                <p>{t('settings_page.sys.desc')}</p>
            </div>
            <div className="system-grid">
                <div className="sys-card" onClick={handleDevFeature} style={{ cursor: isGuest ? 'not-allowed' : 'pointer', opacity: isGuest ? 0.7 : 1 }}>
                    <div className="icon">☁️</div>
                    <h4>{t('settings_page.sys.backup_title')}</h4>
                    <p>{t('settings_page.sys.backup_desc')}</p>
                </div>
                <div className="sys-card" onClick={handleDevFeature} style={{ cursor: isGuest ? 'not-allowed' : 'pointer', opacity: isGuest ? 0.7 : 1 }}>
                    <div className="icon">Tb</div>
                    <h4>{t('settings_page.sys.restore_title')}</h4>
                    <p>{t('settings_page.sys.restore_desc')}</p>
                </div>
                <div className="sys-card" onClick={handleDevFeature} style={{ cursor: isGuest ? 'not-allowed' : 'pointer', opacity: isGuest ? 0.7 : 1 }}>
                    <div className="icon">📝</div>
                    <h4>{t('settings_page.sys.log_title')}</h4>
                    <p>{t('settings_page.sys.log_desc')}</p>
                </div>
                <div className="sys-card danger" onClick={handleDevFeature} style={{ cursor: isGuest ? 'not-allowed' : 'pointer', opacity: isGuest ? 0.7 : 1 }}>
                    <div className="icon">🗑️</div>
                    <h4>{t('settings_page.sys.cache_title')}</h4>
                    <p>{t('settings_page.sys.cache_desc')}</p>
                </div>
            </div>
        </div>
    );

    // ... (Giữ nguyên phần MAIN RENDER phía dưới không đổi) ...
    return (
        <div className="settings-container">
            <div className="settings-layout">
                {/* SIDEBAR */}
                <div className="settings-sidebar">
                    <div className="sidebar-header">
                        <h3>Cài Đặt</h3>
                    </div>

                    <ul>
                        <li className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
                            🏢 <span>{t('settings_page.menu_general')}</span>
                        </li>
                        <li className={activeTab === 'banking' ? 'active' : ''} onClick={() => setActiveTab('banking')}>
                            🏦 <span>{t('settings_page.menu_banking')}</span>
                        </li>
                        <li className={activeTab === 'rules' ? 'active' : ''} onClick={() => setActiveTab('rules')}>
                            📋 <span>{t('settings_page.menu_rules')}</span>
                        </li>
                        <li className={activeTab === 'templates' ? 'active' : ''} onClick={() => setActiveTab('templates')}>
                            📝 <span>{t('settings_page.menu_templates')}</span>
                        </li>
                        <li className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
                            🔔 <span>{t('settings_page.menu_notifications')}</span>
                        </li>
                        <li className={activeTab === 'system' ? 'active' : ''} onClick={() => setActiveTab('system')}>
                            ⚙️ <span>{t('settings_page.menu_system')}</span>
                        </li>
                    </ul>
                </div>

                {/* CONTENT AREA */}
                <div className="settings-main">
                    {activeTab === 'general' && renderGeneralSettings()}
                    {activeTab === 'banking' && renderBankSettings()}
                    {activeTab === 'rules' && renderRulesSettings()}
                    {activeTab === 'templates' && renderTemplates()}
                    {activeTab === 'notifications' && renderNotifications()}
                    {activeTab === 'system' && renderSystem()}
                </div>
            </div>
        </div>
    );
}

export default Settings;