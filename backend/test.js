const mqtt = require("mqtt");

const MQTT_BROKER = "mqtt://100.83.220.12";
const MQTT_TOPIC = "rtls/#";

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (err) console.error("MQTT subscribe error:", err);
    else console.log("Subscribed to", MQTT_TOPIC);
  });
});

mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    console.log("MQTT Data:", data);

    /*
    Example message you showed:

    {
      time: 2476927,
      phase: -0.057,
      mag: 27.432,
      angle: -0.0
    }
    */

  } catch (err) {
    console.error("Invalid MQTT message:", message.toString());
  }
});