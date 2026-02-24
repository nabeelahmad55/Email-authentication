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

      const proto = nodeReq.headers?.["x-forwarded-proto"] || (nodeReq.protocol ? String(nodeReq.protocol).replace(':','') : "http");
      const host = nodeReq.headers?.host || nodeReq.hostname || "localhost";
      let path = nodeReq.url || nodeReq.originalUrl || "/";
      
      // Ensure path includes the tRPC endpoint prefix so fetchRequestHandler can parse it correctly
      const endpoint = "/trpc";
      if (!path.startsWith(endpoint)) {
        path = endpoint + (path.startsWith('/') ? '' : '/') + path;
      }
      
      const url = `${proto}://${host}${path}`;

      const headers = new Headers();
      const rawHeaders = nodeReq.headers || {};
      Object.entries(rawHeaders).forEach(([k, v]) => {
        if (v === undefined) return;
        if (Array.isArray(v)) headers.set(k, v.join(","));
        else headers.set(k, String(v));
      });

      const method = nodeReq.method || "GET";
      
      let body: any = undefined;
      if (method !== "GET" && method !== "HEAD") {
        if (nodeReq.body !== undefined && nodeReq.body !== null) {
          if (typeof nodeReq.body === "string" || nodeReq.body instanceof Buffer || nodeReq.body instanceof Uint8Array) {
            body = nodeReq.body;
          } else if (typeof nodeReq.body === "object") {
            body = JSON.stringify(nodeReq.body);
          } else {
            body = nodeReq.body;
          }
        } else {
          // If no parsed body, use the nodeReq stream
          body = nodeReq;
        }
      }

      // undici requires `duplex: 'half'` when passing a body stream
      const init: RequestInit = { method, headers, body } as any;
      if (body && (typeof body.on === 'function' || typeof body.getReader === 'function')) {
        (init as any).duplex = "half";
      }

      return new Request(url, init);
    }

    // Fallback: if event has method and url
    if (event && event.method && event.url) {
      const headers = new Headers(event.headers as any || {});
      const method = event.method;
      let body = method === "GET" || method === "HEAD" ? undefined : event.body;
      
      if (body !== undefined && body !== null) {
        if (typeof body === "object" && !(body instanceof Buffer) && !(body instanceof Uint8Array)) {
          body = JSON.stringify(body);
        }
      }

      const init: RequestInit = { method, headers, body } as any;
      if (body && (typeof body.on === 'function' || typeof body.getReader === 'function')) {
        (init as any).duplex = "half";
      }
      
      return new Request(event.url, init);
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
