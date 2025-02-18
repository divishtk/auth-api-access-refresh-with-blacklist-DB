import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      requied: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Blacklist = mongoose.model("Blacklist", blacklistSchema);
