const BASE_URL = "https://todu.mn/bs/lms/v1";

// ── Storage helpers ──────────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem("team4_token");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("team4_user"));
  } catch {
    return null;
  }
}

export function getStoredUserId() {
  return getStoredUser()?.id ?? null;
}

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// ── {} prefix field parser ───────────────────────────────────────────────────

/**
 * The API returns some fields with a `{}` prefix containing JSON strings.
 * e.g. obj["{}role"] = '{"name":"teacher"}'
 * Usage: parseField(obj, "role") → { name: "teacher" }
 */
export function parseField(obj, key) {
  const raw = obj?.[`{}${key}`] ?? obj?.[key];
  if (raw == null) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return raw;
  }
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────

async function request(method, path, body) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }

  return data;
}

// ── Public API helpers ───────────────────────────────────────────────────────

export const apiGet = (path) => request("GET", path);
export const apiPost = (path, body) => request("POST", path, body);
export const apiPut = (path, body) => request("PUT", path, body);
export const apiDelete = (path, body) => request("DELETE", path, body);

/**
 * Merges current_user (logged-in user id) into a request body automatically.
 * Use for POST/PUT/DELETE endpoints that require { current_user }.
 */
export function withCurrentUser(body = {}) {
  return { ...body, current_user: getStoredUserId() };
}

// ── Auth convenience ─────────────────────────────────────────────────────────

export async function login(email, password) {
  const data = await apiPost("/token/email", {
    email,
    password,
    push_token: "",
  });

  if (!data) throw new Error("Хоосон хариу ирлээ");

  const token = data.token ?? data.access_token ?? data.access ?? null;
  if (!token) throw new Error("Token олдсонгүй");
  localStorage.setItem("team4_token", token);

  if (data.refresh_token) {
    localStorage.setItem("team4_refresh_token", data.refresh_token);
  }

  // Resolve user ID from response or JWT payload
  let userId = data.id ?? data.user_id ?? data.userId ?? null;
  if (!userId) {
    const jwt = decodeJwt(token);
    userId = jwt?.sub ?? jwt?.id ?? jwt?.user_id ?? null;
  }

  const qParam = userId ? `?current_user=${userId}` : "";
  let me = null;
  try {
    me = await apiGet(`/users/me${qParam}`);
  } catch {
    me = { id: userId, email };
  }

  localStorage.setItem("team4_user", JSON.stringify(me));
  return me;
}

export async function otpLogin(email, code) {
  const data = await apiPost("/otp/email/login", { email, code, push_token: "" });

  if (!data) throw new Error("Хоосон хариу ирлээ");

  const token = data.token ?? data.access_token ?? data.access ?? null;
  if (!token) throw new Error("Token олдсонгүй");
  localStorage.setItem("team4_token", token);

  if (data.refresh_token) {
    localStorage.setItem("team4_refresh_token", data.refresh_token);
  }

  let userId = data.id ?? data.user_id ?? data.userId ?? null;
  if (!userId) {
    const jwt = decodeJwt(token);
    userId = jwt?.sub ?? jwt?.id ?? jwt?.user_id ?? null;
  }

  const qParam = userId ? `?current_user=${userId}` : "";
  let me = null;
  try {
    me = await apiGet(`/users/me${qParam}`);
  } catch {
    me = { id: userId, email };
  }

  localStorage.setItem("team4_user", JSON.stringify(me));
  return me;
}

export async function logout() {
  const userId = getStoredUserId();
  try {
    await apiDelete("/token", { current_user: userId });
  } catch {
    // ignore — just clear local state
  }
  localStorage.removeItem("team4_token");
  localStorage.removeItem("team4_refresh_token");
  localStorage.removeItem("team4_user");
  localStorage.removeItem("team4_school");
  localStorage.removeItem("team4_role");
}
