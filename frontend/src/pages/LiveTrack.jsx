import { useState, useEffect } from "react";
import TopNav from "../components/TopNavBar";
import FloorMapViewer from "../components/FloorMapViewer";
import AssetDirectory from "../components/AssetDirectory";

export default function LiveTrackingPage() {
  const [floorData, setFloorData] = useState(null);
  const [assets, setAssets] = useState([]);
  const [assetTypes, setAssetTypes] = useState({});
  const [visibleTypes, setVisibleTypes] = useState({});

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

    async function fetchAssetTypes() {
      try {
        const res = await fetch("/asset-types.json");
        const data = await res.json();
        setAssetTypes(data);

        const defaults = {};
        Object.keys(data).forEach((t) => (defaults[t] = true));
        setVisibleTypes(defaults);
      } catch (err) {
        console.error("Error loading asset types:", err);
      }
    }

    fetchFloor();
    fetchAssetTypes();
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNav />

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
              <p className="text-gray-500">Loading floor plan...</p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}