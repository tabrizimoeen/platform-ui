import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import PageHeader from "../components/PageHeader.jsx";
import {useTranslation} from "react-i18next";

export default function CustomerDetailsPage() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    async function fetchData() {
        try {
            const res = await client.get(`/customers/${id}`);
            setData(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    if (!data) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                <PageHeader
                    title={t("customers_details")}
                    description={t("customers_details_description")}
                    showBack={true}
                />
                {/* HEADER */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {data.name}
                    </h1>

                    <p className="text-gray-500 mt-1">
                        {data.phone}
                    </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
                        <p className="text-sm text-gray-500">
                            Total Repairs
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {data.totalRepairs}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
                        <p className="text-sm text-gray-500">
                            Total Spent
                        </p>

                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {data.totalSpent?.toLocaleString("fa-IR")} تومان
                        </p>
                    </div>

                </div>

                {/* REPAIRS */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">

                    <h2 className="font-semibold text-gray-900 mb-4">
                        Repairs History
                    </h2>

                    {data.repairs.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No repairs found
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.repairs.map((r) => (
                                <div
                                    key={r.id}
                                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
                                >

                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {r.deviceModel}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {r.status}
                                        </p>
                                    </div>

                                    {/* status dot (simple UX upgrade) */}
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>

                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}