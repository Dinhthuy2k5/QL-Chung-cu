import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.scss'; // Sẽ tạo file CSS ở dưới

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-switcher">
            <button
                onClick={() => changeLanguage('vi')}
                className={i18n.language === 'vi' ? 'active' : ''}
            >
                VI
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={i18n.language === 'en' ? 'active' : ''}
            >
                EN
            </button>
        </div>
    );
}

export default LanguageSwitcher;