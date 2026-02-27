import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
<<<<<<< HEAD
import path from "path";
import { fileURLToPath } from "url";

<<<<<<< HEAD
let __dirname: string;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  // Fallback para quando import.meta.url não está disponível (ex: em arquivos compilados CJS)
  __dirname = process.cwd();
}
=======
>>>>>>> parent of cc61847 (Novo Layout)
=======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
>>>>>>> parent of e664a91 (Correção de Build)

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

<<<<<<< HEAD
  app.use(express.urlencoded({ extended: false }));
<<<<<<< HEAD
  // Servir arquivos estáticos da pasta public do cliente
  const assetsPath = process.env.NODE_ENV === "production" 
    ? path.resolve(__dirname, "public", "assets")
    : path.resolve(__dirname, "..", "client", "public", "assets");
  app.use("/assets", express.static(assetsPath));
=======
app.use(express.urlencoded({ extended: false }));
>>>>>>> parent of cc61847 (Novo Layout)
=======
  // Servir arquivos estáticos da pasta public do cliente explicitamente se necessário
  app.use("/assets", express.static(path.resolve(__dirname, "..", "client", "public", "assets")));
>>>>>>> parent of e664a91 (Correção de Build)

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
