const express = require('express');
const mongojs = require('mongojs');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
mongoose.connect(uri || "mongodb://localhost/workout", { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('mongodb connected');
});

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
  
app.get("/exercise", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});
  
app.get("/stats", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
});


app.get("/api/workouts", (req, res) => {
    db.Workout.find({})
      .populate("exercises")
      .then(dbWorkout => {
        res.json(dbWorkout);
    })
      .catch(err => {
        res.json(err);
    });
});
  
app.post("/api/workouts", (req, res) => {
    db.Workout.create({ day: Date.now() })
      .then(dbWorkout => {
        console.log(dbWorkout);
        res.json(dbWorkout);
    })
      .catch(({ message }) => {
        console.log(message);
        res.json(message);
    });
});
  
app.put("/api/workouts/:workout", (req, res) => {
    let id = req.params.workout;
    let data = req.body;
  
    db.Exercise.create(data).then(dbExercise => {
      console.log(dbExercise);
      db.Workout.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $push: { exercises: dbExercise } }
    )
        .then(dbWorkout => {
          res.json(dbWorkout);
        })
        .catch(err => {
          res.json(err);
        });
    });
});
  
app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({})
      .populate("exercises")
      .then(dbWorkout => {
        console.log(dbWorkout);
        res.json(dbWorkout);
    })
      .catch(err => {
        res.json(err);
    });
});



app.listen(PORT, () => {
    console.log(`connected on port ${PORT}`);
});