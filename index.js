import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { TransferEngine } from "./solana/transferLoop.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const engine = new TransferEngine(process.env);

function loadContent() {
  const raw = readFileSync(join(__dirname, "content.json"), "utf-8");
  return JSON.parse(raw);
}

app.get("/content", (_req, res) => {
  try {
    return res.json(loadContent());
  } catch (e) {
    return res.status(500).json({ error: "Failed to load content" });
  }
});

app.get("/content/:id", (req, res) => {
  try {
    const items = loadContent();
    const item = items.find((c) => c.id === req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  } catch (e) {
    return res.status(500).json({ error: "Failed to load content" });
  }
});

app.post("/start", async (req, res) => {
  const { userPubkey, creatorWallet } = req.body || {};
  if (!userPubkey) return res.status(400).json({ error: "Missing userPubkey" });
  if (!creatorWallet) return res.status(400).json({ error: "Missing creatorWallet" });

  try {
    await engine.start(userPubkey, creatorWallet);
    return res.json({ ok: true, status: "starting" });
  } catch (e) {
    return res.status(409).json({ error: e.message });
  }
});

app.post("/stop", (_req, res) => {
  engine.stop();
  return res.json({ ok: true });
});

app.get("/logs", (_req, res) => {
  return res.json(engine.getLogs());
});

app.get("/status", (_req, res) => {
  return res.json(engine.getStatus());
});

const port = Number(process.env.PORT || 4020);
app.listen(port, () => console.log(`Flow402x backend on :${port}`));
