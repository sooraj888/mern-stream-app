const {  DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// const Users = sequelize.define('users', {
//   userId: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   userName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   email: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//   },
// });


const User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
});

// module.exports = Users;

// const mongoose = require("mongoose");
// const validator = require("validator");

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please Enter Your Name"],
//     maxLength: [30, "Name cannot exceed 30 characters"],
//     minLength: [4, "Name should have at list 4 characters"],
//   },

//   email: {
//     type: String,
//     required: [true, "Please Enter Your Email"],
//     validate: [validator.isEmail, "Please Enter a Valid Email"],
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Please Enter Your Password"],
//     minLength: [8, "Password Should be Grater Than 8 Characters "],
//     select: false,
//   },

//   avatar: {
//     type: {
//       public_id: {
//         type: String,
//         required: true,
//       },
//       url: {
//         type: String,
//         required: true,
//       },
//     },
//     required: false,
//   },
//   role: {
//     type: String,
//     default: "user",
//   },
//   createdDate: {
//     type: Date,
//     default: Date.now(),
//   },
//   resetPasswordToken: String,
//   resetPasswordExpire: Date,
// });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   this.password = await bcrypt.hash(this.password, 10);
// });

// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// // Compare password

// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Generating Object token

// userSchema.methods.getResetPasswordToken = function () {
//   // Generating Token

//   const resetToken = crypto.randomBytes(20).toString("hex");

//   // Hashing adding to userSchema

//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
//   return resetToken;
// };

module.exports = {User}
