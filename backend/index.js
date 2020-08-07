const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const picks = require('./src/lib/picks')
const auth = require('./src/middleware/auth')

const app = express()
admin.initializeApp();

app.use(cors({ origin: true }));
app.use(auth.requiresAuth.bind(null, admin))


const context = {
    admin
}

app.post('/', (req, res) => picks.create(context, req, res));
app.post('/:pickId/vote', (req, res) => picks.vote(context, req, res));

exports.picks = functions.https.onRequest(app);

