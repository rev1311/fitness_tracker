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

app.post("/api/workouts", (req, res) => {
    db.workout.create({ day: Date.now() })
        .then(dbworkout => {
        console.log(dbworkout);
        res.json(dbworkout);
        })
        .catch(({ message }) => {
        console.log(message);
        res.json(message);
    });
});
  
app.put("/api/workouts/:workout", (req, res) => {
    let id = req.params.workout;
    let data = req.body;
  
    db.Exercise.create(data).then(dbexercise => {
        console.log(dbexercise);
        db.workout.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $push: { exercises: dbexercise } })
        .then(dbworkout => {
        res.json(dbworkout);
        })
        .catch(err => {
        res.json(err);
        });
    });
});
  
  app.get("/api/workouts/range", (req, res) => {
    db.workout.find({})
        .populate("exercises")
        .then(dbworkout => {
        console.log(dbworkout);
        res.json(dbworkout);
        })
        .catch(err => {
        res.json(err);
    });
});



app.listen(PORT, () => {
    console.log(`connected on port ${PORT}`);
});