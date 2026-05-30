import {useEffect, useState} from "react";
import client from "../api/client";
import {useTranslation} from "react-i18next";
import BottomNav from "../components/BottomNav.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";
import LogoutButton  from "../components/LogoutButton.jsx";


import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from "recharts";
import PageHeader from "../components/PageHeader.jsx";

export default function DashboardPage() {
    const {t} = useTranslation();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    async function fetchDashboard() {
        try {
            const res = await client.get("/dashboard");
            setData(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    if (!data) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-500">
                {t("loading")}
            </div>
        );
    }

    const statusData = Object.entries(data.statusCount || {}).map(
        ([key, value]) => ({name: key, value})
    );

    const revenueData = [
        {name: t("today"), value: data.todayRevenue || 0},
        {name: t("total"), value: data.totalRevenue || 0},
        {name: t("unpaid"), value: data.unpaidRevenue || 0},
    ];

    const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

    const statusColors = {
        pending: "bg-yellow-50 text-yellow-700",
        in_progress: "bg-blue-50 text-blue-700",
        delivered: "bg-green-50 text-green-700",
        cancelled: "bg-red-50 text-red-700",
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

                {/* HEADER */}

                <PageHeader
                    title={t("dashboard")}
                    description={t("dashboard_description")}
                />

                {/* KPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <p className="text-gray-500 text-sm">{t("total_repairs")}</p>
                        <p className="text-3xl font-bold mt-2">{data.totalRepairs}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <p className="text-gray-500 text-sm">{t("customers")}</p>
                        <p className="text-3xl font-bold mt-2">{data.totalCustomers}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <p className="text-gray-500 text-sm">{t("today_revenue")}</p>
                        <p className="text-3xl font-bold mt-2 text-green-600">
                            {data.todayRevenue?.toLocaleString("fa-IR")}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:col-span-3">

                        <div className="bg-white p-5 rounded-2xl border shadow-sm">
                            <p className="text-gray-500 text-sm">{t("total_revenue")}</p>
                            <p className="text-2xl font-bold text-green-600">
                                {data.totalRevenue?.toLocaleString("fa-IR")}
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border shadow-sm">
                            <p className="text-gray-500 text-sm">{t("unpaid")}</p>
                            <p className="text-2xl font-bold text-red-600">
                                {data.unpaidRevenue?.toLocaleString("fa-IR")}
                            </p>
                        </div>

                    </div>
                </div>

                {/* MAIN */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* STATUS */}
                    <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <h2 className="font-semibold mb-4">{t("status_overview")}</h2>

                        <div className="space-y-3">
                            {Object.entries(data.statusCount || {}).map(([key, value]) => (
                                <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                    <span className="text-sm">{t(key)}</span>
                                    <span className="text-xs font-semibold">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CHARTS */}
                    <div className="bg-white p-5 rounded-2xl border shadow-sm lg:col-span-2">
                        <h2 className="font-semibold mb-4">{t("insights")}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* PIE */}
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statusData} dataKey="value" outerRadius={90}>
                                            {statusData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                                            ))}
                                        </Pie>
                                        <Tooltip/>
                                    </PieChart>
                                </ResponsiveContainer>

                                <p className="text-xs text-center text-gray-500 mt-2">
                                    {t("status_distribution")}
                                </p>
                            </div>

                            {/* BAR */}
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Bar dataKey="value" fill="#6366F1"/>
                                    </BarChart>
                                </ResponsiveContainer>

                                <p className="text-xs text-center text-gray-500 mt-2">
                                    {t("revenue_overview")}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <BottomNav/>
        </div>
    );
}