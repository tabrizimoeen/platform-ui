import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLang = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
        document.documentElement.lang = lang;
    };

    return (
        <div className="flex items-center bg-gray-100 p-1 rounded-full border shadow-sm">
            <button
                onClick={() => changeLang("fa")}
                className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                    i18n.language === "fa"
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500"
                }`}
            >
                فارسی
            </button>

            <button
                onClick={() => changeLang("en")}
                className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                    i18n.language === "en"
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500"
                }`}
            >
                EN
            </button>
        </div>
    );
}