import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";

export default function TrackingPage() {

  const { id } = useParams();

  const [repair, setRepair] = useState(null);

  useEffect(() => {
    fetchTracking();
  }, []);

  async function fetchTracking() {

    try {

      const res = await client.get(
          `/public/track/${id}`
      );

      setRepair(res.data);

    } catch (e) {

      console.error(e);
    }
  }

  if (!repair) {

    return (
        <div className="p-5">
          Loading...
        </div>
    );
  }

  return (

      <div className="min-h-screen bg-gray-100 p-4">

        <div className="
        max-w-md
        mx-auto
        bg-white
        p-5
        rounded-2xl
        shadow-sm
      ">

          <h1 className="text-2xl font-bold">
            وضعیت تعمیر
          </h1>

          <div className="mt-5">

            <p>
              مشتری:
              {repair.customerName}
            </p>

            <p>
              دستگاه:
              {repair.deviceModel}
            </p>

            <p>
              وضعیت:
              {repair.status}
            </p>

            <p>
              هزینه:
              {repair.estimatedCost}
            </p>

          </div>

        </div>

      </div>
  );
}