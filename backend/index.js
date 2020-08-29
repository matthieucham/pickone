const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const picks = require('./src/lib/picks');
const lists = require('./src/lib/lists');
const cleanup = require('./src/lib/cleanup');
const auth = require('./src/middleware/auth');

const app = express();
admin.initializeApp();

app.use(cors({ origin: true }));
app.use(auth.requiresAuth.bind(null, admin));


const context = {
    admin
}

app.post('/testcleanup', (req, res) => cleanup.cleanupFromHTTPS(context, req, res));

app.delete('/:pickId/vote/:voteId', (req, res) => picks.cancelVote(context, req, res));
app.put('/:pickId/vote', (req, res) => picks.vote(context, req, res));
app.post('/registrations/', (req, res) => picks.createRegistration(context, req, res));
app.post('/pushtokens/', (req, res) => picks.storePushToken(context, req, res));
app.post('/lists/', (req, res) => lists.createList(context, req, res));
app.put('/lists/:listId', (req, res) => lists.editList(context, req, res));
app.delete('/lists/:listId', (req, res) => lists.deleteList(context, req, res));
app.post('/:pickId', (req, res) => picks.resolve(context, req, res));
app.put('/:pickId', (req, res) => picks.cancel(context, req, res));
app.post('/', (req, res) => picks.create(context, req, res));

exports.picks = functions.https.onRequest(app);

// exports.scheduledFirestoreExport = functions.pubsub
//                                             .schedule('every 24 hours')
//                                             .onRun((context) => {

//   const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
//   const databaseName = 
//     client.databasePath(projectId, '(default)');

//   return client.exportDocuments({
//     name: databaseName,
//     outputUriPrefix: bucket,
//     // Leave collectionIds empty to export all collections
//     // or set to a list of collection IDs to export,
//     // collectionIds: ['users', 'posts']
//     collectionIds: []
//     })
//   .then(responses => {
//     const response = responses[0];
//     console.log(`Operation Name: ${response['name']}`);
//   })
//   .catch(err => {
//     console.error(err);
//     throw new Error('Export operation failed');
//   });
// });