import React from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNavBar"; // adjust path as needed

export default function HomePage() {
  const navigate = useNavigate();

  const buttons = [
    {
      id: "map",
      title: "Floor Map",
      subtitle: "Edit rooms & layout",
      path: "/editor",
      icon: "/icons/floor-layer.svg",
    },
    {
      id: "assets",
      title: "Assets",
      subtitle: "Manage tracked assets",
      path: "/assets",
      icon: "/icons/doctor.svg",
    },
    {
      id: "live",
      title: "Live Tracking",
      subtitle: "View real-time movement",
      path: "/live",
      icon: "/icons/live-alt.svg",
    },
    {
      id: "data",
      title: "Data",
      subtitle: "Exports & reports",
      path: "/data",
      icon: "/icons/chart-histogram.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TopNav />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
          {buttons.map((btn) => (
            <div
              key={btn.id}
              onClick={() => navigate(btn.path)}
              className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex flex-col items-center justify-center h-48 gap-4">
                <img
                  src={btn.icon}
                  alt={btn.title}
                  className="w-14 h-14 object-contain"
                />
                <div className="text-center">
                  <h2 className="text-lg font-semibold">{btn.title}</h2>
                  <p className="text-sm text-gray-500">{btn.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
