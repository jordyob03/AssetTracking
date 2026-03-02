import { useState, useEffect } from "react";
import TopNav from "../components/TopNavBar";
import FloorMapViewer from "../components/FloorMapViewer";
import AssetDirectory from "../components/AssetDirectory";

export default function LiveTrackingPage() {
  const [floorData, setFloorData] = useState(null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function fetchFloor() {
      try {
        const res = await fetch("/floor-plan.json");
        if (!res.ok) throw new Error("Failed to fetch floor plan");
        const data = await res.json();
        setFloorData(data);
      } catch (err) {
        console.error("Error loading floor plan:", err);
      }
    }

    fetchFloor();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "asset_update") {
        setAssets(data.assets);
      }
    };

    return () => ws.close();
  }, []);

  const assetTypes = {
    heart_monitor: { label: "Heart Monitor", color: "#e53935" },
    iv_stand: { label: "IV Stand", color: "#1e88e5" },
    nurse: { label: "Nurse", color: "#d81b60" },
    stretcher: { label: "Stretcher", color: "#6d4c41" },
    wheelchair: { label: "Wheelchair", color: "#5e35b1" },
    infusion_pump: { label: "Infusion Pump", color: "#00897b" },
    ventilator: { label: "Ventilator", color: "#f4511e" },
    ultrasound: { label: "Ultrasound Machine", color: "#3949ab" },
    ecg_machine: { label: "ECG Machine", color: "#c0ca33" },
    crash_cart: { label: "Crash Cart", color: "#b71c1c" },
    oxygen_tank: { label: "Oxygen Tank", color: "#00acc1" },
    medication_cart: { label: "Medication Cart", color: "#8e24aa" }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNav />

      <main className="flex-1 w-full p-6">
        <div className="flex gap-6 w-full">

          <AssetDirectory
            assets={assets}
            floorData={floorData}
            assetTypes={assetTypes}
          />

          {/* Left: Floor Map */}
          <div className="flex-1">
            {floorData ? (
              <div className="bg-white p-4 rounded-lg shadow">
                <FloorMapViewer
                  floorData={floorData}
                  assets={assets}
                  assetTypes={assetTypes}
                />
              </div>
            ) : (
              <p className="text-gray-500">Loading floor plan...</p>
            )}
          </div>


        </div>
      </main>
    </div>
  );
}