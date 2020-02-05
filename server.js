const express = require('express');
const mongojs = require('mongojs');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const databaseUrl = "warmup";
const collections = ["workouts"];
const db = mongojs[databaseUrl, collections];



const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dbworkout", { useNewUrlParser: true });

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('app/public'));



app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/exercise", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});
  
app.get("/stats", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.get("/api/exercises", function(req,res) {
    db.workout.find({})
        .populate("exercises")
        .then(dbworkout => {
        res.json(dbworkout);
        })
        .catch(err => {
        res.json(err);
        });
});



app.listen(PORT, () => {
    console.log(`connected on port ${PORT}`);
});