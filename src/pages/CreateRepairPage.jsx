import { useEffect, useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BottomNav from "../components/BottomNav.jsx";
import PageHeader from "../components/PageHeader.jsx";
import toast from "react-hot-toast";
import { toastError } from "../utils/toastError";


export default function CreateRepairPage() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [form, setForm] = useState({
        phone: "",
        imei: "",
        deviceModel: "",
        problemDescription: "",
        estimatedCost: "",
    });

    const [customerQuery, setCustomerQuery] = useState("");
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!customerQuery || selectedCustomer) return;

        const timeout = setTimeout(() => {
            searchCustomers();
        }, 300);

        return () => clearTimeout(timeout);
    }, [customerQuery]);

    useEffect(() => {
        function closeDropdown() {
            setShowDropdown(false);
        }

        document.addEventListener("click", closeDropdown);
        return () => document.removeEventListener("click", closeDropdown);
    }, []);

    async function searchCustomers() {
        try {
            const res = await client.get(`/customers/search?q=${customerQuery}`);
            setCustomers(res.data);
            setShowDropdown(true);
        } catch (e) {
            toastError(e);
        }
    }

    function selectCustomer(customer) {
        setSelectedCustomer(customer);
        setCustomerQuery(customer.name);

        setForm((prev) => ({
            ...prev,
            phone: customer.phone || "",
        }));

        setShowDropdown(false);
    }

    function handle(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function submit() {
        if (!customerQuery.trim()) {
            toast.error(t("customer_required"));
            return;
        }

        if (!form.deviceModel.trim()) {
            toast.error(t("device_required"));
            return;
        }

        try {
            setLoading(true);

            const payload = {
                customerName: selectedCustomer
                    ? selectedCustomer.name
                    : customerQuery,
                phone: form.phone,
                imei: form.imei,
                deviceModel: form.deviceModel,
                problemDescription: form.problemDescription,
                estimatedCost: Number(form.estimatedCost),
            };

            const res = await client.post("/repairs/smart-create", payload);
            navigate(`/repairs/${res.data.id}`);
        } catch (e) {
            toastError(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            dir={i18n.language === "fa" ? "rtl" : "ltr"}
            className="min-h-screen bg-gray-50 pb-32"
        >
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

                {/* HEADER */}

                <PageHeader
                    title={t("create_repair")}
                    description={t("create_repair_description")}
                />

                {/* FORM */}
                <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">

                    {/* CUSTOMER */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <label className="text-sm text-gray-500">
                            {t("customer")}
                        </label>

                        <input
                            value={customerQuery}
                            onChange={(e) => {
                                setCustomerQuery(e.target.value);
                                setSelectedCustomer(null);
                            }}
                            placeholder={t("customer_name")}
                            className="w-full mt-2 p-3 rounded-xl border"
                        />

                        {showDropdown && customers.length > 0 && (
                            <div className="absolute z-20 w-full mt-2 bg-white border rounded-xl shadow-lg">
                                {customers.map((customer) => (
                                    <div
                                        key={customer.id}
                                        onClick={() => selectCustomer(customer)}
                                        className="p-3 cursor-pointer hover:bg-gray-50"
                                    >
                                        <div className="font-medium">{customer.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {customer.phone}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {customerQuery &&
                            customers.length === 0 &&
                            !selectedCustomer && (
                                <div className="text-xs text-green-600 mt-2">
                                    {t("new_customer_will_be_created")}
                                </div>
                            )}
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className="text-sm text-gray-500">
                            {t("phone")}
                        </label>

                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handle}
                            disabled={!!selectedCustomer}
                            className="w-full mt-2 p-3 rounded-xl border"
                        />
                    </div>

                    {/* IMEI */}
                    <div>
                        <label className="text-sm text-gray-500">IMEI</label>

                        <input
                            name="imei"
                            value={form.imei}
                            onChange={handle}
                            dir="ltr"
                            className="w-full mt-2 p-3 rounded-xl border"
                        />
                    </div>

                    {/* DEVICE */}
                    <div>
                        <label className="text-sm text-gray-500">
                            {t("device_model")}
                        </label>

                        <input
                            name="deviceModel"
                            value={form.deviceModel}
                            onChange={handle}
                            className="w-full mt-2 p-3 rounded-xl border"
                        />
                    </div>

                    {/* PROBLEM */}
                    <div>
                        <label className="text-sm text-gray-500">
                            {t("problem_description")}
                        </label>

                        <textarea
                            rows={4}
                            name="problemDescription"
                            value={form.problemDescription}
                            onChange={handle}
                            className="w-full mt-2 p-3 rounded-xl border"
                        />
                    </div>

                    {/* COST */}
                    <div>
                        <label className="text-sm text-gray-500">
                            {t("estimated_cost")}
                        </label>

                        <input
                            type="number"
                            name="estimatedCost"
                            value={form.estimatedCost}
                            onChange={handle}
                            dir="ltr"
                            className="w-full mt-2 p-3 rounded-xl border"
                        />
                    </div>

                    {/* SUBMIT */}
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white p-3 rounded-xl"
                    >
                        {loading ? t("saving") : t("create_repair")}
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}