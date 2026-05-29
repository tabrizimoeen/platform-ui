import { useEffect, useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BottomNav from "../components/BottomNav.jsx";

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

        return () => {
            document.removeEventListener("click", closeDropdown);
        };

    }, []);

    async function searchCustomers() {

        try {

            const res =
                await client.get(
                    `/customers/search?q=${customerQuery}`
                );

            setCustomers(res.data);
            setShowDropdown(true);

        } catch (e) {
            console.error(e);
        }
    }

    function selectCustomer(customer) {

        setSelectedCustomer(customer);
        setCustomerQuery(customer.name);

        setForm(prev => ({
            ...prev,
            phone: customer.phone || ""
        }));

        setShowDropdown(false);
    }

    async function submit() {

        if (!customerQuery.trim()) {
            alert("نام مشتری الزامی است");
            return;
        }

        if (!form.deviceModel.trim()) {
            alert("مدل دستگاه الزامی است");
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
                estimatedCost: Number(form.estimatedCost)
            };

            const res =
                await client.post(
                    "/repairs/smart-create",
                    payload
                );

            navigate(`/repairs/${res.data.id}`);

        } catch (e) {

            console.error(e);

        } finally {

            setLoading(false);

        }
    }

    function handle(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    return (

        <div
            dir={i18n.language === "fa" ? "rtl" : "ltr"}
            className="min-h-screen bg-gray-50 pb-32"
        >

            <div className="max-w-2xl mx-auto px-4 py-6">

                {/* HEADER */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-gray-900">
                        {t("create_repair")}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        ثبت تعمیر جدید
                    </p>

                </div>

                {/* FORM */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

                    {/* CUSTOMER */}

                    <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <label className="text-sm text-gray-500">
                            مشتری
                        </label>

                        <input
                            value={customerQuery}
                            onChange={(e) => {

                                setCustomerQuery(e.target.value);
                                setSelectedCustomer(null);

                            }}
                            placeholder="نام مشتری"
                            className="
                                w-full
                                mt-2
                                p-3
                                rounded-xl
                                border
                                border-gray-200
                                focus:outline-none
                                focus:ring-2
                                focus:ring-indigo-200
                            "
                        />

                        {showDropdown && customers.length > 0 && (

                            <div
                                className="
                                    absolute
                                    z-20
                                    w-full
                                    mt-2
                                    bg-white
                                    border
                                    border-gray-100
                                    rounded-xl
                                    shadow-lg
                                    overflow-hidden
                                "
                            >

                                {customers.map(customer => (

                                    <div
                                        key={customer.id}
                                        onClick={() => selectCustomer(customer)}
                                        className="
                                            p-3
                                            cursor-pointer
                                            hover:bg-gray-50
                                        "
                                    >

                                        <div className="font-medium">
                                            {customer.name}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {customer.phone}
                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                        {
                            customerQuery &&
                            customers.length === 0 &&
                            !selectedCustomer && (

                                <div className="text-xs text-green-600 mt-2">

                                    مشتری جدید ایجاد خواهد شد

                                </div>
                            )
                        }

                    </div>

                    {/* PHONE */}

                    <div>

                        <label className="text-sm text-gray-500">
                            تلفن
                        </label>

                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handle}
                            disabled={!!selectedCustomer}
                            className="
                                w-full
                                mt-2
                                p-3
                                rounded-xl
                                border
                                border-gray-200
                            "
                        />

                    </div>

                    {/* IMEI */}

                    <div>

                        <label className="text-sm text-gray-500">
                            IMEI
                        </label>

                        <input
                            name="imei"
                            value={form.imei}
                            onChange={handle}
                            dir="ltr"
                            className="
                                w-full
                                mt-2
                                p-3
                                rounded-xl
                                border
                                border-gray-200
                            "
                        />

                    </div>

                    {/* DEVICE */}

                    <div>

                        <label className="text-sm text-gray-500">
                            مدل دستگاه
                        </label>

                        <input
                            name="deviceModel"
                            value={form.deviceModel}
                            onChange={handle}
                            className="
                                w-full
                                mt-2
                                p-3
                                rounded-xl
                                border
                                border-gray-200
                            "
                        />

                    </div>

                    {/* PROBLEM */}

                    <div>

                        <label className="text-sm text-gray-500">
                            شرح خرابی
                        </label>

                        <textarea
                            rows={4}
                            name="problemDescription"
                            value={form.problemDescription}
                            onChange={handle}
                            className="
                                w-full
                                mt-2
                                p-3
                                rounded-xl
                                border
                                border-gray-200
                            "
                        />

                    </div>

                    {/* COST */}

                    <div>

                        <label className="text-sm text-gray-500">
                            هزینه تقریبی
                        </label>

                        <input
                            type="number"
                            name="estimatedCost"
                            value={form.estimatedCost}
                            onChange={handle}
                            dir="ltr"
                            className="
                                w-full
                                mt-2
                                p-3
                                rounded-xl
                                border
                                border-gray-200
                            "
                        />

                    </div>

                    {/* SUBMIT */}

                    <button
                        onClick={submit}
                        disabled={loading}
                        className="
                            w-full
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            p-3
                            rounded-xl
                            transition
                        "
                    >

                        {
                            loading
                                ? "در حال ذخیره..."
                                : "ثبت تعمیر"
                        }

                    </button>

                </div>

            </div>

            <BottomNav />

        </div>
    );
}