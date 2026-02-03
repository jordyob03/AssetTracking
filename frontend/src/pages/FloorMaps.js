import { useState } from "react";
import FloorMapEditor from "../components/FloorMapEditor";
import TopNav from "../components/TopNavBar";

export default function FloorMapPage() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top navigation */}
      <TopNav />

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            Floor Map Editor
          </h2>
        </header>


        <div className="pt-2 bg-white p-4 rounded-lg shadow">
          <FloorMapEditor />
        </div>
      </main>
    </div>
  );
}
