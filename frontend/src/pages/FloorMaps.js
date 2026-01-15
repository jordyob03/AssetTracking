import { useState } from "react";
import FloorMapEditor from "../components/FloorMapEditor";

export default function FloorMapPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            Floor Maps
          </h2>
          <p className="text-gray-600">
            Create and manage indoor floor maps for asset tracking.
          </p>
        </header>

        {!isCreating ? (
          <div className="pt-4">
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5
                         bg-primary text-white rounded-md
                         hover:bg-secondary transition"
            >
              ➕ Create New Floor Map
            </button>
          </div>
        ) : (
          <div className="pt-6 bg-white p-4 rounded-lg shadow">
            <FloorMapEditor />
          </div>
        )}
      </div>
    </div>
  );
}
