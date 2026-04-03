import express from "express";
import path from "path";
import { Readable } from "stream";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 5000;
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

  app.use(express.json());

  app.use("/api", async (req, res) => {
    try {
      const targetUrl = new URL(req.originalUrl.replace(/^\/api/, "") || "/", BACKEND_URL);
      const headers = new Headers();

      for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        if (["host", "content-length"].includes(key.toLowerCase())) continue;
        if (Array.isArray(value)) {
          headers.set(key, value.join(","));
        } else {
          headers.set(key, value);
        }
      }

      const init = {
        method: req.method,
        headers
      };

      if (!["GET", "HEAD"].includes(req.method)) {
        init.body = JSON.stringify(req.body ?? {});
        if (!headers.has("content-type")) {
          headers.set("content-type", "application/json");
        }
      }

      const backendResponse = await fetch(targetUrl, init);

      res.status(backendResponse.status);
      backendResponse.headers.forEach((value, key) => {
        if (!["transfer-encoding", "content-encoding", "content-length", "connection"].includes(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      });

      if (backendResponse.body) {
        Readable.fromWeb(backendResponse.body).pipe(res);
      } else {
        res.end();
      }
    } catch (error) {
      res.status(502).json({ error: "Unable to reach backend API", detail: String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
