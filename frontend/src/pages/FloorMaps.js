import { useState } from "react";
import FloorMapEditor from "../components/FloorMapEditor";
import TopNav from "../components/TopNavBar";

export default function FloorMapPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top navigation */}
      <TopNav />

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            Floor Maps
          </h2>
          <p className="text-gray-600">
            Create and manage indoor floor maps for asset tracking.
          </p>
        </header>

        {!isCreating ? (
          <div className="pt-2">
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5
                         bg-blue-600 text-white rounded-md
                         hover:bg-blue-700 transition"
            >
              ➕ Create New Floor Map
            </button>
          </div>
        ) : (
          <div className="pt-2 bg-white p-4 rounded-lg shadow">
            <FloorMapEditor />
          </div>
        )}
      </main>
    </div>
  );
}
