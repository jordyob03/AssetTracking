import { useState, useEffect } from "react";
import TopNav from "../components/TopNavBar";
import FloorMapViewer from "../components/FloorMapViewer";
import AssetDirectory from "../components/AssetDirectory";

export default function LiveTrackingPage() {
  const [floorData, setFloorData] = useState(null);
  const [assets, setAssets] = useState([]);
  const [assetTypes, setAssetTypes] = useState({});
  const [visibleTypes, setVisibleTypes] = useState({});
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  // toggle mode
  const [useCoordinates, setUseCoordinates] = useState(false);

  useEffect(() => {
    fetch("/floor-plan.json")
      .then(res => res.json())
      .then(setFloorData);

    fetch("/asset-types.json")
      .then(res => res.json())
      .then(data => {
        setAssetTypes(data);
        const defaults = {};
        Object.keys(data).forEach(t => (defaults[t] = true));
        setVisibleTypes(defaults);
      });
  }, []);

  // 🔌 MAIN BACKEND (room-based)
  useEffect(() => {
    if (useCoordinates) return;

    const ws = new WebSocket("ws://localhost:4000");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "asset_update") {
        setAssets(data.assets);
      }

      if (data.type === "emergency_alert") {
        setEmergencyAlerts(prev => [...prev, data]);

        setTimeout(() => {
          setEmergencyAlerts(prev =>
            prev.filter(a => a.timestamp !== data.timestamp)
          );
        }, 10000);
      }
    };

    return () => ws.close();
  }, [useCoordinates]);

  // 🔌 POSITION BACKEND (coordinate-based)
  useEffect(() => {
    if (!useCoordinates) return;

    const ws = new WebSocket("ws://localhost:5000");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "position_update") {
        setAssets(data.assets);
      }
    };

    return () => ws.close();
  }, [useCoordinates]);

  const getRoomName = (roomId) => {
    const room = floorData?.rooms?.find((r) => r.id === roomId);
    return room ? room.name : "Unknown";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNav />

      {/* 🔘 MODE TOGGLE */}
      <div className="p-4">
        <button
          onClick={() => setUseCoordinates(prev => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Mode: {useCoordinates ? "Coordinates" : "Room-based"}
        </button>
      </div>

      {/* 🚨 ALERTS */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 items-center w-full px-4">
        {emergencyAlerts.map((alert) => (
          <div
            key={alert.timestamp}
            className="bg-red-600 text-white p-6 rounded shadow-lg animate-pulse text-2xl font-bold text-center max-w-3xl w-full"
          >
            🚨 {alert.nurseName} in {getRoomName(alert.roomId)}: {alert.message}
          </div>
        ))}
      </div>

      <main className="flex-1 w-full p-6">
        <div className="flex gap-6 w-full">
          <AssetDirectory
            assets={assets}
            floorData={floorData}
            assetTypes={assetTypes}
            visibleTypes={visibleTypes}
            setVisibleTypes={setVisibleTypes}
          />

          <div className="flex-1">
            {floorData ? (
              <div className="bg-white p-4 rounded-lg shadow">
                <FloorMapViewer
                  floorData={floorData}
                  assets={assets}
                  assetTypes={assetTypes}
                  visibleTypes={visibleTypes}
                />
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}