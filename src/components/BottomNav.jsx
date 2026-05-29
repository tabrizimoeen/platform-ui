import {
    Home,
    PlusCircle,
    Users,
    BarChart
} from "lucide-react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function BottomNav() {

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    function isActive(path) {
        return location.pathname === path;
    }

    const active =
        "text-blue-600";

    const inactive =
        "text-slate-400";

    return (

        <div
            className="
                fixed
                bottom-0
                left-0
                right-0
                bg-white
                border-t
                border-slate-200
                shadow-sm
                z-50
            "
        >

            <div
                className="
                    flex
                    justify-around
                    items-center
                    h-16
                    max-w-md
                    mx-auto
                "
            >

                <button
                    onClick={() => navigate("/")}
                    className="flex flex-col items-center gap-1"
                >

                    <Home
                        size={20}
                        className={
                            isActive("/")
                                ? active
                                : inactive
                        }
                    />

                    <span
                        className={
                            isActive("/")
                                ? active
                                : inactive
                        }
                    >
                        {t("repairs")}
                    </span>

                </button>

                <button
                    onClick={() => navigate("/create")}
                    className="flex flex-col items-center gap-1"
                >

                    <PlusCircle
                        size={20}
                        className={
                            isActive("/create")
                                ? active
                                : inactive
                        }
                    />

                    <span
                        className={
                            isActive("/create")
                                ? active
                                : inactive
                        }
                    >
                        {t("create")}
                    </span>

                </button>

                <button
                    onClick={() => navigate("/customers")}
                    className="flex flex-col items-center gap-1"
                >

                    <Users
                        size={20}
                        className={
                            isActive("/customers")
                                ? active
                                : inactive
                        }
                    />

                    <span
                        className={
                            isActive("/customers")
                                ? active
                                : inactive
                        }
                    >
                        {t("customers")}
                    </span>

                </button>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex flex-col items-center gap-1"
                >

                    <BarChart
                        size={20}
                        className={
                            isActive("/dashboard")
                                ? active
                                : inactive
                        }
                    />

                    <span
                        className={
                            isActive("/dashboard")
                                ? active
                                : inactive
                        }
                    >
                        {t("dashboard")}
                    </span>

                </button>

            </div>

        </div>
    );
}