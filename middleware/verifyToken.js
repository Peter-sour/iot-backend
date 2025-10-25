const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ message: "Token tidak ditemukan." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token tidak valid." });
  }
}

module.exports = verifyToken;