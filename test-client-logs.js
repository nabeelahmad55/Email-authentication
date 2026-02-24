
import fetch from "node-fetch";

fetch("http://localhost:3000/api/debug/client-logs", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    logs: [
      {
        level: "info",
        message: "Test log from Copilot",
        timestamp: new Date().toISOString(),
      },
    ],
  }),
})
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);
