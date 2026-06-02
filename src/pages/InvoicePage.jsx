import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [invoice, setInvoice] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  async function fetchInvoice() {
    try {
      const res = await client.get(`/repairs/${id}/invoice`);
      setInvoice(res.data);
    } catch (e) {
      if (e.response?.status !== 404) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }

  async function createInvoice() {
    try {
      const res = await client.post(`/repairs/${id}/invoice`, {
        amount: Number(amount),
      });

      setInvoice(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function payInvoice() {
    try {
      const res = await client.patch(`/repairs/${id}/invoice/pay`);
      setInvoice(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
        <div className="h-screen flex items-center justify-center text-gray-500">
          {t("loading")}
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

          {/* HEADER */}
          <PageHeader
              title={t("invoice")}
              description={t("invoice_description")}
              showBack={true}
          />


          {/* MAIN CARD */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-5">

            {/* CREATE INVOICE */}
            {!invoice && (
                <div className="space-y-4">

                  <div>
                    <label className="text-sm text-gray-500">
                      {t("amount")}
                    </label>

                    <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full mt-2 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <button
                      onClick={createInvoice}
                      className="w-full bg-black text-white p-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition"
                  >
                    {t("create_invoice")}
                  </button>
                </div>
            )}

            {/* INVOICE DETAILS */}
            {invoice && (
                <div className="space-y-5">

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">

                    <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">
                    {t("amount")}
                  </span>

                      <span className="font-semibold text-gray-900">
                    {invoice.amount?.toLocaleString("fa-IR")} تومان
                  </span>
                    </div>

                    <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">
                    {t("status")}
                  </span>

                      <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                              invoice.paid
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                          }`}
                      >
                    {invoice.paid ? t("paid") : t("unpaid")}
                  </span>
                    </div>

                    <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">
                    {t("date")}
                  </span>

                      <span className="text-sm text-gray-700">
                    {invoice.createdAt
                        ? new Date(invoice.createdAt).toLocaleString("fa-IR")
                        : "-"}
                  </span>
                    </div>
                  </div>

                  {/* ACTION */}
                  {!invoice.paid ? (
                      <button
                          onClick={payInvoice}
                          className="w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 active:scale-[0.98] transition"
                      >
                        {t("pay_invoice")}
                      </button>
                  ) : (
                      <div className="text-center bg-green-50 text-green-700 p-3 rounded-xl font-medium">
                        {t("paid_success")}
                      </div>
                  )}
                </div>
            )}

          </div>

          {/*/!* BACK BUTTON *!/*/}
          {/*<button*/}
          {/*    onClick={() => navigate(-1)}*/}
          {/*    className="w-full bg-white border border-gray-200 p-3 rounded-xl hover:bg-gray-50"*/}
          {/*>*/}
          {/*  {t("back")}*/}
          {/*</button>*/}

        </div>
      </div>
  );
}