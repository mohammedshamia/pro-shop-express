import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    cart: {
      type: {
        items: [
          {
            itemTotalPrice: { type: Number, required: true },
            qty: { type: Number, required: true },
            product: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: "Product",
            },
          },
        ],
        totalPrice: {
          type: Number,
          required: true,
        },
        totalQty: {
          type: Number,
          required: true,
        },
      },
      default: {
        items: [],
        totalQty: 0,
        totalPrice: 0,
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
