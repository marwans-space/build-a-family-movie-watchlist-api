import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
    const head = req.headers.authorization;
    if (!head || !head.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided." });
    }

    const token = head.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
}