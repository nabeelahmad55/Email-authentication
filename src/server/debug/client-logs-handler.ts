// Note: '@tanstack/react-start/server' does not export `defineEventHandler` in
// the environment this project runs in. Export a plain function instead.

interface LogEntry {
  level: string;
  message: string;
  timestamp: Date | string;
  url?: string;
  userAgent?: string;
  stacks?: string[];
  extra?: any;
}

interface ClientLogRequest {
  logs: LogEntry[];
}

function eventToWebRequest(event: any): Request | null {
  try {
    if (typeof Request !== "undefined" && event instanceof Request) return event;
    if (event && event.request && typeof Request !== "undefined" && event.request instanceof Request) return event.request as Request;

    const nodeReq = event?.node?.req || event.req || event.request;
    if (nodeReq && typeof nodeReq.method === "string" && typeof nodeReq.url === "string") {
      const proto = nodeReq.headers?.["x-forwarded-proto"] || (nodeReq.protocol ? String(nodeReq.protocol).replace(":", "") : "http");
      const host = nodeReq.headers?.host || nodeReq.hostname || "localhost";
      const path = nodeReq.url || nodeReq.originalUrl || "/";
      const url = `${proto}://${host}${path}`;

      const headers = new Headers();
      const rawHeaders = nodeReq.headers || {};
      Object.entries(rawHeaders).forEach(([k, v]) => {
        if (v === undefined) return;
        if (Array.isArray(v)) headers.set(k, v.join(","));
        else headers.set(k, String(v));
      });

      const method = nodeReq.method || "GET";
      const body = method === "GET" || method === "HEAD" ? undefined : (nodeReq.body ?? undefined);

      // undici requires `duplex: 'half'` when passing a body stream
      const init: RequestInit = { method, headers, body } as any;
      if (body) (init as any).duplex = "half";

      return new Request(url, init as RequestInit);
    }

    if (event && event.method && event.url) {
      const headers = new Headers(event.headers as any || {});
      const method = event.method;
      const body = method === "GET" || method === "HEAD" ? undefined : event.body;
      const init: RequestInit = { method, headers, body } as any;
      if (body) (init as any).duplex = "half";
      return new Request(event.url, init as RequestInit);
    }

    return null;
  } catch (err) {
    console.error("eventToWebRequest error:", err);
    return null;
  }
}

export default async function (event: any) {
  console.log("[client-logs-handler] Handler invoked", { eventType: typeof event, eventKeys: event && typeof event === 'object' ? Object.keys(event) : undefined });
  const request = eventToWebRequest(event);

  if (request) {
    // Log all headers
    const headersObj = {};
    for (const [k, v] of request.headers.entries()) headersObj[k] = v;
    console.log("[client-logs-handler] Incoming headers:", headersObj);
    // Log raw body (non-consuming)
    try {
      const clone = request.clone();
      const preview = await clone.text();
      console.log("[client-logs-handler] Incoming raw body (preview):", preview);
    } catch (err) {
      console.warn("[client-logs-handler] Could not preview body", err);
    }
  }

  if (!request) {
    console.warn("[client-logs-handler] No request object could be constructed from event", { event });
    return new Response(JSON.stringify({ ok: false, message: "client-logs handler - no request available" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`[client-logs-handler] Incoming request: ${request.method} ${request.url}`);

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: true, message: "Client logs endpoint - send POST with logs to record" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }


  try {
    let bodyText = await request.text();
    let body: ClientLogRequest | undefined;
    if (bodyText && bodyText.trim().length > 0) {
      console.log("[client-logs-handler] Raw request body:", bodyText);
      try {
        body = JSON.parse(bodyText);
      } catch (parseErr) {
        console.error("[client-logs-handler] Failed to parse JSON body", parseErr);
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      // Try to parse as JSON stream (for fetch, node-fetch, etc.)
      try {
        body = await request.json();
        console.log("[client-logs-handler] Parsed JSON body from stream:", body);
      } catch (parseErr) {
        console.error("[client-logs-handler] Failed to parse JSON body from stream", parseErr);
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (!body || !body.logs || !Array.isArray(body.logs)) {
      console.warn("[client-logs-handler] Invalid request body: missing or non-array 'logs'", { body });
      return new Response("Invalid request body", { status: 400 });
    }

    // Forward each log to the server console
    body.logs.forEach((log) => {
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      const location = log.url ? ` (${log.url})` : "";
      const prefix = `[browser] [${timestamp}]`;

      let message = `${prefix} [${log.level}] ${log.message}${location}`;

      // Add stack traces if available
      if (log.stacks && log.stacks.length > 0) {
        message +=
          "\n" +
          log.stacks
            .map((stack) =>
              stack
                .split("\n")
                .map((line) => `    ${line}`)
                .join("\n"),
            )
            .join("\n");
      }

      // Add extra data if available
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (log.extra && (Array.isArray(log.extra) ? log.extra.length > 0 : Object.keys(log.extra || {}).length > 0)) {
        message +=
          "\n    Extra data: " +
          JSON.stringify(log.extra, null, 2)
            .split("\n")
            .map((line, i) => (i === 0 ? line : `    ${line}`))
            .join("\n");
      }

      // Log to server console based on level
      switch (log.level) {
        case "error":
          console.error(message);
          break;
        case "warn":
          console.warn(message);
          break;
        case "info":
          console.info(message);
          break;
        case "debug":
          console.log(message);
          break;
        default:
          console.log(message);
      }
    });

    console.log("[client-logs-handler] Successfully processed logs", { count: body.logs.length });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[client-logs-handler] Error processing client logs:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
