import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import fa from "./locales/fa/translation.json";
import en from "./locales/en/translation.json";

i18n
    .use(initReactI18next)
    .init({

        resources: {

            fa: {
                translation: fa
            },

            en: {
                translation: en
            }

        },

        lng: "fa",
        fallbackLng: "fa",

        interpolation: {
            escapeValue: false
        }
    });
i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
    document.documentElement.dir =
        lng === "fa" ? "rtl" : "ltr";
});
export default i18n;
