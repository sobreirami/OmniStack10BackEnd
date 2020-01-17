const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

require('dotenv').config()

const app = express();

const dbUserName = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName     = process.env.DB_NAME;

mongoose.connect(`mongodb+srv://${dbUserName}:${dbPassword}@cluster0-5v7r9.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors());

app.use(express.json());
app.use(routes);

app.listen(3333);   