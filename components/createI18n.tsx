import i18n, { i18n as I18n } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "public/locales/en/common.json";
import ko from "public/locales/ko/common.json";

const resources = {
  en: {
    translation: en
  }, 
  ko: {
    translation: ko
  }
};

interface Props {
  locale: string;
}

const createI18n = ({ locale }: Props): I18n => {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: "ko",
      lng: locale,
      debug: true,
      interpolation: { escapeValue: true },
      returnObjects: true,
      returnEmptyString: true,
      returnNull: true,
    });

  return i18n;
};

export default createI18n;
