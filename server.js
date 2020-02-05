const express = require('express');
const mongojs = require('mongojs');
const logger = require('morgan');
const mongoose = require('mongoose');


const databaseUrl = "warmup";
const collections = ["workouts"];
const db = mongojs[databaseUrl, collections];



const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dbExample", { useNewUrlParser: true });

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('app/public'));







app.listen(PORT, () => {
    console.log(`connected on port ${PORT}`);
});