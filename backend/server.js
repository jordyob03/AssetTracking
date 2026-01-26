
// ==================================================
// BACKEND FILES
// ==================================================

// ================================
// File: backend/server.js
// ================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const FLOOR_FILE = "./floor-plan.json";
const ASSET_STATE_FILE = "./asset-state.json";

// ----------------------------
// Load floor plan
// ----------------------------
function loadFloor() {
  try {
    return JSON.parse(fs.readFileSync(FLOOR_FILE));
  } catch {
    return { rooms: [] };
  }
}

// ----------------------------
// Asset state (world coords)
// ----------------------------
const assets = {
  tag1: { id: "tag1", name: "Forklift", x: 5, y: 5, roomId: null },
  tag2: { id: "tag2", name: "Pallet Jack", x: 10, y: 10, roomId: null },
};

// ----------------------------
// Find room for asset
// ----------------------------
function findRoom(asset, rooms) {
  return rooms.find((room) => {
    return (
      asset.x >= room.x &&
      asset.x <= room.x + room.width &&
      asset.y >= room.y &&
      asset.y <= room.y + room.height
    );
  });
}

// ----------------------------
// HTTP API
// ----------------------------
app.get("/api/assets", (req, res) => {
  res.json(Object.values(assets));
});

// ----------------------------
// Start server
// ----------------------------
const server = app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Frontend connected");
  ws.send(JSON.stringify({ type: "hello", msg: "WebSocket OK" }));
});

// ----------------------------
// Broadcast helper
// ----------------------------
function broadcast(payload) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}

// ----------------------------
// Mock movement loop
// ----------------------------
setInterval(() => {
  const floor = loadFloor();

  Object.values(assets).forEach((asset) => {
    // random movement in meters
    asset.x += (Math.random() - 0.5) * 1;
    asset.y += (Math.random() - 0.5) * 1;

    const room = findRoom(asset, floor.rooms);
    asset.roomId = room ? room.id : null;
  });

  const snapshot = {
    timestamp: Date.now(),
    assets,
  };

  // Save snapshot
  fs.writeFileSync(ASSET_STATE_FILE, JSON.stringify(snapshot, null, 2));

  // Broadcast to frontend
  broadcast({
    type: "asset_update",
    assets: Object.values(assets),
  });
}, 1000);


