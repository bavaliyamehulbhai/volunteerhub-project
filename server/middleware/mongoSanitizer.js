const sanitizeObject = (obj) => {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else {
          sanitizeObject(obj[key]);
        }
      }
    }
  }
  return obj;
};

const mongoSanitizer = (req, res, next) => {
  if (req.body) {
    sanitizeObject(req.body);
  }
  if (req.query) {
    // In Express v5, req.query is getter-only, but the returned object can be mutated in-place
    sanitizeObject(req.query);
  }
  if (req.params) {
    sanitizeObject(req.params);
  }
  next();
};

module.exports = mongoSanitizer;
