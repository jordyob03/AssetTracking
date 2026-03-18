const WebSocket = require("ws");
const mqtt = require("mqtt");

// ---------------- CONFIG ----------------
const WS_PORT = 5000;
const MQTT_BROKER = "mqtt://100.83.220.12";
const MQTT_TOPIC = "rtls/#";
const OFFSET_X = 2;
const OFFSET_Y = 2;

// Scale factor for mapping (adjust for your UI)
const SCALE = 5;

// ---------------- WEBSOCKET SERVER ----------------
const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`📡 Position server running on ws://localhost:${WS_PORT}`);

// ---------------- SINGLE NURSE OBJECT ----------------
let nurse = {
  id: "nurse1",
  name: "Nurse Amy",
  x: 0,
  y: 0,
  type: "nurse",
  lastUpdate: Date.now(),
};

// ---------------- MQTT CLIENT ----------------
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on("connect", () => {
  console.log("✅ Connected to MQTT broker");

  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (err) console.error("❌ MQTT subscribe error:", err);
    else console.log("📡 Subscribed to", MQTT_TOPIC);
  });
});

// ---------------- HANDLE MQTT DATA ----------------
mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    // Ensure required data exists
    if (data.relative_x !== undefined && data.relative_y !== undefined) {


      nurse.x += data.relative_x;
      nurse.y += data.relative_y;

      nurse.lastUpdate = Date.now();

      console.log("📍 Nurse position:", nurse.x.toFixed(2), nurse.y.toFixed(2));
    }

  } catch (err) {
    console.error("❌ Invalid MQTT message:", message.toString());
  }
});

// ---------------- WEBSOCKET CONNECTION ----------------
wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  // Send initial position immediately
  ws.send(JSON.stringify({
    type: "position_update",
    assets: [nurse],
  }));
});

// ---------------- BROADCAST LOOP ----------------
setInterval(() => {
    const payload = {
        type: "position_update",
        assets: [{
            ...nurse,
            x: nurse.x + OFFSET_X,
            y: nurse.y + OFFSET_Y,
         }],
    };

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });

}, 1000);