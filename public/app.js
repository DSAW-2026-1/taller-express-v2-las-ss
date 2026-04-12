const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "taller_token";
const out = $("out");
const pillToken = $("pillToken");
const apiBaseEl = $("apiBase");

function getApiBase() {
  return `${window.location.protocol}//${window.location.host}`;
}

function getToken() {
  return localStorage.getItem(STORAGE_KEY);
}

function setToken(token) {
  if (!token) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, token);
  syncUi();
}

function syncUi() {
  const token = getToken();
  if (token) {
    pillToken.textContent = "Token: (sí)";
    pillToken.classList.add("ok");
    pillToken.classList.remove("bad");
  } else {
    pillToken.textContent = "Token: (no)";
    pillToken.classList.remove("ok");
    pillToken.classList.add("bad");
  }
  apiBaseEl.textContent = getApiBase();
}

function pretty(obj) {
  return typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

async function readJsonSafe(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text || null;
  }
}

function writeResult(title, status, data) {
  const lines = [];
  lines.push(`${title}`);
  lines.push(`status: ${status}`);
  lines.push("");
  lines.push(pretty(data));
  out.textContent = lines.join("\n");
}

async function doLogin() {
  const username = $("username").value;
  const password = $("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await readJsonSafe(res);
  writeResult("POST /login", res.status, data);

  if (res.ok && data && typeof data.token === "string") {
    setToken(data.token);
  }
}

async function doRequest() {
  const token = getToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch("/request", { headers });
  const data = await readJsonSafe(res);
  writeResult("GET /request", res.status, data);
}

$("btnLogin").addEventListener("click", () => {
  doLogin().catch((err) => writeResult("POST /login", "error", String(err)));
});

$("btnRequest").addEventListener("click", () => {
  doRequest().catch((err) => writeResult("GET /request", "error", String(err)));
});

$("btnClear").addEventListener("click", () => {
  setToken(null);
  writeResult("Token", 200, { message: "token cleared" });
});

syncUi();

