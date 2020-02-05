const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  type: String,
  name: String,
  reps: Number,
  sets: Number,
  duration: Number,
  weight: Number,
  distance: Number
});

const exercise = mongoose.model("exercise", exerciseSchema);

module.exports = exercise;