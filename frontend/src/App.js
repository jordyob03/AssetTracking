import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FloorMapPage from "./pages/FloorMaps";
import HomePage from "./pages/HomePage";
import LiveTrackingPage from "./pages/LiveTrack";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<AssetMapPage />} /> */}
        <Route path="/editor" element={<FloorMapPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/live" element={<LiveTrackingPage />} />
      </Routes>
    </Router>
  );
}
