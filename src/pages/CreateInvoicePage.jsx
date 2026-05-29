import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { useTranslation } from "react-i18next";

export default function CreateInvoicePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    amount: "",
  });

  async function submit() {
    try {
      await client.post(`/repairs/${id}/invoices`, {
        amount: Number(form.amount),
      });

      navigate(`/repairs/${id}`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto bg-white p-5 rounded-2xl shadow-sm">

          <h1 className="text-2xl font-bold mb-5">
            {t("create_invoice")}
          </h1>

          <div className="space-y-4">

            <input
                type="number"
                placeholder={t("amount")}
                value={form.amount}
                onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                }
                className="w-full border rounded-xl p-3"
            />

            <button
                onClick={submit}
                className="w-full bg-black text-white p-3 rounded-xl"
            >
              {t("submit")}
            </button>

          </div>

        </div>
      </div>
  );
}