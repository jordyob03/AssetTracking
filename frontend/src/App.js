import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FloorMapPage from "./pages/FloorMaps";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<AssetMapPage />} /> */}
        <Route path="/editor" element={<FloorMapPage />} />
      </Routes>
    </Router>
  );
}
