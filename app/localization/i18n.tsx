import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import languages from './languages';
import de from './de';
import { DEFAULT_LANGUAGE } from '../constants/GlobalConstants';

const resources = { // list of languages
 en,
 de,
 languages
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
 .init({
    compatibilityJSON: 'v3', //To make it work for Android devices, add this line.
    resources,
    lng: DEFAULT_LANGUAGE,
    interpolation: {
        escapeValue: false,
    },
 });

export default i18n;