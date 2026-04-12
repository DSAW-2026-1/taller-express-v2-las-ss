const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(express.json({ limit: "64kb" }));

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Demo users (for classroom exercise)
const USERS = [
  { username: "admin", password: "admin123", role: "ADMIN" },
  { username: "user", password: "user123", role: "USER" }
];

function issueToken({ username, role }) {
  return jwt.sign({ sub: username, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (typeof header !== "string") return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

function auth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: "You're not allowed to do this" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "You're not allowed to do this" });
  }
}

app.post("/login", (req, res) => {
  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "invalid credential" });
  }

  const found = USERS.find((u) => u.username === username && u.password === password);
  if (!found) {
    return res.status(400).json({ message: "invalid credential" });
  }

  const token = issueToken({ username: found.username, role: found.role });
  return res.status(200).json({ token });
});

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/info", (_req, res) => {
  return res.status(200).json({
    message: "API up",
    endpoints: {
      health: "/health",
      login: "POST /login",
      request: "GET /request (Authorization: Bearer <token>)"
    }
  });
});

app.get("/request", auth, (req, res) => {
  const role = req.user?.role;

  if (role === "ADMIN") return res.status(200).json({ message: "Hi from ADMIN" });
  if (role === "USER") return res.status(200).json({ message: "Hi from USER" });
  return res.status(401).json({ message: "You're not allowed to do this" });
});

app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

