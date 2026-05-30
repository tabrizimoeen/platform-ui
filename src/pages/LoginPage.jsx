import {useState} from "react";
import client from "../api/client";

import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

export default function LoginPage() {

    const navigate = useNavigate();

    const {t, i18n} = useTranslation();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function login() {

        try {
            setLoading(true);
            setError("");
            const res = await client.post(
                "/auth/login",
                form
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            navigate("/");

        } catch (e) {
            setError(
                e.message || t("login_failed")
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm w-full max-w-md">
                <h1 className="text-2xl font-bold mb-5">
                    {t("login")}
                </h1>

                <div className="flex justify-end gap-2 mb-4">

                    {/* LANGUAGE SWITCHER */}
                    <LanguageSwitcher />

                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder={t("username")}
                        value={form.username}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                username: e.target.value,
                            })
                        }
                        className="w-full border rounded-xl p-3"
                    />

                    <input
                        type="password"
                        placeholder={t("password")}
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password: e.target.value,
                            })
                        }
                        className="w-full border rounded-xl p-3"
                    />

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={login}
                        disabled={loading}
                        className="w-full bg-black text-white rounded-xl p-3 disabled:opacity-50"
                    >
                        {loading ? "Loading..." : t("login")}
                    </button>
                </div>
            </div>
        </div>
    );
}
