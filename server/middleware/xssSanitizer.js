const escapeHtml = (str) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

const clean = (data) => {
  if (typeof data === "string") {
    return escapeHtml(data);
  }
  if (Array.isArray(data)) {
    return data.map(clean);
  }
  if (data !== null && typeof data === "object") {
    const cleanedObj = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        cleanedObj[key] = clean(data[key]);
      }
    }
    return cleanedObj;
  }
  return data;
};

const xssSanitizer = (req, res, next) => {
  if (req.body) {
    req.body = clean(req.body);
  }
  if (req.query) {
    req.query = clean(req.query);
  }
  if (req.params) {
    req.params = clean(req.params);
  }
  next();
};

module.exports = xssSanitizer;
