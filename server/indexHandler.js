import fs from "fs";

export function createIndexHandler(indexPath) {
  return (req, res, next) => {
    res.vary("X-Original-SaaS-Host");
    const originalHost = req.headers["x-original-saas-host"];
    if (typeof originalHost !== "string" || !originalHost) {
      res.sendFile(indexPath);
      return;
    }
    // Escape '<' so the value cannot close the script tag
    const value = JSON.stringify(originalHost).replace(/</g, "\\u003c");
    fs.promises
      .readFile(indexPath, "utf8")
      .then((html) => {
        if (!html.includes("<head>")) {
          next(new Error("index.html has no <head> element"));
          return;
        }
        res
          .type("html")
          .set("Cache-Control", "no-cache")
          .send(
            html.replace(
              "<head>",
              () => `<head><script>window.ORIGINAL_SAAS_HOST=${value};</script>`
            )
          );
      })
      .catch(next);
  };
}

// Static serving would return /index.html uninjected, so route it through the handler first
export function createIndexFileGuard(indexPath) {
  const handler = createIndexHandler(indexPath);
  return (req, res, next) =>
    req.path === "/index.html" ? handler(req, res, next) : next();
}
