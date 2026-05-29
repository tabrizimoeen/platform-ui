import { useEffect, useState } from "react";
import client from "../api/client";
import { useTranslation } from "react-i18next";
import BottomNav from "../components/BottomNav.jsx";

export default function DashboardPage() {
  const { t } = useTranslation();
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

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700",
    in_progress: "bg-blue-50 text-blue-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {t("dashboard")}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Overview of your repair business performance
            </p>
          </div>

          {/* KPI GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">{t("total_repairs")}</p>
              <p className="text-3xl font-bold mt-2">{data.totalRepairs}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">{t("customers")}</p>
              <p className="text-3xl font-bold mt-2">{data.totalCustomers}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">
                درآمد امروز
              </p>

              <p className="text-3xl font-bold mt-2 text-green-600">
                {data.todayRevenue?.toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm">
                  کل درآمد
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {data.totalRevenue?.toLocaleString("fa-IR")}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm">
                  مطالبات
                </p>

                <p className="text-2xl font-bold text-red-600">
                  {data.unpaidRevenue?.toLocaleString("fa-IR")}
                </p>
              </div>

            </div>
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* STATUS BREAKDOWN */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-1">
              <h2 className="font-semibold text-gray-900 mb-4">
                {t("status_overview")}
              </h2>

              <div className="space-y-3">
                {Object.entries(data.statusCount).map(([key, value]) => (
                    <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                    >
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace("_", " ")}
                  </span>

                      <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              statusColors[key] || "bg-gray-100 text-gray-700"
                          }`}
                      >
                    {value}
                  </span>
                    </div>
                ))}
              </div>
            </div>

            {/* INSIGHTS CARD (placeholder for future charts) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
              <h2 className="font-semibold text-gray-900 mb-4">
                Insights
              </h2>

              <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded-xl">
                Chart / Analytics placeholder
              </div>

              <p className="text-sm text-gray-500 mt-4">
                (Later we can plug in Recharts or Chart.js here for real trends)
              </p>
            </div>
          </div>

        </div>
        <BottomNav />
      </div>
  );
}