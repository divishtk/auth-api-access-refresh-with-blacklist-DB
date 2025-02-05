import mongoose from "mongoose";

const passwordForgetSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      requied: true,
      ref: "User",
    },

    token: {
      type: String,
      requied: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PasswordReset = mongoose.model(
  "PasswordReset",
  passwordForgetSchema
);
