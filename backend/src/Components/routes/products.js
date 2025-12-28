import express from "express";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// Public: list products
router.get("/", async (req, res) => {
  const { category, q, limit = 100 } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (q) filter.name = { $regex: q, $options: "i" };

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json({ success: true, products });
});

// Public: get product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, product });
});

// Admin: create product
router.post("/", auth, admin, async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.json({ success: true, product: created });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

// Admin: update product
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, product: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

// Admin: delete product
router.delete("/:id", auth, admin, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true });
});

export default router;
