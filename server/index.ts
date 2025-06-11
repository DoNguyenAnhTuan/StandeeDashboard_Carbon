import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let latestActual = 0; // dùng để lưu `total_actual` lấy được từ script

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

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Route API cho React gọi
app.get("/api/actual", (_, res) => {
  const filePath = path.join(__dirname, "../client/public/api/actual_blocks.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Lỗi đọc actual_blocks.json:", err);
      return res.status(500).json({ error: "Không đọc được dữ liệu actual." });
    }
    try {
      const blocks = JSON.parse(data);
      res.json(blocks);
    } catch (parseErr) {
      console.error("Lỗi parse JSON:", parseErr);
      res.status(500).json({ error: "Dữ liệu JSON lỗi." });
    }
  });
});

// Hàm gọi Python script và lấy `total_actual`
function runDataUpdateScript() {
  exec("python ./scripts/fetch_site_data.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Python script error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
    }

    console.log(`Python script output:\n${stdout}`);

    const match = stdout.match(/Tong actual hom nay:\s*([\d.]+)/);
    latestActual = match ? parseFloat(match[1]) : 0;
    console.log(`total_actual cập nhật: ${latestActual} kWh`);
  });
}

// Gọi ngay khi khởi động server
runDataUpdateScript();
// Gọi lại mỗi 1 giờ
setInterval(runDataUpdateScript, 1 * 60 * 60 * 1000);

// Khởi động server
(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 3000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
