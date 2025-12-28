import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ["women", "men", "kid"], required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    new_price: { type: Number, required: true },
    old_price: { type: Number, default: 0 },
    inStock: { type: Number, default: 0 },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
