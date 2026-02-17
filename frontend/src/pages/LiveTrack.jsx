// ================================
// File: src/pages/LiveTrackingPage.jsx
// ================================

import { useState, useEffect } from "react";
import TopNav from "../components/TopNavBar";
import FloorMapViewer from "../components/FloorMapViewer";

export default function LiveTrackingPage() {
  const [floorData, setFloorData] = useState(null);

  // Load floor plan from public/floor-plan.json
  useEffect(() => {
    async function fetchFloor() {
      try {
        const res = await fetch("/floor-plan.json"); // public folder
        if (!res.ok) throw new Error("Failed to fetch floor plan");
        const data = await res.json();
        setFloorData(data);
      } catch (err) {
        console.error("Error loading floor plan:", err);
      }
    }

    fetchFloor();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top navigation */}
      <TopNav />

      {/* Main content */}
      <main className="flex-1 w-full p-6">

        <div className="w-[80vw] mx-auto space-y-6">

          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Live Tracking
            </h2>
            <p className="text-gray-600">
              View real-time asset movement on the floor plan.
            </p>
          </header>

          {floorData ? (
            <div className="bg-white p-4 rounded-lg shadow flex justify-center">
              <FloorMapViewer floorData={floorData} />
            </div>
          ) : (
            <p className="text-gray-500">Loading floor plan...</p>
          )}

        </div>
      </main>
    </div>
  );
}
