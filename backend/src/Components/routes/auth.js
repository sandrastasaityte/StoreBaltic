import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  res.json({ success: true, token: "demo-token", username: "Admin", role: "admin" });
});

export default router;
