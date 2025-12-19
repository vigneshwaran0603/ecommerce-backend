import { Schema, model } from "mongoose";

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

export default model("Admin", adminSchema);