import type { Response } from "express";
import { AuthedRequest } from "../mddlewares/requireAuth";
import { ensureUniqueSlug, toSlug } from "../utils/slug";
import { Product } from "../models/Product";
import mongoose from "mongoose";
import { User } from "../models/User";

export const createProduct = async (req: AuthedRequest, res: Response) => {
  try {
    const { title, price } = req.body ?? {};

    if (!title || typeof price !== "number") {
      return res.status(400).json({
        ok: false,
        error: "title and price is required",
      });
    }

    const baseSlug = toSlug(String(title));
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const count = await Product.countDocuments({ slug: s });
      return count > 0;
    });

    const creatorId = new mongoose.Types.ObjectId(req.user!.id);

    const product = await Product.create({
      creatorId,
      title: String(title),
      description: "",
      price: Number(price),
      currency: "INR",
      visibility: "draft",
      slug,
      coverImageAssetId: null,
      stats: {
        assetCount: 0,
        soldCount: 0,
      },
    });

    await User.updateOne(
      {
        _id: creatorId,
        isCreator: false,
      },
      {
        $set: { isCreator: true },
      },
    );

    return res.json({ ok: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};
