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

function loadFloor() {
  try {
    return JSON.parse(fs.readFileSync(FLOOR_FILE));
  } catch {
    return { rooms: [] };
  }
}

const assets = {
  tag1: { id: "tag1", name: "Heart Monitor 1", roomId: 1769697061224, type: "heart_monitor", inUse: true },
  tag2: { id: "tag2", name: "Jordyn O", roomId: 1769697061224, type: "nurse", inUse: false },
  tag3: { id: "tag3", name: "Miguel P", roomId: 1769697072570, type: "nurse", inUse: false },
  tag4: { id: "tag4", name: "Mitch R", roomId: 1769697039975, type: "nurse", inUse: false },
  tag5: { id: "tag5", name: "Stretcher 1", roomId: 1769697177914, type: "stretcher", inUse: false },
  tag6: { id: "tag6", name: "Stretcher 2", roomId: 1769697177914, type: "stretcher", inUse: false },
  tag7: { id: "tag7", name: "ECG Machine", roomId: 1769697228412, type: "ecg_machine", inUse: false },
  tag8: { id: "tag8", name: "Heart Monitor 2", roomId: 1769697228412, type: "heart_monitor", inUse: false },
};

app.get("/api/assets", (req, res) => {
  res.json(Object.values(assets));
});

const server = app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Frontend connected");
  ws.send(JSON.stringify({ type: "hello" }));
});

function broadcast(payload) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}

// --- Emergency alert function ---
function sendEmergencyAlert(nurseId, message = "Emergency!") {
  const nurse = assets[nurseId];
  if (!nurse) return;

  const payload = {
    type: "emergency_alert",
    nurseId: nurse.id,
    nurseName: nurse.name,
    roomId: nurse.roomId,
    message,
    timestamp: Date.now(),
  };

  broadcast(payload);
  console.log("Emergency alert sent:", payload);
}


setInterval(() => {
  const floor = loadFloor();
  if (!floor.rooms || floor.rooms.length === 0) return;

  const hall = floor.rooms.find(r => r.name === "Hall");
  const otherRooms = floor.rooms.filter(r => r.name !== "Hall");

  Object.values(assets).forEach(asset => {
    const shouldMove = Math.random() < 0.2; // 20% chance to move

    if (!shouldMove) {
      return; 
    }

    const currentRoom = floor.rooms.find(r => r.id === asset.roomId);

    if (!currentRoom) {
      const randomRoom = floor.rooms[Math.floor(Math.random() * floor.rooms.length)];
      asset.roomId = randomRoom.id;
      console.log(`${asset.name} initialized → ${randomRoom.name}`);
      return;
    }

    if (currentRoom.name === "Hall") {
      const randomRoom = otherRooms[Math.floor(Math.random() * otherRooms.length)];
      asset.roomId = randomRoom.id;
      console.log(`${asset.name} moved Hall → ${randomRoom.name}`);
    } 
    else {
      if (hall) {
        asset.roomId = hall.id;
        console.log(`${asset.name} moved ${currentRoom.name} → Hall`);
      }
    }
  });

  broadcast({
    type: "asset_update",
    assets: Object.values(assets),
  });

}, 2000);