const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const siteRoot = "/karta.framer.website";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".txt": "text/plain; charset=utf-8",
};

function safeJoin(base, reqPath) {
  const decoded = decodeURIComponent(reqPath.split("?")[0]);
  const cleaned = path.normalize(decoded).replace(/^([/\\])+/, "");
  const full = path.join(base, cleaned);
  if (!full.startsWith(base)) return null;
  return full;
}

/** Map Framer clean routes → HTTrack .html files */
function rewrite(urlPath) {
  let p = urlPath.split("?")[0];
  if (p === "/" || p === "") return `${siteRoot}/index.html`;

  // Allow short URLs: /works → site works page
  if (!p.startsWith(siteRoot)) {
    if (p === "/works" || p.startsWith("/works/")) p = siteRoot + p;
    else if (p === "/agency") p = siteRoot + "/agency";
    else if (p === "/insights" || p.startsWith("/insights/")) p = siteRoot + p;
    else if (p === "/contacts") p = siteRoot + "/contacts";
    else if (p === "/legal" || p.startsWith("/legal/")) p = siteRoot + p;
    else if (p === "/404") p = siteRoot + "/404";
  }

  if (p === siteRoot || p === `${siteRoot}/`) return `${siteRoot}/index.html`;

  // already has extension
  if (path.extname(p)) return p;

  // directory-style Framer routes
  const candidates = [`${p}.html`, path.join(p, "index.html").replace(/\\/g, "/")];
  for (const c of candidates) {
    const full = safeJoin(root, c);
    if (full && fs.existsSync(full) && fs.statSync(full).isFile()) return c;
  }
  return p;
}

const server = http.createServer((req, res) => {
  const rewritten = rewrite(req.url || "/");
  let filePath = safeJoin(root, rewritten);
  if (!filePath) {
    res.writeHead(400);
    res.end("Bad path");
    return;
  }

  fs.stat(filePath, (err, st) => {
    if (!err && st.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found: " + rewritten);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": types[ext] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(data);
    });
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`KARTA local: http://127.0.0.1:${port}/`);
  console.log(`Home: http://127.0.0.1:${port}/karta.framer.website/`);
});
