import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-3">
      {/* Logo + App Name */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-xl font-semibold">Safetrack</span>
      </div>

      {/* Right-side buttons */}
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 rounded hover:bg-gray-100">
          Settings
        </button>
        <button className="px-4 py-2 rounded hover:bg-red-100 text-red-600">
          Logout
        </button>
      </div>
    </header>
  );
}
