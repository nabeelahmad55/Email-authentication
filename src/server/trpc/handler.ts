// Note: '@tanstack/react-start/server' does not export `defineEventHandler` in
// the environment this project runs in. Export a plain function instead.
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./root";

function eventToWebRequest(event: any): Request | null {
  try {
    // If event is already a Request
    if (typeof Request !== "undefined" && event instanceof Request) return event;

    // If event has a `request` property that's a Request (FetchEvent-like)
    if (event && event.request && typeof Request !== "undefined" && event.request instanceof Request) {
      return event.request as Request;
    }

    // Common Node handlers: try node req objects
    const nodeReq = event?.node?.req || event.req || event.request;
    if (nodeReq && typeof nodeReq.method === "string" && typeof nodeReq.url === "string") {
      // If it's already a Request-like object, attempt to use it directly
      if (typeof Request !== "undefined" && nodeReq instanceof Request) return nodeReq;

      const proto = nodeReq.headers?.["x-forwarded-proto"] || (nodeReq.protocol ? nodeReq.protocol.replace(':','') : "http");
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
      // If nodeReq is a stream (IncomingMessage), pass it as body; otherwise, undefined
      const body = method === "GET" || method === "HEAD" ? undefined : (nodeReq.body ?? nodeReq);

      return new Request(url, { method, headers, body });
    }

    // Fallback: if event has method and url
    if (event && event.method && event.url) {
      const headers = new Headers(event.headers as any || {});
      const method = event.method;
      const body = method === "GET" || method === "HEAD" ? undefined : event.body;
      return new Request(event.url, { method, headers, body });
    }

    return null;
  } catch (err) {
    console.error("eventToWebRequest error:", err);
    return null;
  }
}

export default async function (event: any) {
  const request = eventToWebRequest(event);
  if (!request) {
    // Some tooling (vite/esbuild) may import this module without an HTTP event.
    // Return a friendly 200 so visiting the route in a browser or module analysis
    // doesn't produce a 400 "No request" error.
    return new Response(JSON.stringify({ ok: true, message: "tRPC handler alive - no HTTP request available" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return fetchRequestHandler({
    endpoint: "/trpc",
    req: request,
    router: appRouter,
    createContext() {
      return {};
    },
    onError({ error, path }) {
      console.error(`tRPC error on '${path}':`, error);
    },
  });
  // Removed stray closing parenthesis that caused a syntax error when
  // transpiling with esbuild/vite. The function is correctly closed above.
}
