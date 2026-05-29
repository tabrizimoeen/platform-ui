import { useEffect, useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useTranslation } from "react-i18next";

export default function RepairsPage() {

  const { t } = useTranslation();

  const [repairs, setRepairs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timer);

  }, [searchInput]);

  useEffect(() => {
    fetchRepairs();
  }, [search, status, page]);

  async function fetchRepairs() {

    try {

      let response;

      if (search) {

        response =
            await client.get(
                `/repairs/search?query=${search}`
            );

      } else if (status) {

        response =
            await client.get(
                `/repairs/status?status=${status}`
            );

      } else {

        response =
            await client.get(
                `/repairs?page=${page}&size=10`
            );

      }

      setRepairs(
          response.data.content || response.data
      );

    } catch (e) {
      console.error(e);
    }
  }

  function getStatusStyle(status) {

    switch (status) {

      case "RECEIVED":
        return "bg-red-50 text-red-700 border-red-100";

      case "DIAGNOSED":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "WAITING_PARTS":
        return "bg-orange-50 text-orange-700 border-orange-100";

      case "IN_REPAIR":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";

      case "READY":
        return "bg-green-50 text-green-700 border-green-100";

      case "DELIVERED":
        return "bg-blue-50 text-blue-700 border-blue-100";

      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  }

  function getStatusLabel(status) {

    switch (status) {

      case "RECEIVED":
        return t("received");

      case "DIAGNOSED":
        return t("diagnosed");

      case "WAITING_PARTS":
        return t("waiting_parts");

      case "IN_REPAIR":
        return t("in_repair");

      case "READY":
        return t("ready");

      case "DELIVERED":
        return t("delivered");

      default:
        return status;
    }
  }

  return (

      <div className="min-h-screen bg-gray-50 pb-32">

        <div className="max-w-5xl mx-auto px-4 py-6">

          {/* HEADER */}

          <div className="mb-6">

            <h1 className="text-2xl font-bold text-gray-900">
              {t("repairs")}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              مدیریت تعمیرات ثبت شده
            </p>

          </div>

          {/* FILTERS */}

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-5 space-y-3">

            <input
                type="text"
                placeholder={t("search_repairs")}
                value={searchInput}
                onChange={(e) =>
                    setSearchInput(e.target.value)
                }
                className="
              w-full
              p-3
              rounded-xl
              border
              border-gray-200
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-200
            "
            />

            <select
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
                className="
              w-full
              p-3
              rounded-xl
              border
              border-gray-200
            "
            >

              <option value="">
                {t("all_statuses")}
              </option>

              <option value="RECEIVED">
                {t("received")}
              </option>

              <option value="DIAGNOSED">
                {t("diagnosed")}
              </option>

              <option value="WAITING_PARTS">
                {t("waiting_parts")}
              </option>

              <option value="IN_REPAIR">
                {t("in_repair")}
              </option>

              <option value="READY">
                {t("ready")}
              </option>

              <option value="DELIVERED">
                {t("delivered")}
              </option>

            </select>

          </div>

          {/* LIST */}

          <div className="space-y-3">

            {repairs.map((repair) => (

                <div
                    key={repair.id}
                    onClick={() =>
                        navigate(`/repairs/${repair.id}`)
                    }
                    className="
                bg-white
                rounded-2xl
                p-4
                border
                border-gray-100
                shadow-sm
                cursor-pointer
                hover:shadow-md
                transition
              "
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h2 className="font-semibold text-gray-900">
                        {repair.deviceModel}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {repair.customer?.name}
                      </p>

                    </div>

                    <span
                        className={`
                    text-xs
                    px-3
                    py-1
                    rounded-full
                    border
                    font-medium
                    ${getStatusStyle(repair.status)}
                  `}
                    >
                  {getStatusLabel(repair.status)}
                </span>

                  </div>

                  <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                    {repair.problemDescription}
                  </p>

                </div>

            ))}

          </div>

          {/* PAGINATION */}

          {!search && !status && (

              <div className="flex justify-between items-center mt-6">

                <button
                    onClick={() =>
                        setPage((p) => Math.max(p - 1, 0))
                    }
                    className="
                bg-white
                border
                px-4
                py-2
                rounded-xl
              "
                >
                  {t("previous")}
                </button>

                <span className="text-sm text-gray-500">
              صفحه {page + 1}
            </span>

                <button
                    onClick={() =>
                        setPage((p) => p + 1)
                    }
                    className="
                bg-white
                border
                px-4
                py-2
                rounded-xl
              "
                >
                  {t("next")}
                </button>

              </div>

          )}

        </div>

        {/* FLOATING ACTION BUTTON */}

        <button
            onClick={() => navigate("/create")}
            className="
          fixed
          bottom-24
          left-6
          w-14
          h-14
          rounded-full
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          text-2xl
          shadow-lg
          transition
        "
        >
          +
        </button>

        <BottomNav />

      </div>
  );
}