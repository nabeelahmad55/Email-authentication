import React from "react";

export function TestClientLogsButton() {
  const sendTestLog = async () => {
    try {
      const res = await fetch("/api/debug/client-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logs: [
            {
              level: "info",
              message: "Test log from browser button",
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      const data = await res.json();
      alert("Response: " + JSON.stringify(data));
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <button
      style={{
        padding: "10px 20px",
        background: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "20px 0"
      }}
      onClick={sendTestLog}
    >
      Send Test Log to /api/debug/client-logs
    </button>
  );
}
