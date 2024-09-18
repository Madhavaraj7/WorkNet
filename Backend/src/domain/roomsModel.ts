import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",  // Reference the latest message in this room
    },
  },
  { timestamps: true }
);


const Room = mongoose.model("Room", roomSchema);
export default Room;
