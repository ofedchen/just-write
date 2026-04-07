import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import promptsRouter from "./routes/prompts.js";
import textsRouter from "./routes/texts.js";
import profileRouter from "./routes/profile.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { prisma } from "./lib/prisma.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

const app = express();
const port = Number(process.env.PORT) || 3004;
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
const isProduction = process.env.NODE_ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
app.use(
  cors({
    origin: corsOrigin,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRouter);
app.use("/api/prompts", promptsRouter);
app.use("/api/texts", textsRouter);
app.use("/api/profile", profileRouter);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

if (isProduction) {
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });
}

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}. Closing server gracefully...`);

  server.close(async (error) => {
    if (error) {
      console.error("Error while closing HTTP server", error);
      process.exit(1);
      return;
    }

    try {
      await prisma.$disconnect();
      console.log("HTTP server and DB connections closed");
      process.exit(0);
    } catch (disconnectError) {
      console.error("Error while disconnecting Prisma", disconnectError);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});
