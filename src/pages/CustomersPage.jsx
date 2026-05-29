import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import BottomNav from "../components/BottomNav";
import { useTranslation } from "react-i18next";

export default function CustomersPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const response = await client.get("/customers");
      setCustomers(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("customers")}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your customer base
              </p>
            </div>

            <div className="flex gap-2">
              <button
                  onClick={() => i18n.changeLanguage("fa")}
                  className="text-xs bg-white border px-3 py-1 rounded-lg hover:bg-gray-50"
              >
                فارسی
              </button>

              <button
                  onClick={() => i18n.changeLanguage("en")}
                  className="text-xs bg-white border px-3 py-1 rounded-lg hover:bg-gray-50"
              >
                EN
              </button>
            </div>
          </div>

          {/* LIST CARD */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4">

            {/* EMPTY STATE */}
            {customers.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  {t("no_customers")}
                </div>
            ) : (
                <div className="space-y-2">
                  {customers.map((customer) => (
                      <div
                          key={customer.id}
                          onClick={() => navigate(`/customers/${customer.id}`)}
                          className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition active:scale-[0.99]"
                      >

                        {/* LEFT */}
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            {customer.name}
                          </h2>

                          <p className="text-sm text-gray-500 mt-1">
                            {customer.phone}
                          </p>
                        </div>

                        {/* RIGHT (icon placeholder) */}
                        <div className="text-gray-300 text-xl">
                          ›
                        </div>

                      </div>
                  ))}
                </div>
            )}

          </div>

        </div>

        <BottomNav />
      </div>
  );
}