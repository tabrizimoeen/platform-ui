import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";

export default function RepairDetailsPage() {

    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const [repair, setRepair] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const statuses = useMemo(
        () => [
            "RECEIVED",
            "DIAGNOSED",
            "WAITING_PARTS",
            "IN_REPAIR",
            "READY",
            "DELIVERED",
        ],
        []
    );

    const statusColors = {
        RECEIVED: "bg-red-50 text-red-700 border-red-100",
        DIAGNOSED: "bg-purple-50 text-purple-700 border-purple-100",
        WAITING_PARTS: "bg-orange-50 text-orange-700 border-orange-100",
        IN_REPAIR: "bg-yellow-50 text-yellow-700 border-yellow-100",
        READY: "bg-green-50 text-green-700 border-green-100",
        DELIVERED: "bg-blue-50 text-blue-700 border-blue-100",
    };

    useEffect(() => {
        fetchRepair();
    }, [id]);

    async function fetchRepair() {

        try {

            setLoading(true);

            const repairRes =
                await client.get(`/repairs/${id}`);

            setRepair(repairRes.data);

            const logRes =
                await client.get(`/repairs/${id}/logs`);

            setLogs(logRes.data);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(status) {

        try {

            await client.patch(
                `/repairs/${id}/status?status=${status}`
            );

            await fetchRepair();

        } catch (e) {
            console.error(e);
        }
    }

    function statusLabel(status) {

        const map = {
            RECEIVED: t("received"),
            DIAGNOSED: t("diagnosed"),
            WAITING_PARTS: t("waiting_parts"),
            IN_REPAIR: t("in_repair"),
            READY: t("ready"),
            DELIVERED: t("delivered"),
        };

        return map[status] || status;
    }

    function isActive(status) {
        return repair?.status === status;
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-500">
                {t("loading")}
            </div>
        );
    }

    if (!repair) {
        return (
            <div className="h-screen flex items-center justify-center text-red-500">
                {t("not_found")}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="max-w-4xl mx-auto p-4 space-y-5">

                {/* HEADER */}
                <PageHeader
                    title={t("repair_details")}
                    description={t("repair_details_description")}
                    showBack={true}
                />
                <div className="card p-6">

                    <h1 className="text-2xl font-bold">
                        {repair.deviceModel}
                    </h1>

                    <p className="text-slate-600 mt-1">
                        {repair.customer?.name}
                    </p>

                    <p className="text-sm text-slate-500">
                        {repair.customer?.phone}
                    </p>

                    <div className="mt-4">

                        <span className="text-xs text-slate-500">
                            {t("current_status")}
                        </span>

                        <div
                            className={`mt-2 inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${
                                statusColors[repair.status] ||
                                "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {statusLabel(repair.status)}
                        </div>

                    </div>

                </div>

                {/* CONTENT */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* DETAILS */}

                    <div className="card p-5 lg:col-span-2 space-y-6">

                        <div>

                            <h2 className="font-semibold mb-1">
                                {t("problem")}
                            </h2>

                            <p className="text-slate-600">
                                {repair.problemDescription}
                            </p>

                        </div>

                        <div>

                            <h2 className="font-semibold mb-1">
                                IMEI
                            </h2>

                            <p className="text-slate-700">
                                {repair.imei || "-"}
                            </p>

                        </div>

                        <div>

                            <h2 className="font-semibold mb-1">
                                {t("estimated_cost")}
                            </h2>

                            <p className="font-medium">
                                {repair.estimatedCost?.toLocaleString("fa-IR")} تومان
                            </p>

                        </div>

                        {repair.finalCost && (

                            <div>

                                <h2 className="font-semibold mb-1">
                                    هزینه نهایی
                                </h2>

                                <p className="text-green-600 font-bold">
                                    {repair.finalCost.toLocaleString("fa-IR")} تومان
                                </p>

                            </div>

                        )}

                        <button
                            onClick={() =>
                                navigate(`/repairs/${id}/invoice`)
                            }
                            className="btn-primary w-full"
                        >
                            {repair.finalCost
                                ? "مشاهده فاکتور"
                                : "صدور فاکتور"}
                        </button>

                    </div>

                    {/* STATUS */}

                    <div className="card p-5">

                        <h2 className="font-semibold mb-3">
                            {t("update_status")}
                        </h2>

                        <div className="space-y-2">

                            {statuses.map((status) => (

                                <button
                                    key={status}
                                    onClick={() =>
                                        updateStatus(status)
                                    }
                                    disabled={isActive(status)}
                                    className={`w-full p-3 rounded-xl border text-sm font-medium transition ${
                                        isActive(status)
                                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                            : "bg-white hover:bg-slate-50"
                                    }`}
                                >
                                    {statusLabel(status)}
                                </button>

                            ))}

                        </div>

                    </div>

                </div>

                {/* TIMELINE */}

                <div className="card p-5">

                    <h2 className="font-semibold mb-4">
                        {t("timeline")}
                    </h2>

                    <div className="space-y-4">

                        {logs.map((log) => (

                            <div
                                key={log.id}
                                className="flex gap-3"
                            >

                                <div className="w-2 h-2 mt-2 rounded-full bg-slate-300"></div>

                                <div>

                                    <p className="text-sm">
                                        {log.message}
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        {new Date(
                                            log.createdAt
                                        ).toLocaleString("fa-IR")}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}