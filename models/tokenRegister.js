import mongoose from "mongoose";

const tokenSchema = mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const emailToken = mongoose.model("Token", tokenSchema);
export default emailToken;
