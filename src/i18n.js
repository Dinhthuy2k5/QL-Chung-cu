import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation.json';
import viTranslations from './locales/vi/translation.json';

i18n
    .use(initReactI18next) // Kết nối i18next với React
    .init({
        resources: {
            en: {
                translation: enTranslations
            },
            vi: {
                translation: viTranslations
            }
        },
        lng: "vi", // Ngôn ngữ mặc định
        fallbackLng: "vi", // Ngôn ngữ dự phòng
        interpolation: {
            escapeValue: false // React đã tự chống XSS
        }
    });

export default i18n;